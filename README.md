# Real-time Voice RAG Application

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A real-time voice conversation application that uses OpenAI's GPT-4 Realtime API with RAG (Retrieval-Augmented Generation) capabilities. The AI assistant can search through company documents to answer questions accurately.

## Features

- 🎤 Real-time voice conversation with AI
- 📄 RAG integration with company documents
- 🔍 MCP (Model Context Protocol) for document retrieval
- 🗣️ Voice activity detection (VAD)
- 📝 Live transcription
- 🔊 Audio playback of AI responses

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Custom Node.js server with Socket.IO
- **AI**: OpenAI GPT-4 Realtime API
- **Real-time Communication**: Socket.IO, WebSocket
- **Document Processing**: Text file parsing with MCP protocol

## Prerequisites

- Node.js 18+ installed
- OpenAI API key with access to GPT-4 Realtime API
- Modern web browser with microphone support

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd gentrix-rag-voice
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file with your OpenAI API key:

```bash
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env.local
```

Or create the file manually and add:

```
OPENAI_API_KEY=your_openai_api_key_here
```

> **Note**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on [http://localhost:8080](http://localhost:8080)

### Production Mode

```bash
npm run build
npm start
```

## Usage

1. Open the application in your browser
2. Click **"Start Conversation"**
3. Allow microphone access when prompted
4. Wait for the status to show "Session started - Ready to talk"
5. Start speaking - ask questions about:
   - Company information (TechVision Solutions)
   - Products and services
   - Pricing and plans
   - Contact details
6. The AI will search the documents and respond with accurate information
7. Click **"End Conversation"** when done

## Project Structure

```
gentrix-rag-voice/
├── .github/workflows/            # CI/CD
│   └── ci.yml
├── data/                         # RAG documents
│   ├── company-info.txt
│   └── product-catalog.txt
├── src/
│   ├── __tests__/               # Unit tests
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   ├── app/
│   │   ├── api/realtime/        # Next.js API routes
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                  # Reusable UI components
│   │   ├── ErrorBoundary.tsx
│   │   └── VoiceChat.tsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAudioPlayer.ts
│   │   ├── useMicrophone.ts
│   │   └── useVoiceChat.ts
│   ├── lib/                     # Utilities
│   │   ├── config.ts
│   │   └── constants.ts
│   └── types/                   # TypeScript types
│       └── index.ts
├── server.ts                    # Socket.IO server (TypeScript)
├── jest.config.js
├── package.json
└── tsconfig.json
```

## How It Works

1. **Client Connection**: User clicks "Start Conversation" and grants microphone access
2. **WebSocket Setup**: Socket.IO establishes connection between client and server
3. **OpenAI Connection**: Server connects to OpenAI Realtime API via WebSocket
4. **Audio Streaming**: Microphone audio is captured, converted to PCM16, and streamed to OpenAI
5. **Voice Activity Detection**: OpenAI's VAD detects when user stops speaking
6. **Document Search**: When AI needs information, it calls the `search_documents` function
7. **MCP Protocol**: Server searches local documents and returns relevant context
8. **AI Response**: OpenAI generates response with retrieved information
9. **Audio Playback**: AI response audio is streamed back and played to user

## Document Management

Documents are stored in the `data/` directory as **PDF files**.

The system automatically:

- Loads all `.pdf` files on startup
- Extracts text from PDF files using pdf-parse
- Searches through content using keyword matching
- Returns relevant context (2 lines before and after matches)
- Caches documents for faster subsequent searches

To add new documents:

1. Add `.pdf` files to the `data/` directory
2. Restart the server
3. The AI will automatically search through your documents

## API Configuration

The application uses OpenAI's GPT-4 Realtime API with the following configuration:

- **Model**: `gpt-4o-realtime-preview-2024-12-17`
- **Voice**: Alloy
- **Audio Format**: PCM16 (16-bit, 24kHz)
- **VAD Threshold**: 0.5
- **Silence Duration**: 500ms

## Troubleshooting

### Microphone Access Denied

- Check browser permissions
- Ensure HTTPS or localhost
- Try a different browser

### Connection Issues

- Verify OpenAI API key is valid
- Check API key has Realtime API access
- Ensure port 3000 is available

### No Audio Playback

- Check browser audio permissions
- Verify speakers/headphones are working
- Check browser console for errors

### Document Search Not Working

- Verify `.txt` files exist in `data/` directory
- Check file encoding (should be UTF-8)
- Review server logs for errors

## Development

### Running Tests

```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

### Adding New Tools

To add new MCP tools, edit `server.ts` and add to the `tools` array in the session configuration:

```typescript
tools: [
  {
    type: "function",
    name: "your_tool_name",
    description: "Tool description",
    parameters: {
      type: "object",
      properties: {
        // Parameter schema
      },
      required: [],
    },
  },
];
```

### Customizing AI Instructions

Edit the `SYSTEM_INSTRUCTIONS` constant in `server.ts` to change the AI's behavior and personality.

## Security Notes

- Never commit `.env.local` to version control
- API key is stored server-side only
- Client never has direct access to OpenAI API key
- Use HTTPS in production

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, OpenAI Realtime API, and MCP
