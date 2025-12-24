"use client";

import { useVoiceChat } from "@/hooks/useVoiceChat";
import { Button, StatusBadge, TranscriptView, RecordingIndicator } from "./ui";

export default function VoiceChat() {
  const {
    status,
    isRecording,
    isAISpeaking,
    transcript,
    error,
    connect,
    disconnect,
  } = useVoiceChat();

  const isConnected = status === "connected" || status === "ready";
  const isConnecting =
    status === "connecting" || status === "requesting_microphone";

  return (
    <main style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}>
          Voice RAG Chat
        </h1>
        <p style={{ margin: 0, color: "#666" }}>
          Ask questions about your documents using your voice
        </p>
      </header>

      <StatusBadge status={status} error={error} />

      <div style={{ marginBottom: "24px", display: "flex", gap: "12px" }}>
        {!isConnected ? (
          <Button
            variant="primary"
            onClick={connect}
            isLoading={isConnecting}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Start Conversation"}
          </Button>
        ) : (
          <Button variant="danger" onClick={disconnect}>
            End Conversation
          </Button>
        )}
      </div>

      <RecordingIndicator isRecording={isRecording} />

      {isAISpeaking && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 20px",
            backgroundColor: "#e3f2fd",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "20px" }}>🔊</span>
          <span style={{ color: "#1565c0", fontWeight: 500 }}>
            AI is speaking...
          </span>
        </div>
      )}

      <TranscriptView messages={transcript} />

      <Instructions />
    </main>
  );
}

function Instructions() {
  return (
    <aside
      style={{
        marginTop: "24px",
        padding: "16px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        fontSize: "14px",
        color: "#666",
      }}
    >
      <h4 style={{ margin: "0 0 12px 0", color: "#333" }}>How to use</h4>
      <ol style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.8 }}>
        <li>Click &quot;Start Conversation&quot; to begin</li>
        <li>Allow microphone access when prompted</li>
        <li>Ask questions about TechVision Solutions, products, or pricing</li>
        <li>The AI will search company documents to answer your questions</li>
        <li>Click &quot;End Conversation&quot; when done</li>
      </ol>
    </aside>
  );
}
