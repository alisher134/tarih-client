import type {
  GenerateCopyRequest,
  GenerateCopyResult,
  GeneratedOption,
} from "@/shared/lib/generate-copy";
import { generatedOptionSchema } from "@/shared/lib/generate-copy";

type GenerateCopyResponse = {
  text?: unknown;
  options?: unknown;
  message?: unknown;
};

export async function generateCopy(
  input: GenerateCopyRequest,
): Promise<GenerateCopyResult> {
  const response = await fetch("/ai/generate-copy", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response
    .json()
    .catch(() => null)) as GenerateCopyResponse | null;

  if (!response.ok) {
    throw new Error(getResponseMessage(payload) ?? "Generation failed");
  }

  if (typeof payload?.text !== "string" || payload.text.trim().length === 0) {
    throw new Error("Generation failed");
  }

  return {
    text: payload.text.trim(),
    options: parseOptions(payload.options),
  };
}

function parseOptions(value: unknown): GeneratedOption[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const options = value.flatMap((item) => {
    const parsed = generatedOptionSchema.safeParse(item);

    return parsed.success ? [parsed.data] : [];
  });

  return options.length > 0 ? options : undefined;
}

function getResponseMessage(
  payload: GenerateCopyResponse | null,
): string | undefined {
  if (typeof payload?.message === "string" && payload.message.length > 0) {
    return payload.message;
  }

  return undefined;
}
