import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { evaluateRoute } from './evaluateRoute.js';
import { adjustLayoutRoute } from './adjustLayoutRoute.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow Vite dev server
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));

// JSON body limit 10mb for base64 images
app.use(express.json({ limit: '10mb' }));

// Routes
app.post('/api/evaluate', evaluateRoute);
app.post('/api/adjust-layout', adjustLayoutRoute);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Evaluation server running on http://localhost:${PORT}`);
});
