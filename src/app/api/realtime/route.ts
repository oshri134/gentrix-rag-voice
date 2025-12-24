import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ApiAction = "get_config";

interface ApiRequest {
  action: ApiAction;
}

interface ConfigResponse {
  apiKey: string | undefined;
}

interface ErrorResponse {
  error: string;
  code?: string;
}

const ACTIONS: Record<ApiAction, boolean> = {
  get_config: true,
};

function handleGetConfig(): NextResponse<ConfigResponse> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.warn("OPENAI_API_KEY is not configured");
  }

  return NextResponse.json({ apiKey });
}

function isValidRequest(body: unknown): body is ApiRequest {
  return (
    typeof body === "object" &&
    body !== null &&
    "action" in body &&
    typeof (body as ApiRequest).action === "string" &&
    (body as ApiRequest).action in ACTIONS
  );
}

export async function POST(
  req: Request
): Promise<NextResponse<ConfigResponse | ErrorResponse>> {
  try {
    const body: unknown = await req.json();

    if (!isValidRequest(body)) {
      return NextResponse.json(
        { error: "Invalid request", code: "INVALID_ACTION" },
        { status: 400 }
      );
    }

    switch (body.action) {
      case "get_config":
        return handleGetConfig();

      default:
        return NextResponse.json(
          { error: "Unknown action", code: "UNKNOWN_ACTION" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("API error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
