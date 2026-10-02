import type { GeneratePlanRequest, GeneratePlanResult } from "./generate-plan";

const DEFAULT_GEMINI_MODEL = "gemini-3.1-flash-lite";

export async function generatePlanWithGemini(
  request: GeneratePlanRequest,
): Promise<GeneratePlanResult> {
  const apiKey =
    process.env.GEMINI_API_KEY ?? process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;

  if (apiKey == null || apiKey.length === 0) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = [
    "You are a product copywriter for Tarih, an online EdTech platform for school students in Kazakhstan studying history and preparing for exams (ENT / ҰБТ).",
    `Generate subscription plan details for a plan with duration: ${request.durationMonths} month(s) and price: ${request.priceKzt} KZT.`,
    request.hint ? `Additional requirements / focus: ${request.hint}` : "",
    "Return JSON only with the following keys:",
    "- slug: lowercase latin letters, numbers and hyphens only (e.g. '1-month', 'ent-standard-3m', 'pro-12m')",
    "- titleRu: concise plan name in Russian (e.g. 'Стандарт (3 месяца)' or 'Интенсив к ЕНТ (6 месяцев)')",
    "- titleKz: accurate Kazakh translation of the plan name (e.g. 'Стандарт (3 ай)' or 'ҰБТ қарқынды дайындық (6 ай)')",
    "- description: 1-2 compelling sentences (100-300 chars) explaining what the student gets (courses, video lessons, tests, ENT prep). Can be in Russian or Kazakh based on preference.",
    'Output JSON schema only: {"slug":"...","titleRu":"...","titleKz":"...","description":"..."}. No markdown.',
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
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
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return parsePlanResult(text, request);
}

function parsePlanResult(
  raw: string,
  request: GeneratePlanRequest,
): GeneratePlanResult {
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    throw new Error("Failed to parse plan response");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Invalid plan response");
  }

  const record = parsed as Record<string, unknown>;

  const slug =
    typeof record.slug === "string" && record.slug.trim().length > 0
      ? record.slug
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "-")
      : `${request.durationMonths}-month`;

  const titleRu =
    typeof record.titleRu === "string" && record.titleRu.trim().length > 0
      ? record.titleRu.trim()
      : `${request.durationMonths} месяц`;

  const titleKz =
    typeof record.titleKz === "string" && record.titleKz.trim().length > 0
      ? record.titleKz.trim()
      : `${request.durationMonths} ай`;

  const description =
    typeof record.description === "string" &&
    record.description.trim().length > 0
      ? record.description.trim()
      : "";

  return { slug, titleRu, titleKz, description };
}

function getGeminiText(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;
  const record = payload as Record<string, unknown>;
  if (!Array.isArray(record.candidates) || record.candidates.length === 0)
    return undefined;
  const candidate = record.candidates[0] as Record<string, unknown>;
  if (typeof candidate !== "object" || candidate === null) return undefined;
  const content = candidate.content as Record<string, unknown>;
  if (
    typeof content !== "object" ||
    content === null ||
    !Array.isArray(content.parts)
  )
    return undefined;

  const parts = content.parts as Record<string, unknown>[];
  const texts = parts.flatMap((part) =>
    typeof part.text === "string" && part.thought !== true ? [part.text] : [],
  );

  return texts.join("").trim();
}

function getGeminiErrorMessage(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;
  const record = payload as Record<string, unknown>;
  if (typeof record.error !== "object" || record.error === null)
    return undefined;
  const err = record.error as Record<string, unknown>;
  return typeof err.message === "string" ? err.message : undefined;
}
