# Vercel Deployment Guide

This guide will help you deploy your portfolio with the Hugging Face AI chat backend on Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Your Hugging Face API token
3. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Push Your Code to Git

Make sure your code is pushed to a Git repository:

```bash
git add .
git commit -m "Add Vercel serverless functions for Hugging Face API"
git push
```

### 2. Import Project to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect your Vite project

### 3. Configure Environment Variables

In the Vercel project settings, add these environment variables:

1. Go to your project → Settings → Environment Variables
2. Add the following:

   - **Name:** `HUGGINGFACE_API_KEY`
   - **Value:** `hf_your_token_here` (your Hugging Face API token - get it from https://huggingface.co/settings/tokens)
   - **Environments:** Production, Preview, Development (select all)

   - **Name:** `HUGGINGFACE_MODEL`
   - **Value:** `meta-llama/Meta-Llama-3-8B-Instruct` (or your preferred model)
   - **Environments:** Production, Preview, Development (select all)

### 4. Configure Build Settings

Vercel should auto-detect your Vite project, but verify these settings:

- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `your-project.vercel.app`

## How It Works

- **Frontend:** Built with Vite and deployed as static files
- **Backend API:** Serverless functions in the `api/` directory
  - `/api/chat` - Handles AI chat requests
  - `/api/health` - Health check endpoint

The API routes are automatically deployed as Vercel serverless functions. Your Hugging Face API key is stored securely in Vercel's environment variables and never exposed to the client.

## Testing

After deployment:

1. Visit your Vercel URL
2. Open the AI chat
3. Test with a question like "Tell me about your experience"

## Local Development

For local development, you can still use the Express server:

```bash
npm run dev:all
```

Or use Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

## Troubleshooting

### API Not Working

1. Check environment variables are set in Vercel dashboard
2. Verify the API routes are in the `api/` directory
3. Check Vercel function logs in the dashboard

### CORS Issues

The serverless functions include CORS headers. If you still have issues, check:
- The API endpoint URL is correct
- Environment variables are properly set

### Build Errors

- Ensure `vercel-build` script exists in `package.json`
- Check that all dependencies are in `package.json`
- Review build logs in Vercel dashboard

## Production URL

Once deployed, your API will be available at:
- `https://your-project.vercel.app/api/chat`
- `https://your-project.vercel.app/api/health`

The frontend automatically uses relative paths, so it will work seamlessly with your Vercel deployment.

