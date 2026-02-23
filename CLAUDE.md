# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

A React application that visualizes the AWS AgentCore — MDLive Enterprise SDLC Agent Architecture as an interactive diagram. It exports diagrams to Lucidchart via their REST API and evaluates diagram layout quality using Claude Vision.

## Development Commands

```bash
# Frontend dev server (Vite, port 5173)
npm run dev

# Backend evaluation server (Express, port 3001)
npm run dev:server

# Production build (outputs to dist/)
npm run build
```

Both servers must run simultaneously for full functionality. Vite proxies `/api/*` requests to `http://localhost:3001`.

There is no test suite configured.

## Environment Setup

**Frontend** — create `.env.local` from `.env.local.example`:
- `VITE_LUCID_API_KEY` — required for Lucidchart API
- `VITE_LUCID_FOLDER_ID` — optional, organize diagrams in a folder
- `VITE_LUCID_DOCUMENT_ID` — optional, target a specific document
- `VITE_EVAL_SERVER_URL` — optional, defaults to `/api` via Vite proxy

**Backend** — create `server/.env` from `server/.env.example`:
- `ANTHROPIC_API_KEY` — required for Claude Vision evaluation
- `PORT` — defaults to 3001

The server has its own `package.json`; run `npm install` in both root and `server/` directories.

## Architecture

**Frontend (React 18 + Vite 5):**
- `src/App.jsx` — root component rendering the architecture diagram and control buttons
- `src/components/LucidAPIIntegration.jsx` — UI panel for Lucid API operations (test connection, list docs, create, import)
- `src/components/LucidDiagramGenerator.jsx` — orchestrates diagram generation
- `src/components/DiagramPreview.jsx` — renders SVG preview and captures screenshots for evaluation
- `src/components/AIFeedbackPanel.jsx` — displays structured Claude Vision evaluation results

**Utilities:**
- `src/utils/lucidDiagramData.js` — architecture data definitions and procedural Lucid Standard Import JSON generation (shapes, lines, text fitting)
- `src/utils/lucidchartAPI.js` — `LucidchartAPI` class wrapping the Lucidchart REST API
- `src/utils/evaluationAPI.js` — fetch wrapper for the `/api/evaluate` endpoint
- `src/utils/svgRenderer.jsx` — SVG rendering utilities
- `src/hooks/useLucidAPI.js` — custom React hook wrapping `LucidchartAPI` with loading/error/data state

**Backend (`server/`):**
- `server/index.js` — Express server with CORS and JSON middleware
- `server/evaluateRoute.js` — `/api/evaluate` endpoint that accepts base64 PNG screenshots, sends them to Claude Vision, and returns structured feedback scores (textOverflow, spacing, readability, layoutQuality, etc.)

**Data flow for Lucid export:** App renders diagram → `lucidDiagramData.js` generates Lucid Standard Import JSON → JSZip creates `.lucid` file → multipart form upload to Lucidchart API.

**Data flow for AI evaluation:** DiagramPreview captures screenshot → base64 PNG sent to `/api/evaluate` → Express proxies to Claude Vision → structured JSON feedback displayed in AIFeedbackPanel.

## Key Patterns

- State management is React hooks only (useState, useCallback, custom hooks) — no Redux or Context
- Both frontend and backend use ES modules (`"type": "module"`)
- CSS is scoped per-component with a global `index.css`; layout uses CSS Grid
- The diagram components (AWSRegion, ExternalColumn, Legend, etc.) represent visual sections of the architecture diagram
- Text measurement in `lucidDiagramData.js` uses a custom algorithm for fitting text into shapes with font size optimization
- Existing docs in repo: `LUCID_SETUP.md` (API key setup), `API_DEBUGGING_GUIDE.md` (troubleshooting), `LUCID_JSON_FORMAT.md` (import format spec)
