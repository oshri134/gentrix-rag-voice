"use client";

import { useRef, useCallback, useEffect } from "react";
import { AUDIO_CONFIG } from "@/lib/config";

export function useAudioPlayer() {
  const audioQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const playNextRef = useRef<() => void>(() => {});

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({
        sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
      });
    }
    return audioContextRef.current;
  }, []);

  const base64ToArrayBuffer = useCallback((base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }, []);

  const pcm16ToFloat32 = useCallback((pcm16: Int16Array): Float32Array => {
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff);
    }
    return float32;
  }, []);

  useEffect(() => {
    const playNext = async () => {
      if (audioQueueRef.current.length === 0) {
        isPlayingRef.current = false;
        return;
      }

      isPlayingRef.current = true;
      const audioData = audioQueueRef.current.shift()!;

      try {
        const audioContext = getAudioContext();
        const pcm16 = new Int16Array(audioData);
        const float32 = pcm16ToFloat32(pcm16);

        const audioBuffer = audioContext.createBuffer(
          1,
          float32.length,
          AUDIO_CONFIG.SAMPLE_RATE,
        );
        audioBuffer.getChannelData(0).set(float32);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => playNextRef.current();
        source.start();
      } catch (error) {
        console.error("Error playing audio:", error);
        playNextRef.current();
      }
    };

    playNextRef.current = playNext;
  }, [getAudioContext, pcm16ToFloat32]);

  const enqueueAudio = useCallback(
    (base64Audio: string) => {
      const audioData = base64ToArrayBuffer(base64Audio);
      audioQueueRef.current.push(audioData);

      if (!isPlayingRef.current) {
        playNextRef.current();
      }
    },
    [base64ToArrayBuffer],
  );

  const clearQueue = useCallback(() => {
    audioQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const cleanup = useCallback(() => {
    clearQueue();
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [clearQueue]);

  return {
    enqueueAudio,
    clearQueue,
    cleanup,
  };
}
