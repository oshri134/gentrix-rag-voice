"use client";

import type { TranscriptMessage } from "@/types";

interface TranscriptViewProps {
  messages: TranscriptMessage[];
}

export function TranscriptView({ messages }: TranscriptViewProps) {
  // Sort messages: group by timestamp proximity, user before assistant
  const sortedMessages = [...messages].sort((a, b) => {
    const timeDiff = a.timestamp.getTime() - b.timestamp.getTime();
    // If messages are within 5 seconds, put user first
    if (Math.abs(timeDiff) < 5000) {
      if (a.role === "user" && b.role === "assistant") return -1;
      if (a.role === "assistant" && b.role === "user") return 1;
    }
    return timeDiff;
  });

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "16px",
        minHeight: "300px",
        maxHeight: "500px",
        overflowY: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>Transcript</h3>

      {sortedMessages.length === 0 ? (
        <p style={{ color: "#999", fontStyle: "italic" }}>
          No messages yet. Start talking to begin the conversation.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sortedMessages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MessageBubbleProps {
  message: TranscriptMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          color: "#666",
          marginBottom: "4px",
        }}
      >
        {isUser ? "You" : "AI"}
      </span>
      <div
        style={{
          maxWidth: "80%",
          padding: "12px 16px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          backgroundColor: isUser ? "#e3f2fd" : "#fff3e0",
          color: "#333",
          lineHeight: 1.5,
        }}
      >
        {message.content}
      </div>
      <span
        style={{
          fontSize: "10px",
          color: "#999",
          marginTop: "4px",
        }}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  );
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
