import type { GenerateCopyRequest } from "./generate-copy";
import { getContextSnippets } from "./generate-copy";

const ENTITY_LABEL = {
  course: { kz: "курс", ru: "курс" },
  lesson: { kz: "сабақ", ru: "урок" },
  test: { kz: "тест", ru: "тест" },
  question: { kz: "сұрақ", ru: "вопрос" },
} as const;

const FIELD_LABEL = {
  title: { kz: "атауы", ru: "название" },
  description: { kz: "сипаттамасы", ru: "описание" },
  questionText: { kz: "сұрақ мәтіні", ru: "текст вопроса" },
  option: { kz: "жауап нұсқасы", ru: "вариант ответа" },
} as const;

export function getOutputLanguage(
  locale: GenerateCopyRequest["locale"],
): "Kazakh" | "Russian" {
  return locale === "kz" ? "Kazakh" : "Russian";
}

export function buildSystemInstruction(request: GenerateCopyRequest): string {
  const language = getOutputLanguage(request.locale);
  const entity = ENTITY_LABEL[request.entity][request.locale];
  const field = FIELD_LABEL[request.field][request.locale];
  const languageLock =
    request.locale === "kz"
      ? "Жауапты тек қазақ тілінде жаз. Орыс тілінде жазуға болмайды."
      : "Пиши ответ только на русском языке. Нельзя писать на казахском.";

  if (request.entity === "question") {
    return buildQuestionSystemInstruction(
      request,
      language,
      entity,
      field,
      languageLock,
    );
  }

  return [
    "You are an editor for Tarih, an EdTech platform with history courses for school students in Kazakhstan.",
    `Write the ${field} of a ${entity}.`,
    languageLock,
    `Site UI language is ${language} (${request.locale}). The entire output MUST be in ${language}.`,
    "If source fields are in another language, translate and rewrite them into the site language. Keep the topic.",
    "Output ONLY the requested text: no quotes, no markdown, no labels, no commentary.",
    request.field === "title"
      ? "Title: specific, 4–80 characters, no trailing period, not clickbait."
      : "Description: 1–3 sentences, 50–400 characters, clear for students, not promotional.",
    "If the current field has text, rewrite and improve it: keep the topic, make it clearer.",
    "If the current field is a short hint, expand it into a polished result.",
    "If the current field is empty, create it from the other fields and parent context.",
    "Do not invent a different subject than the context implies.",
  ].join(" ");
}

export function buildUserPrompt(request: GenerateCopyRequest): string {
  const language = getOutputLanguage(request.locale);
  const lines = [
    `Site language: ${language} (${request.locale}) — write the result in this language only.`,
    `Entity: ${request.entity}`,
    `Field to write: ${request.field}`,
    `Current title: ${formatValue(request.title)}`,
    `Current description: ${formatValue(request.description)}`,
  ];

  if (request.parent?.courseTitle || request.parent?.courseDescription) {
    lines.push(
      `Parent course title: ${formatValue(request.parent.courseTitle)}`,
      `Parent course description: ${formatValue(request.parent.courseDescription)}`,
    );
  }

  if (request.parent?.lessonTitle || request.parent?.lessonDescription) {
    lines.push(
      `Parent lesson title: ${formatValue(request.parent.lessonTitle)}`,
      `Parent lesson description: ${formatValue(request.parent.lessonDescription)}`,
    );
  }

  if (request.parent?.testTitle || request.parent?.testDescription) {
    lines.push(
      `Parent test title: ${formatValue(request.parent.testTitle)}`,
      `Parent test description: ${formatValue(request.parent.testDescription)}`,
    );
  }

  if (request.entity === "question") {
    lines.push(...buildQuestionUserLines(request));
  }

  lines.push(`Context snippets: ${getContextSnippets(request).join(" | ")}`);

  return lines.join("\n");
}

function buildQuestionSystemInstruction(
  request: GenerateCopyRequest,
  language: "Kazakh" | "Russian",
  entity: string,
  field: string,
  languageLock: string,
): string {
  const questionType = request.parent?.questionType ?? "SINGLE_CHOICE";
  const optionCount = request.parent?.optionCount ?? 2;

  if (request.field === "option") {
    const role =
      request.parent?.optionIsCorrect === true
        ? "a correct answer"
        : "a plausible but incorrect distractor";

    return [
      "You write quiz options for Tarih, a history EdTech platform for school students in Kazakhstan.",
      `Write ${role} for the current question.`,
      languageLock,
      `Site UI language is ${language}. The option text MUST be in ${language}.`,
      'Output JSON only: {"text":"..."}. No markdown.',
      "The option must fit the question and the lesson/course topic.",
      "Do not repeat other existing options. Keep it short (2–80 characters).",
      "Incorrect options must be believable mistakes, not nonsense or jokes.",
    ].join(" ");
  }

  const typeRules = getQuestionTypeRules(questionType, optionCount);

  return [
    "You write quiz questions for Tarih, a history EdTech platform for school students in Kazakhstan.",
    `Write the ${field} of a ${entity} and its answer options.`,
    languageLock,
    `Site UI language is ${language}. Question and options MUST be in ${language}.`,
    'Output JSON only: {"text":"...","options":[{"text":"...","isCorrect":true}]}. No markdown.',
    typeRules,
    "If the current question text is a hint, expand it. If it is already a question, rewrite and improve it.",
    "Do not duplicate existing questions from the list. Stay on the course/lesson/test topic.",
    "Options must include at least one correct and at least one incorrect answer.",
  ].join(" ");
}

function getQuestionTypeRules(
  questionType: string,
  optionCount: number,
): string {
  if (questionType === "TRUE_FALSE") {
    return "Type TRUE_FALSE: exactly 2 options (True/False in the site language), exactly one isCorrect true.";
  }

  if (questionType === "MULTIPLE_CHOICE") {
    return `Type MULTIPLE_CHOICE: return ${optionCount} options, at least one isCorrect true and at least one false. If there are 4 or more options, mark two as correct.`;
  }

  return `Type SINGLE_CHOICE: return ${optionCount} options, exactly one isCorrect true, the rest false.`;
}

function buildQuestionUserLines(request: GenerateCopyRequest): string[] {
  const lines = [
    `Question type: ${formatValue(request.parent?.questionType)}`,
    `Current question text: ${formatValue(request.parent?.questionText ?? request.title)}`,
  ];

  if (request.field === "option") {
    lines.push(
      `This option must be: ${request.parent?.optionIsCorrect === true ? "CORRECT" : "INCORRECT"}`,
      `Other options: ${formatList(request.parent?.otherOptions)}`,
    );
  }

  if (request.parent?.existingQuestions?.length) {
    lines.push(
      `Existing questions to avoid duplicating: ${formatList(request.parent.existingQuestions)}`,
    );
  }

  return lines;
}

function formatList(values: string[] | undefined): string {
  const items = (values ?? [])
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  if (items.length === 0) return "(none)";

  return items.join(" | ");
}

function formatValue(value: string | undefined): string {
  const trimmed = value?.trim() ?? "";

  return trimmed.length > 0 ? trimmed : "(empty)";
}
