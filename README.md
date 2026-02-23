# Lucid Converter

A React application that generates architecture diagrams for the AWS AgentCore MDLive Enterprise SDLC Agent platform and exports them to Lucidchart. Includes an AI-powered auto-optimize loop that uses Claude Vision to iteratively improve diagram layout quality.

## Features

- **Diagram Generation** -- Procedurally generates Lucid Standard Import JSON from architecture data, with auto-fitting text, dynamic container sizing, and Unicode icon support
- **SVG Preview** -- Live in-browser preview of the diagram before exporting
- **Lucidchart Export** -- One-click import to Lucidchart via their REST API
- **AI Evaluation** -- Claude Vision scores diagrams on text containment, shape overlap, parent containment, information completeness, and structural fidelity
- **Auto-Optimize** -- Iterative feedback loop: generate, evaluate, adjust layout parameters, regenerate until the diagram scores 7+/10 or hits max iterations

## Quick Start

### Prerequisites

- Node.js 18+
- A [Lucidchart API key](https://developer.lucid.co/) (for export)
- An [Anthropic API key](https://console.anthropic.com/) (for AI evaluation)

### Install

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..
```

### Configure

```bash
# Frontend env
cp .env.local.example .env.local
# Set VITE_LUCID_API_KEY

# Backend env
cp server/.env.example server/.env
# Set ANTHROPIC_API_KEY
```

### Run

```bash
# Start both servers (two terminals)
npm run dev          # Frontend on http://localhost:5173
npm run dev:server   # Backend on http://localhost:3001
```

Vite proxies `/api/*` requests to the backend automatically.

## Project Structure

```
lucid-converter/
├── src/
│   ├── App.jsx                          # Root component
│   ├── components/
│   │   ├── LucidAPIIntegration.jsx      # Lucid API panel
│   │   ├── LucidDiagramGenerator.jsx    # Diagram generation orchestration
│   │   ├── DiagramPreview.jsx           # SVG preview, auto-optimize loop, Lucid import
│   │   └── AIFeedbackPanel.jsx          # Evaluation score display
│   ├── hooks/
│   │   └── useLucidAPI.js               # React hook for Lucidchart API
│   └── utils/
│       ├── lucidDiagramData.js          # Architecture data + Lucid JSON generation
│       ├── lucidchartAPI.js             # Lucidchart REST API wrapper
│       ├── evaluationAPI.js             # Fetch wrappers for evaluation endpoints
│       └── svgRenderer.jsx              # SVG rendering utilities
├── server/
│   ├── index.js                         # Express server
│   ├── evaluateRoute.js                 # Claude Vision evaluation endpoint
│   └── adjustLayoutRoute.js             # Layout parameter adjustment endpoint
└── vite.config.js
```

## How Auto-Optimize Works

1. **Generate** -- Builds the diagram with current layout parameters (column positions, card sizes, text measurement constants)
2. **Capture** -- Takes a screenshot of the SVG preview via `html-to-image`
3. **Evaluate** -- Sends the screenshot to Claude Vision, which scores five categories (1-10 scale)
4. **Adjust** -- If overall score < 7, sends scores and issues to Claude, which returns targeted parameter adjustments
5. **Repeat** -- Regenerates with adjusted parameters; stops when score >= 7 or after 5 iterations

Layout parameters include column positions/widths, card dimensions, gaps, and text measurement ratios (character width, line height, font size bounds). Containers dynamically resize to fit their children.

## Tech Stack

- **Frontend**: React 18, Vite 5, JSZip, html-to-image
- **Backend**: Express 4, Anthropic SDK (Claude Vision)
- **Export**: Lucidchart Standard Import format (`.lucid` ZIP)
