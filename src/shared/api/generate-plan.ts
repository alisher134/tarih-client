import type {
  GeneratePlanRequest,
  GeneratePlanResult,
} from "@/shared/lib/generate-plan";

type GeneratePlanResponse = {
  slug?: unknown;
  titleRu?: unknown;
  titleKz?: unknown;
  description?: unknown;
  message?: unknown;
};

export async function generatePlan(
  input: GeneratePlanRequest,
): Promise<GeneratePlanResult> {
  const response = await fetch("/ai/generate-plan", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await response
    .json()
    .catch(() => null)) as GeneratePlanResponse | null;

  if (!response.ok) {
    const msg =
      typeof payload?.message === "string"
        ? payload.message
        : "Failed to generate plan";
    throw new Error(msg);
  }

  if (
    typeof payload?.titleRu !== "string" ||
    typeof payload?.titleKz !== "string" ||
    typeof payload?.slug !== "string"
  ) {
    throw new Error("Invalid plan data received");
  }

  return {
    slug: payload.slug,
    titleRu: payload.titleRu,
    titleKz: payload.titleKz,
    description:
      typeof payload.description === "string" ? payload.description : "",
  };
}
