import { renderHook, act } from "@testing-library/react";
import { useMicrophone } from "@/hooks/useMicrophone";

const mockMediaStream = {
  getTracks: () => [{ stop: jest.fn() }],
};

describe("useMicrophone", () => {
  beforeEach(() => {
    (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(
      mockMediaStream,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns isRecording, startRecording, and stopRecording", () => {
    const onAudioData = jest.fn();
    const { result } = renderHook(() => useMicrophone({ onAudioData }));

    expect(typeof result.current.isRecording).toBe("boolean");
    expect(typeof result.current.startRecording).toBe("function");
    expect(typeof result.current.stopRecording).toBe("function");
  });

  it("isRecording is false initially", () => {
    const onAudioData = jest.fn();
    const { result } = renderHook(() => useMicrophone({ onAudioData }));

    expect(result.current.isRecording).toBe(false);
  });

  it("stopRecording can be called without errors", () => {
    const onAudioData = jest.fn();
    const { result } = renderHook(() => useMicrophone({ onAudioData }));

    expect(() => {
      act(() => {
        result.current.stopRecording();
      });
    }).not.toThrow();
  });

  it("requests microphone access when startRecording is called", async () => {
    const onAudioData = jest.fn();
    const { result } = renderHook(() => useMicrophone({ onAudioData }));

    await act(async () => {
      await result.current.startRecording();
    });

    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
      audio: {
        channelCount: 1,
        sampleRate: 24000,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  });
});
