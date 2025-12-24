import "@testing-library/jest-dom";

global.crypto = {
  randomUUID: () => Math.random().toString(36).substring(2, 15),
};

global.AudioContext = jest.fn().mockImplementation(() => ({
  createMediaStreamSource: jest.fn(() => ({
    connect: jest.fn(),
  })),
  createScriptProcessor: jest.fn(() => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    onaudioprocess: null,
  })),
  createBuffer: jest.fn(() => ({
    getChannelData: jest.fn(() => new Float32Array(1024)),
  })),
  createBufferSource: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    buffer: null,
    onended: null,
  })),
  destination: {},
  close: jest.fn(),
  sampleRate: 24000,
}));

global.navigator.mediaDevices = {
  getUserMedia: jest.fn(),
};
