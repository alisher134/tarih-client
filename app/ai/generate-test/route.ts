import { ZodError } from "zod";

import { generateTestWithGemini } from "@/shared/lib/call-gemini-test";
import { parseGenerateTestRequest } from "@/shared/lib/generate-test";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const input = parseGenerateTestRequest(body);
    const result = await generateTestWithGemini(input);

    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Test generation failed";

    return Response.json({ message }, { status: 502 });
  }
}
