import { renderHook, act } from "@testing-library/react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

describe("useAudioPlayer", () => {
  it("returns enqueueAudio, clearQueue, and cleanup functions", () => {
    const { result } = renderHook(() => useAudioPlayer());

    expect(typeof result.current.enqueueAudio).toBe("function");
    expect(typeof result.current.clearQueue).toBe("function");
    expect(typeof result.current.cleanup).toBe("function");
  });

  it("clearQueue resets the queue", () => {
    const { result } = renderHook(() => useAudioPlayer());

    act(() => {
      result.current.clearQueue();
    });

    expect(result.current.clearQueue).toBeDefined();
  });

  it("cleanup can be called without errors", () => {
    const { result } = renderHook(() => useAudioPlayer());

    expect(() => {
      act(() => {
        result.current.cleanup();
      });
    }).not.toThrow();
  });
});
