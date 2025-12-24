export const OPENAI = {
  MODEL: "gpt-4o-realtime-preview-2024-12-17",
  REALTIME_URL: "wss://api.openai.com/v1/realtime",
  VOICE: "alloy",
  WHISPER_MODEL: "whisper-1",
} as const;

export const AUDIO = {
  FORMAT: "pcm16",
  SAMPLE_RATE: 24000,
  CHANNEL_COUNT: 1,
  BUFFER_SIZE: 4096,
} as const;

export const VAD = {
  TYPE: "server_vad",
  THRESHOLD: 0.5,
  PREFIX_PADDING_MS: 300,
  SILENCE_DURATION_MS: 500,
} as const;

export const SOCKET_EVENTS = {
  START_SESSION: "start_session",
  AUDIO: "audio",
  DISCONNECT: "disconnect",
  SESSION_STARTED: "session_started",
  MESSAGE: "message",
  ERROR: "error",
} as const;

export const OPENAI_EVENTS = {
  SESSION_UPDATE: "session.update",
  RESPONSE_CREATE: "response.create",
  CONVERSATION_ITEM_CREATE: "conversation.item.create",
  INPUT_AUDIO_BUFFER_APPEND: "input_audio_buffer.append",
  RESPONSE_AUDIO_DELTA: "response.audio.delta",
  RESPONSE_TEXT_DELTA: "response.text.delta",
  RESPONSE_AUDIO_TRANSCRIPT_DELTA: "response.audio_transcript.delta",
  RESPONSE_AUDIO_TRANSCRIPT_DONE: "response.audio_transcript.done",
  RESPONSE_DONE: "response.done",
  FUNCTION_CALL_DONE: "response.function_call_arguments.done",
  TRANSCRIPTION_COMPLETED:
    "conversation.item.input_audio_transcription.completed",
} as const;

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SYSTEM_INSTRUCTIONS =
  `You are a helpful AI assistant for TechVision Solutions. 
You have access to company documents through the search_documents tool. 
When users ask questions about the company, products, pricing, or services, 
use the search_documents tool to find accurate information. 
Always provide helpful and accurate responses based on the available documents. 
Speak naturally and conversationally.` as const;
