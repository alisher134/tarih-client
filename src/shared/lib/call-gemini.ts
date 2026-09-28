import { buildSystemInstruction, buildUserPrompt } from "./build-gemini-prompt";
import {
  generatedOptionSchema,
  type GenerateCopyRequest,
  type GenerateCopyResult,
  type GeneratedOption,
} from "./generate-copy";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

export async function generateCopyWithGemini(
  request: GenerateCopyRequest,
): Promise<GenerateCopyResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;

  if (apiKey == null || apiKey.length === 0) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const isQuestion = request.entity === "question";
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
          parts: [{ text: buildSystemInstruction(request) }],
        },
        contents: [{ parts: [{ text: buildUserPrompt(request) }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2048,
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
          ...(isQuestion ? { responseMimeType: "application/json" } : {}),
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

  if (!isQuestion) {
    return { text: stripWrappingQuotes(text) };
  }

  return parseQuestionResult(request, text);
}

function parseQuestionResult(
  request: GenerateCopyRequest,
  raw: string,
): GenerateCopyResult {
  const parsed = parseJsonObject(raw);

  if (typeof parsed.text !== "string" || parsed.text.trim().length === 0) {
    throw new Error("Gemini returned an empty response");
  }

  const text = parsed.text.trim();

  if (request.field === "option") {
    return { text };
  }

  const options = parseGeneratedOptions(parsed.options);

  if (options == null) {
    return { text };
  }

  return { text, options };
}

function parseGeneratedOptions(value: unknown): GeneratedOption[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const options = value.flatMap((item) => {
    const parsed = generatedOptionSchema.safeParse(item);

    return parsed.success ? [parsed.data] : [];
  });

  if (options.length < 2) return undefined;
  if (!options.some((option) => option.isCorrect)) return undefined;
  if (!options.some((option) => !option.isCorrect)) return undefined;

  return options;
}

function parseJsonObject(raw: string): Record<string, unknown> {
  const stripped = stripMarkdownFence(stripWrappingQuotes(raw));

  try {
    const parsed: unknown = JSON.parse(stripped);

    if (!isRecord(parsed)) {
      throw new Error("Gemini returned an empty response");
    }

    return parsed;
  } catch {
    throw new Error("Gemini returned an empty response");
  }
}

function stripMarkdownFence(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

function stripWrappingQuotes(text: string): string {
  if (text.length < 2) return text;

  const first = text[0];
  const last = text[text.length - 1];

  if (
    (first === '"' && last === '"') ||
    (first === "«" && last === "»") ||
    (first === "'" && last === "'")
  ) {
    return text.slice(1, -1).trim();
  }

  return text;
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
