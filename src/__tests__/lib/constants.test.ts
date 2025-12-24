import {
  OPENAI,
  AUDIO,
  VAD,
  SOCKET_EVENTS,
  OPENAI_EVENTS,
  HTTP_STATUS,
  SYSTEM_INSTRUCTIONS,
} from "@/lib/constants";

describe("constants", () => {
  describe("OPENAI", () => {
    it("has correct model", () => {
      expect(OPENAI.MODEL).toBe("gpt-4o-realtime-preview-2024-12-17");
    });

    it("has correct voice", () => {
      expect(OPENAI.VOICE).toBe("alloy");
    });
  });

  describe("AUDIO", () => {
    it("has correct sample rate", () => {
      expect(AUDIO.SAMPLE_RATE).toBe(24000);
    });

    it("has correct format", () => {
      expect(AUDIO.FORMAT).toBe("pcm16");
    });

    it("has correct channel count", () => {
      expect(AUDIO.CHANNEL_COUNT).toBe(1);
    });
  });

  describe("VAD", () => {
    it("has correct type", () => {
      expect(VAD.TYPE).toBe("server_vad");
    });

    it("has threshold between 0 and 1", () => {
      expect(VAD.THRESHOLD).toBeGreaterThanOrEqual(0);
      expect(VAD.THRESHOLD).toBeLessThanOrEqual(1);
    });
  });

  describe("SOCKET_EVENTS", () => {
    it("has all required events", () => {
      expect(SOCKET_EVENTS.START_SESSION).toBeDefined();
      expect(SOCKET_EVENTS.AUDIO).toBeDefined();
      expect(SOCKET_EVENTS.DISCONNECT).toBeDefined();
      expect(SOCKET_EVENTS.SESSION_STARTED).toBeDefined();
      expect(SOCKET_EVENTS.MESSAGE).toBeDefined();
      expect(SOCKET_EVENTS.ERROR).toBeDefined();
    });
  });

  describe("OPENAI_EVENTS", () => {
    it("has all required events", () => {
      expect(OPENAI_EVENTS.SESSION_UPDATE).toBeDefined();
      expect(OPENAI_EVENTS.RESPONSE_CREATE).toBeDefined();
      expect(OPENAI_EVENTS.RESPONSE_AUDIO_DELTA).toBeDefined();
      expect(OPENAI_EVENTS.RESPONSE_DONE).toBeDefined();
    });
  });

  describe("HTTP_STATUS", () => {
    it("has correct status codes", () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500);
    });
  });

  describe("SYSTEM_INSTRUCTIONS", () => {
    it("is a non-empty string", () => {
      expect(typeof SYSTEM_INSTRUCTIONS).toBe("string");
      expect(SYSTEM_INSTRUCTIONS.length).toBeGreaterThan(0);
    });

    it("mentions TechVision Solutions", () => {
      expect(SYSTEM_INSTRUCTIONS).toContain("TechVision Solutions");
    });
  });
});
