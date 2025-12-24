import { render, screen } from "@testing-library/react";
import { TranscriptView } from "@/components/ui/TranscriptView";
import type { TranscriptMessage } from "@/types";

describe("TranscriptView", () => {
  it("shows empty state when no messages", () => {
    render(<TranscriptView messages={[]} />);
    expect(screen.getByText(/No messages yet/)).toBeInTheDocument();
  });

  it("renders user messages", () => {
    const messages: TranscriptMessage[] = [
      {
        id: "1",
        role: "user",
        content: "Hello there",
        timestamp: new Date(),
      },
    ];

    render(<TranscriptView messages={messages} />);
    expect(screen.getByText("Hello there")).toBeInTheDocument();
    expect(screen.getByText("You")).toBeInTheDocument();
  });

  it("renders assistant messages", () => {
    const messages: TranscriptMessage[] = [
      {
        id: "1",
        role: "assistant",
        content: "Hi, how can I help?",
        timestamp: new Date(),
      },
    ];

    render(<TranscriptView messages={messages} />);
    expect(screen.getByText("Hi, how can I help?")).toBeInTheDocument();
    expect(screen.getByText("AI")).toBeInTheDocument();
  });

  it("renders multiple messages", () => {
    const messages: TranscriptMessage[] = [
      { id: "1", role: "user", content: "Question 1", timestamp: new Date() },
      {
        id: "2",
        role: "assistant",
        content: "Answer 1",
        timestamp: new Date(),
      },
      { id: "3", role: "user", content: "Question 2", timestamp: new Date() },
    ];

    render(<TranscriptView messages={messages} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Answer 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });
});
