import type {
  GenerateTestRequest,
  GenerateTestResult,
  GeneratedTestQuestion,
} from "@/shared/lib/generate-test";
import { generatedTestQuestionSchema } from "@/shared/lib/generate-test";

type GenerateTestResponse = {
  questions?: unknown;
  message?: unknown;
};

export async function generateTest(
  input: GenerateTestRequest,
): Promise<GenerateTestResult> {
  const response = await fetch("/ai/generate-test", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response
    .json()
    .catch(() => null)) as GenerateTestResponse | null;

  if (!response.ok) {
    throw new Error(getResponseMessage(payload) ?? "Test generation failed");
  }

  const questions = parseQuestions(payload?.questions);

  if (questions.length === 0) {
    throw new Error("No questions generated");
  }

  return { questions };
}

function parseQuestions(value: unknown): GeneratedTestQuestion[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const parsed = generatedTestQuestionSchema.safeParse(item);

    return parsed.success ? [parsed.data] : [];
  });
}

function getResponseMessage(
  payload: GenerateTestResponse | null,
): string | undefined {
  if (typeof payload?.message === "string" && payload.message.length > 0) {
    return payload.message;
  }

  return undefined;
}
