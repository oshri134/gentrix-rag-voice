"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useMicrophone } from "./useMicrophone";
import { useAudioPlayer } from "./useAudioPlayer";
import { SOCKET_EVENTS, OPENAI_EVENTS } from "@/lib/constants";
import type {
  ConnectionStatus,
  TranscriptMessage,
  OpenAIMessage,
} from "@/types";

export function useVoiceChat() {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const currentResponseIdRef = useRef<string | null>(null);
  const { enqueueAudio, cleanup: cleanupAudio } = useAudioPlayer();

  const handleAudioData = useCallback((data: ArrayBuffer) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("audio", data);
    }
  }, []);

  const { isRecording, startRecording, stopRecording } = useMicrophone({
    onAudioData: handleAudioData,
  });

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string) => {
      const message: TranscriptMessage = {
        id: crypto.randomUUID(),
        role,
        content,
        timestamp: new Date(),
      };
      setTranscript((prev) => [...prev, message]);
    },
    [],
  );

  const updateLastAssistantMessage = useCallback(
    (delta: string, responseId?: string) => {
      const isNewResponse = responseId
        ? currentResponseIdRef.current !== responseId
        : currentResponseIdRef.current === null;

      if (isNewResponse && responseId) {
        currentResponseIdRef.current = responseId;
      }

      setTranscript((prev) => {
        const newTranscript = [...prev];

        let lastAssistantIndex = -1;
        for (let i = newTranscript.length - 1; i >= 0; i--) {
          if (newTranscript[i].role === "assistant") {
            lastAssistantIndex = i;
            break;
          }
        }

        if (lastAssistantIndex >= 0 && !isNewResponse) {
          // Continue existing response
          newTranscript[lastAssistantIndex] = {
            ...newTranscript[lastAssistantIndex],
            content: newTranscript[lastAssistantIndex].content + delta,
          };
        } else {
          // Start new response
          newTranscript.push({
            id: crypto.randomUUID(),
            role: "assistant",
            content: delta,
            timestamp: new Date(),
          });
        }

        return newTranscript;
      });
    },
    [],
  );

  const handleServerMessage = useCallback(
    (data: OpenAIMessage) => {
      switch (data.type) {
        case OPENAI_EVENTS.RESPONSE_AUDIO_DELTA:
          if (data.delta) {
            setIsAISpeaking(true);
            enqueueAudio(data.delta);
          }
          break;

        case OPENAI_EVENTS.TRANSCRIPTION_COMPLETED:
          if (data.transcript) {
            addMessage("user", data.transcript);
          }
          break;

        case OPENAI_EVENTS.RESPONSE_TEXT_DELTA:
        case OPENAI_EVENTS.RESPONSE_AUDIO_TRANSCRIPT_DELTA:
          if (data.delta) {
            updateLastAssistantMessage(data.delta, data.response_id);
          }
          break;

        case OPENAI_EVENTS.RESPONSE_DONE:
          setIsAISpeaking(false);
          if (data.response_id === currentResponseIdRef.current) {
            currentResponseIdRef.current = null;
          }
          break;

        case SOCKET_EVENTS.ERROR:
          setError(String(data));
          break;
      }
    },
    [enqueueAudio, addMessage, updateLastAssistantMessage],
  );

  const connect = useCallback(async () => {
    try {
      setError(null);
      setStatus("requesting_microphone");

      await startRecording();

      setStatus("connecting");

      const response = await fetch("/api/realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_config" }),
      });

      if (!response.ok) {
        throw new Error("Failed to get API configuration");
      }

      const { apiKey } = await response.json();

      if (!apiKey) {
        throw new Error("API key not configured");
      }

      const socket = io({ transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        setStatus("connected");
        socket.emit(SOCKET_EVENTS.START_SESSION, { apiKey });
      });

      socket.on(SOCKET_EVENTS.SESSION_STARTED, () => {
        setStatus("ready");
      });

      socket.on(SOCKET_EVENTS.MESSAGE, handleServerMessage);

      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        setStatus("disconnected");
      });

      socket.on(SOCKET_EVENTS.ERROR, (err: string) => {
        setError(err);
        setStatus("error");
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setStatus("error");
      stopRecording();
    }
  }, [startRecording, stopRecording, handleServerMessage]);

  const disconnect = useCallback(() => {
    stopRecording();
    cleanupAudio();

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setStatus("disconnected");
  }, [stopRecording, cleanupAudio]);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    status,
    isRecording,
    isAISpeaking,
    transcript,
    error,
    connect,
    disconnect,
    clearTranscript,
  };
}
