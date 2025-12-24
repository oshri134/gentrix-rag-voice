"use client";

import type { ConnectionStatus } from "@/types";

interface StatusBadgeProps {
  status: ConnectionStatus;
  error?: string | null;
}

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; color: string; bgColor: string }
> = {
  disconnected: { label: "Disconnected", color: "#666", bgColor: "#f5f5f5" },
  requesting_microphone: {
    label: "Requesting microphone...",
    color: "#1976d2",
    bgColor: "#e3f2fd",
  },
  connecting: { label: "Connecting...", color: "#f57c00", bgColor: "#fff3e0" },
  connected: { label: "Connected", color: "#388e3c", bgColor: "#e8f5e9" },
  ready: { label: "Ready to talk 🎤", color: "#388e3c", bgColor: "#e8f5e9" },
  error: { label: "Error", color: "#d32f2f", bgColor: "#ffebee" },
};

export function StatusBadge({ status, error }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 16px",
          borderRadius: "20px",
          backgroundColor: config.bgColor,
          color: config.color,
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: config.color,
          }}
        />
        {config.label}
      </div>
      {error && (
        <p style={{ color: "#d32f2f", marginTop: "8px", fontSize: "14px" }}>
          {error}
        </p>
      )}
    </div>
  );
}
