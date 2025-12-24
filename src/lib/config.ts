import type { SessionConfig } from "@/types";

export const OPENAI_CONFIG = {
  MODEL: "gpt-4o-realtime-preview-2024-12-17",
  REALTIME_URL: "wss://api.openai.com/v1/realtime",
  VOICE: "alloy",
  AUDIO_FORMAT: "pcm16",
  SAMPLE_RATE: 24000,
} as const;

export const VAD_CONFIG = {
  TYPE: "server_vad",
  THRESHOLD: 0.5,
  PREFIX_PADDING_MS: 300,
  SILENCE_DURATION_MS: 500,
} as const;

export const AUDIO_CONFIG = {
  CHANNEL_COUNT: 1,
  SAMPLE_RATE: 24000,
  BUFFER_SIZE: 4096,
} as const;

export const SYSTEM_INSTRUCTIONS = `You are a helpful AI assistant for TechVision Solutions. 
You have access to company documents through the search_documents tool. 
When users ask questions about the company, products, pricing, or services, 
use the search_documents tool to find accurate information. 
Always provide helpful and accurate responses based on the available documents. 
Speak naturally and conversationally.`;

export const TOOLS_CONFIG: SessionConfig["tools"] = [
  {
    type: "function",
    name: "search_documents",
    description:
      "Search through company documents to find relevant information about TechVision Solutions, products, services, pricing, and contact details.",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query to find relevant information",
        },
      },
      required: ["query"],
    },
  },
];

export function createSessionConfig(): SessionConfig {
  return {
    modalities: ["text", "audio"],
    instructions: SYSTEM_INSTRUCTIONS,
    voice: OPENAI_CONFIG.VOICE,
    input_audio_format: OPENAI_CONFIG.AUDIO_FORMAT,
    output_audio_format: OPENAI_CONFIG.AUDIO_FORMAT,
    input_audio_transcription: {
      model: "whisper-1",
    },
    turn_detection: {
      type: VAD_CONFIG.TYPE,
      threshold: VAD_CONFIG.THRESHOLD,
      prefix_padding_ms: VAD_CONFIG.PREFIX_PADDING_MS,
      silence_duration_ms: VAD_CONFIG.SILENCE_DURATION_MS,
    },
    tools: TOOLS_CONFIG,
    tool_choice: "auto",
  };
}
