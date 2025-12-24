import { createServer, IncomingMessage, ServerResponse } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer, Socket } from "socket.io";
import WebSocket from "ws";
import fs from "fs/promises";
import path from "path";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

interface Config {
  PORT: number;
  HOSTNAME: string;
  IS_DEV: boolean;
  OPENAI_REALTIME_URL: string;
  DATA_DIR: string;
}

const CONFIG: Config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  HOSTNAME: process.env.HOSTNAME || "localhost",
  IS_DEV: process.env.NODE_ENV !== "production",
  OPENAI_REALTIME_URL:
    "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
  DATA_DIR: path.join(process.cwd(), "data"),
};

const SYSTEM_INSTRUCTIONS = `You are a helpful AI assistant with access to PDF documents.
You have access to documents through the search_documents tool.
IMPORTANT: When users ask ANY question, you MUST use the search_documents tool to find the information from the documents.
Always search the documents first before answering any question.
If you find relevant information, provide it. If not, say you couldn't find it in the documents.
Speak naturally and conversationally.`;

interface SearchResult {
  content: string;
  source: string;
}

interface OpenAISessionConfig {
  modalities: string[];
  instructions: string;
  voice: string;
  input_audio_format: string;
  output_audio_format: string;
  input_audio_transcription: { model: string; language?: string };
  turn_detection: {
    type: string;
    threshold: number;
    prefix_padding_ms: number;
    silence_duration_ms: number;
  };
  tools: Array<{
    type: string;
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, { type: string; description: string }>;
      required: string[];
    };
  }>;
  tool_choice: string;
}

interface FunctionCallMessage {
  type: string;
  name: string;
  arguments: string;
  call_id: string;
}

interface Logger {
  info: (msg: string, data?: unknown) => void;
  error: (msg: string, err?: unknown) => void;
  debug: (msg: string, data?: unknown) => void;
}

