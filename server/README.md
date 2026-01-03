# Backend Server

This backend server handles Hugging Face API calls securely, keeping your API key safe on the server side.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env` file (in the root directory):
   ```
   HUGGINGFACE_API_KEY=your_huggingface_token_here
   HUGGINGFACE_MODEL=meta-llama/Meta-Llama-3-8B-Instruct
   PORT=3001
   ```

## Running the Server

### Development

Run both frontend and backend together:
```bash
npm run dev:all
```

Or run them separately:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run server
```

### Production

For production, you'll need to deploy the backend server separately (e.g., on Heroku, Railway, Render, etc.) and update the `VITE_API_BASE_URL` environment variable in your frontend build.

## API Endpoints

- `POST /api/chat` - Send a prompt and get AI response
  - Body: `{ "prompt": "your prompt here" }`
  - Response: `{ "response": "AI generated text" }`

- `GET /api/health` - Health check endpoint

## Security

The Hugging Face API key is stored server-side and never exposed to the client. The frontend communicates with this backend API, which then securely calls the Hugging Face API.

