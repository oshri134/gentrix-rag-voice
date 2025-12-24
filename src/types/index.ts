export interface OpenAIMessage {
  type: string;
  delta?: string;
  transcript?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  response_id?: string;
}

export interface SessionConfig {
  modalities: string[];
  instructions: string;
  voice: string;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription: {
    model: string;
  };
  turn_detection: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
  };
  tools: Tool[];
  tool_choice: string;
}

export interface Tool {
  type: string;
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, ToolParameter>;
    required: string[];
  };
}

export interface ToolParameter {
  type: string;
  description: string;
}

export interface SearchResult {
  content: string;
  source: string;
  lineNumber: number;
}

export interface TranscriptMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ConnectionStatus =
  | "disconnected"
  | "requesting_microphone"
  | "connecting"
  | "connected"
  | "ready"
  | "error";
