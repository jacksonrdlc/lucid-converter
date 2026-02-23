/**
 * Client-side fetch to the Express evaluation proxy.
 * Sends a base64 PNG image to /api/evaluate and returns structured JSON feedback.
 */

const DEFAULT_BASE = import.meta.env.VITE_EVAL_SERVER_URL || '';
const DEFAULT_URL = '/api/evaluate';

/**
 * Send a diagram screenshot for AI evaluation.
 * @param {string} base64Image - Base64-encoded PNG (without data URL prefix)
 * @returns {Promise<object>} Structured evaluation feedback
 */
export async function evaluateDiagram(base64Image) {
  const url = import.meta.env.VITE_EVAL_SERVER_URL
    ? `${import.meta.env.VITE_EVAL_SERVER_URL}/api/evaluate`
    : DEFAULT_URL;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Evaluation request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.evaluation;
}

/**
 * Request layout adjustments based on evaluation feedback.
 * @param {object} currentConfig - Current DEFAULT_LAYOUT_CONFIG values
 * @param {object} evaluation - Evaluation result from evaluateDiagram()
 * @param {number} iteration - Current iteration number (1-based)
 * @returns {Promise<{adjustedConfig: object, reasoning: string}>}
 */
export async function adjustLayout(currentConfig, evaluation, iteration) {
  const url = DEFAULT_BASE
    ? `${DEFAULT_BASE}/api/adjust-layout`
    : '/api/adjust-layout';

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentConfig, evaluation, iteration }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Adjust-layout request failed (${res.status}): ${text}`);
  }

  return res.json();
}