const logger: Logger = {
  info: (msg: string, data?: unknown) =>
    console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, data ?? ""),
  error: (msg: string, err?: unknown) =>
    console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, err ?? ""),
  debug: (msg: string, data?: unknown) => {
    if (CONFIG.IS_DEV) {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${msg}`, data ?? "");
    }
  },
};

class DocumentSearchService {
  private readonly dataDir: string;
  private documentsCache: Map<string, string> = new Map();

  constructor(dataDir: string) {
    this.dataDir = dataDir;
  }

  async loadDocuments(): Promise<void> {
    try {
      const files = await fs.readdir(this.dataDir);

      for (const file of files) {
        const filePath = path.join(this.dataDir, file);
        let content = "";

        if (!file.endsWith(".pdf")) continue;

        const dataBuffer = await fs.readFile(filePath);
        const pdfData = await pdfParse(dataBuffer);
        content = pdfData.text;
        logger.info(
          `Loaded PDF: ${file}, text length: ${
            content.length
          }, preview: ${content.substring(0, 100)}`,
        );

        this.documentsCache.set(file, content);
      }

      logger.info(`Loaded ${this.documentsCache.size} documents`);
    } catch (error) {
      logger.error("Error loading documents", error);
    }
  }

  async reloadDocuments(): Promise<void> {
    this.documentsCache.clear();
    await this.loadDocuments();
  }

  async search(query: string): Promise<string> {
    if (this.documentsCache.size === 0) {
      await this.loadDocuments();
    }

    const results: SearchResult[] = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

    for (const [file, content] of this.documentsCache) {
      const lines = content.split("\n").filter((l) => l.trim().length > 0);

      for (let i = 0; i < lines.length; i++) {
        const lineLower = lines[i].toLowerCase();
        const hasMatch =
          queryWords.some((word) => lineLower.includes(word)) ||
          lineLower.includes(queryLower);

        if (hasMatch) {
          const start = Math.max(0, i - 2);
          const end = Math.min(lines.length, i + 3);
          const context = lines.slice(start, end).join("\n");
          results.push({ content: context, source: file });
        }
      }

      // If no specific match found, return the full document content
      if (results.length === 0 && this.documentsCache.size > 0) {
        results.push({ content: content, source: file });
      }
    }

    return results.length > 0
      ? results
          .map((r) => `From ${r.source}:\n${r.content}`)
          .join("\n\n---\n\n")
      : "No relevant information found.";
  }
}

class RealtimeSessionManager {
  private ws: WebSocket | null = null;
  private readonly socket: Socket;
  private readonly searchService: DocumentSearchService;

  constructor(socket: Socket, searchService: DocumentSearchService) {
    this.socket = socket;
    this.searchService = searchService;
  }

  connect(apiKey: string): void {
    logger.info("Connecting to OpenAI Realtime API");

    this.ws = new WebSocket(CONFIG.OPENAI_REALTIME_URL, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    this.ws.on("open", () => this.handleOpen());
    this.ws.on("message", (data: Buffer) => this.handleMessage(data));
    this.ws.on("error", (error: Error) => this.handleError(error));
    this.ws.on("close", () => this.handleClose());
  }

  private handleOpen(): void {
    logger.info("Connected to OpenAI Realtime API");
    this.sendSessionConfig();
    this.socket.emit("session_started");
  }

  private sendSessionConfig(): void {
    const config: OpenAISessionConfig = {
      modalities: ["text", "audio"],
      instructions: SYSTEM_INSTRUCTIONS,
      voice: "alloy",
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      input_audio_transcription: { model: "whisper-1", language: "en" },
      turn_detection: {
        type: "server_vad",
        threshold: 0.6,
        prefix_padding_ms: 300,
        silence_duration_ms: 1000,
      },
      tools: [
        {
          type: "function",
          name: "search_documents",
          description:
            "Search through PDF documents to find relevant information. Use this tool for ANY question the user asks.",
          parameters: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "The search query to find relevant information",
              },
            },
            required: ["query"],
          },
        },
      ],
      tool_choice: "auto",
    };

    this.send({ type: "session.update", session: config });
  }

  private async handleMessage(data: Buffer): Promise<void> {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "response.function_call_arguments.done") {
        await this.handleFunctionCall(message as FunctionCallMessage);
      } else {
        this.socket.emit("message", message);
      }
    } catch (error) {
      logger.error("Error processing OpenAI message", error);
    }
  }

  private async handleFunctionCall(
    message: FunctionCallMessage,
  ): Promise<void> {
    const args = JSON.parse(message.arguments) as { query: string };
    logger.info("Function call received", {
      name: message.name,
      query: args.query,
    });

    const result = await this.searchService.search(args.query);
    logger.info("Search result", {
      resultLength: result.length,
      preview: result.substring(0, 200),
    });

    this.send({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: message.call_id,
        output: result,
      },
    });

    this.send({ type: "response.create" });
  }

  private handleError(error: Error): void {
    logger.error("OpenAI WebSocket error", error);
    this.socket.emit("error", error.message);
  }

  private handleClose(): void {
    logger.info("OpenAI WebSocket closed");
  }

  sendAudio(audioData: ArrayBuffer): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const base64Audio = Buffer.from(audioData).toString("base64");
      this.send({ type: "input_audio_buffer.append", audio: base64Audio });
    }
  }

  private send(data: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

async function main(): Promise<void> {
  const app = next({
    dev: CONFIG.IS_DEV,
    hostname: CONFIG.HOSTNAME,
    port: CONFIG.PORT,
  });

  const handle = app.getRequestHandler();
  const searchService = new DocumentSearchService(CONFIG.DATA_DIR);

  await app.prepare();

  const server = createServer(
    async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const parsedUrl = parse(req.url || "", true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        logger.error("Error handling request", err);
        res.statusCode = 500;
        res.end("Internal server error");
      }
    },
  );

  const io = new SocketIOServer(server, {
    cors: {
      origin: CONFIG.IS_DEV ? "*" : undefined,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    logger.info("Client connected", { id: socket.id });

    let sessionManager: RealtimeSessionManager | null = null;

    socket.on("start_session", ({ apiKey }: { apiKey: string }) => {
      sessionManager = new RealtimeSessionManager(socket, searchService);
      sessionManager.connect(apiKey);
    });

    socket.on("audio", (audioData: ArrayBuffer) => {
      sessionManager?.sendAudio(audioData);
    });

    socket.on("disconnect", () => {
      logger.info("Client disconnected", { id: socket.id });
      sessionManager?.disconnect();
    });
  });

  server.once("error", (err: Error) => {
    logger.error("Server error", err);
    process.exit(1);
  });

  server.listen(CONFIG.PORT, () => {
    logger.info(`Server ready on http://${CONFIG.HOSTNAME}:${CONFIG.PORT}`);
  });
}

main().catch((err: Error) => {
  logger.error("Failed to start server", err);
  process.exit(1);
});
