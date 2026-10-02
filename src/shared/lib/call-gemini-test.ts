import {
  generatedTestQuestionSchema,
  type GenerateTestRequest,
  type GenerateTestResult,
  type GeneratedTestQuestion,
} from "./generate-test";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

export async function generateTestWithGemini(
  request: GenerateTestRequest,
): Promise<GenerateTestResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;

  if (apiKey == null || apiKey.length === 0) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const systemInstruction = buildTestSystemInstruction(request);
  const userPrompt = buildTestUserPrompt(request);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(getGeminiErrorMessage(payload) ?? "Gemini request failed");
  }

  const text = getGeminiText(payload)?.trim();

  if (text == null || text.length === 0) {
    throw new Error("Gemini returned an empty response");
  }

  return parseTestResult(text);
}

function buildTestSystemInstruction(request: GenerateTestRequest): string {
  const language = request.locale === "kz" ? "Kazakh" : "Russian";
  const languageLock =
    request.locale === "kz"
      ? "Жауапты ТЕК қазақ тілінде жаз. Барлық сұрақтар мен нұсқалар тек қазақша болуы тиіс. Орыс тілінде жазуға болмайды."
      : "Пиши ответ ТОЛЬКО на русском языке. Все вопросы и варианты должны быть строго на русском.";

  return [
    "You are a senior historian, educator and test developer for Tarih, the educational platform for the History of Kazakhstan.",
    `Generate exactly ${request.count} high quality quiz questions for students preparing for school exams and ENT (ЕНТ / ҰБТ).`,
    languageLock,
    `Target language is ${language}. The entire output MUST be in ${language}.`,
    "Strict historical accuracy is mandatory: dates, khans, batyrs, treaties, battles, administrative reforms, archaeological cultures, national liberation movements.",
    "Do not produce duplicate or trivial questions. Avoid humorous or obviously fake distractors; incorrect options must be historically plausible mistakes.",
    getQuestionTypeRules(request.questionType),
    'Output JSON schema only: {"questions":[{"text":"...","type":"SINGLE_CHOICE","points":1,"options":[{"text":"...","isCorrect":true}]}]}. No markdown wrapping, no extra keys.',
  ].join(" ");
}

function getQuestionTypeRules(
  questionType: GenerateTestRequest["questionType"],
): string {
  switch (questionType) {
    case "SINGLE_CHOICE":
      return "All questions must be type 'SINGLE_CHOICE': exactly 4 options per question, exactly 1 option with isCorrect: true, 3 with isCorrect: false.";
    case "MULTIPLE_CHOICE":
      return "All questions must be type 'MULTIPLE_CHOICE': 4 or 5 options per question, exactly 2 options with isCorrect: true, the rest false.";
    case "TRUE_FALSE":
      return "All questions must be type 'TRUE_FALSE': exactly 2 options (True and False in the output language), exactly 1 with isCorrect: true.";
    case "MIXED":
    default:
      return "Use a healthy mix of question types: predominantly 'SINGLE_CHOICE' (4 options, 1 correct), with some 'MULTIPLE_CHOICE' (4-5 options, 2 correct) and 'TRUE_FALSE' (2 options, 1 correct).";
  }
}

function buildTestUserPrompt(request: GenerateTestRequest): string {
  const language = request.locale === "kz" ? "Kazakh" : "Russian";
  const lines: string[] = [
    `Language: ${language} (${request.locale})`,
    `Generate number of questions: ${request.count}`,
    `Requested question type mode: ${request.questionType}`,
  ];

  if (request.courseTitle) {
    lines.push(`Course Title: ${request.courseTitle}`);
  }
  if (request.courseDescription) {
    lines.push(`Course Description: ${request.courseDescription}`);
  }
  if (request.lessonTitle) {
    lines.push(`Lesson Title: ${request.lessonTitle}`);
  }
  if (request.lessonDescription) {
    lines.push(`Lesson Description: ${request.lessonDescription}`);
  }
  if (request.testTitle) {
    lines.push(`Test Title: ${request.testTitle}`);
  }
  if (request.testDescription) {
    lines.push(`Test Description: ${request.testDescription}`);
  }
  if (request.topicHint) {
    lines.push(`Specific topic focus / requirements: ${request.topicHint}`);
  }
  if (request.existingQuestions && request.existingQuestions.length > 0) {
    lines.push(
      `Do NOT duplicate any of these existing questions: ${request.existingQuestions.join(" | ")}`,
    );
  }

  return lines.join("\n");
}

function parseTestResult(raw: string): GenerateTestResult {
  const stripped = stripMarkdownFence(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  const rawQuestions =
    isRecord(parsed) && Array.isArray(parsed.questions)
      ? parsed.questions
      : Array.isArray(parsed)
        ? parsed
        : null;

  if (!rawQuestions || rawQuestions.length === 0) {
    throw new Error("AI returned no questions");
  }

  const validQuestions: GeneratedTestQuestion[] = [];

  for (const item of rawQuestions) {
    const parseResult = generatedTestQuestionSchema.safeParse(item);
    if (parseResult.success) {
      const q = parseResult.data;
      const hasCorrect = q.options.some((o) => o.isCorrect);
      const hasIncorrect = q.options.some((o) => !o.isCorrect);
      if (hasCorrect && hasIncorrect) {
        validQuestions.push(q);
      }
    }
  }

  if (validQuestions.length === 0) {
    throw new Error("No valid questions could be extracted from AI response");
  }

  return { questions: validQuestions };
}

function stripMarkdownFence(text: string): string {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
}

function getGeminiText(payload: unknown): string | undefined {
  if (!isRecord(payload) || !Array.isArray(payload.candidates)) {
    return undefined;
  }

  const candidate = payload.candidates[0];

  if (!isRecord(candidate) || !isRecord(candidate.content)) {
    return undefined;
  }

  if (!Array.isArray(candidate.content.parts)) {
    return undefined;
  }

  const texts = candidate.content.parts.flatMap((part) => {
    if (!isRecord(part) || typeof part.text !== "string") return [];
    if (part.thought === true) return [];

    return [part.text];
  });

  if (texts.length === 0) return undefined;

  return texts.join("").trim();
}

function getGeminiErrorMessage(payload: unknown): string | undefined {
  if (!isRecord(payload) || !isRecord(payload.error)) {
    return undefined;
  }

  if (typeof payload.error.message !== "string") {
    return undefined;
  }

  return payload.error.message;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
