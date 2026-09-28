import { ZodError } from "zod";

import { generateCopyWithGemini } from "@/shared/lib/call-gemini";
import {
  hasCopyContext,
  parseGenerateCopyRequest,
} from "@/shared/lib/generate-copy";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON" }, { status: 400 });
  }

  try {
    const input = parseGenerateCopyRequest(body);

    if (!hasCopyContext(input)) {
      return Response.json({ message: "Need context" }, { status: 400 });
    }

    const result = await generateCopyWithGemini(input);

    return Response.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ message: "Invalid request" }, { status: 400 });
    }

    const message =
      error instanceof Error && error.message.length > 0
        ? error.message
        : "Generation failed";

    return Response.json({ message }, { status: 502 });
  }
}
