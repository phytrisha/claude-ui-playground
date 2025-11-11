# Claude Chat Application

A modern chat application built with Next.js 14+, TypeScript, shadcn/ui, and the Anthropic Claude API. Features a clean, minimal interface with real-time streaming responses.

## Tech Stack

- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **shadcn/ui** components for UI
- **Tailwind CSS** for styling
- **Anthropic SDK** for Claude AI integration
- **Claude Sonnet 4.5** (claude-sonnet-4-5-20250929) model

## Features

- Real-time streaming responses from Claude AI
- Clean and minimal chat interface
- TypeScript types for all API interactions
- Error handling for API requests
- Auto-scrolling chat history
- Responsive design

## Prerequisites

- Node.js 18+ installed
- An Anthropic API key (get one at [https://console.anthropic.com/](https://console.anthropic.com/))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your Anthropic API key:

```bash
cp .env.example .env.local
```

Then edit [.env.local](.env.local) and replace `your_api_key_here` with your actual Anthropic API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API route for Claude chat
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main chat interface
├── components/
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── scroll-area.tsx
├── lib/
│   └── utils.ts                  # Utility functions
└── types/
    └── chat.ts                   # TypeScript types for chat
```

## API Route

The chat API is available at `/api/chat` and accepts POST requests with the following format:

```typescript
{
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi there!" }
  ]
}
```

The API returns a streaming text response from Claude.

## TypeScript Types

All chat interactions are fully typed. See [src/types/chat.ts](src/types/chat.ts) for the type definitions:

- `Message`: Represents a chat message (user or assistant)
- `ChatRequest`: Request payload for the chat API
- `ChatResponse`: Response structure from the chat API

## Building for Production

```bash
npm run build
npm start
```

## Development

The page auto-updates as you edit files. The main chat interface is in [src/app/page.tsx](src/app/page.tsx).

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

## Environment Variables

- `ANTHROPIC_API_KEY`: Your Anthropic API key (required)

## License

MIT

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
