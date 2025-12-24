"use client";

interface RecordingIndicatorProps {
  isRecording: boolean;
}

export function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  if (!isRecording) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        marginBottom: "20px",
        animation: "pulse 2s infinite",
      }}
    >
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "#f44336",
          animation: "blink 1s infinite",
        }}
      />
      <span style={{ color: "#2e7d32", fontWeight: 500 }}>
        Recording... Speak now
      </span>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
