import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/ui/StatusBadge";

describe("StatusBadge", () => {
  it("shows disconnected status", () => {
    render(<StatusBadge status="disconnected" />);
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("shows connecting status", () => {
    render(<StatusBadge status="connecting" />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("shows ready status with emoji", () => {
    render(<StatusBadge status="ready" />);
    expect(screen.getByText("Ready to talk 🎤")).toBeInTheDocument();
  });

  it("shows error message when provided", () => {
    render(<StatusBadge status="error" error="Connection failed" />);
    expect(screen.getByText("Connection failed")).toBeInTheDocument();
  });

  it("does not show error when not provided", () => {
    render(<StatusBadge status="disconnected" />);
    expect(screen.queryByText("Connection failed")).not.toBeInTheDocument();
  });
});
