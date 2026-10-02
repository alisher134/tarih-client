import { ZodError } from "zod";

import { generatePlanWithGemini } from "@/shared/lib/call-gemini-plan";
import { parseGeneratePlanRequest } from "@/shared/lib/generate-plan";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const input = parseGeneratePlanRequest(body);
    const result = await generatePlanWithGemini(input);

    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Plan generation failed";

    return Response.json({ message }, { status: 502 });
  }
}
