import { render, screen } from "@testing-library/react";
import { RecordingIndicator } from "@/components/ui/RecordingIndicator";

describe("RecordingIndicator", () => {
  it("renders nothing when not recording", () => {
    const { container } = render(<RecordingIndicator isRecording={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("shows recording message when recording", () => {
    render(<RecordingIndicator isRecording={true} />);
    expect(screen.getByText(/Recording/)).toBeInTheDocument();
  });
});
