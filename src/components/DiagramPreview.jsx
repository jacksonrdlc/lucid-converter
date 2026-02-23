import { useState, useRef, useCallback } from 'react';
import { generateLucidDiagram, DEFAULT_LAYOUT_CONFIG } from '../utils/lucidDiagramData';
import { renderDiagramToSVG } from '../utils/svgRenderer.jsx';
import { evaluateDiagram, adjustLayout } from '../utils/evaluationAPI';
import { useLucidAPI } from '../hooks/useLucidAPI';
import AIFeedbackPanel from './AIFeedbackPanel';
import './DiagramPreview.css';

const MAX_ITERATIONS = 5;
const SCORE_THRESHOLD = 7;

const STATUS_LABELS = {
  idle: 'Idle',
  generating: 'Generating diagram...',
  capturing: 'Capturing screenshot...',
  evaluating: 'Evaluating with Claude Vision...',
  adjusting: 'Adjusting layout parameters...',
  done: 'Optimization complete',
  error: 'Error occurred',
};

function DiagramPreview() {
  const [diagramData, setDiagramData] = useState(() => generateLucidDiagram());
  const [running, setRunning] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [evalError, setEvalError] = useState(null);
  const wrapperRef = useRef(null);

  // Lucid import
  const { importDiagramJSON, loading: lucidLoading, error: lucidError } = useLucidAPI();
  const [importResult, setImportResult] = useState(null);

  // Auto-optimize state
  const [optimizing, setOptimizing] = useState(false);
  const [loopStatus, setLoopStatus] = useState('idle');
  const [currentIteration, setCurrentIteration] = useState(0);
  const [layoutConfig, setLayoutConfig] = useState({});
  const [iterationHistory, setIterationHistory] = useState([]);
  const abortRef = useRef(false);

  const captureScreenshot = useCallback(async () => {
    if (!wrapperRef.current) return null;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(wrapperRef.current, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      fontEmbedCSS: '',
      style: { fontFamily: "'IBM Plex Sans', sans-serif" },
    });
    return dataUrl.split(',')[1];
  }, []);

  const handleRegenerate = useCallback(() => {
    setDiagramData(generateLucidDiagram());
    setFeedback(null);
    setEvalError(null);
  }, []);

  const handleEvaluate = useCallback(async () => {
    setRunning(true);
    setEvalError(null);
    setFeedback(null);

    try {
      const base64 = await captureScreenshot();
      if (!base64) throw new Error('Failed to capture screenshot');
      const result = await evaluateDiagram(base64);
      setFeedback(result);
    } catch (err) {
      console.error('Evaluation failed:', err);
      setEvalError(err.message);
    } finally {
      setRunning(false);
    }
  }, [captureScreenshot]);

  const handleAutoOptimize = useCallback(async () => {
    abortRef.current = false;
    setOptimizing(true);
    setRunning(true);
    setEvalError(null);
    setIterationHistory([]);
    setFeedback(null);

    let config = { ...DEFAULT_LAYOUT_CONFIG, ...layoutConfig };

    try {
      for (let i = 1; i <= MAX_ITERATIONS; i++) {
        if (abortRef.current) { setLoopStatus('done'); break; }

        setCurrentIteration(i);

        // Generate diagram with current config
        setLoopStatus('generating');
        const newDiagram = generateLucidDiagram(undefined, config);
        setDiagramData(newDiagram);
        setLayoutConfig(config);

        // Wait for React render
        await new Promise((r) => setTimeout(r, 400));
        if (abortRef.current) { setLoopStatus('done'); break; }

        // Capture + evaluate
        setLoopStatus('capturing');
        const base64 = await captureScreenshot();
        if (!base64) throw new Error('Failed to capture screenshot');
        if (abortRef.current) { setLoopStatus('done'); break; }

        setLoopStatus('evaluating');
        const evaluation = await evaluateDiagram(base64);
        setFeedback(evaluation);

        const score = evaluation?.overallScore ?? 0;
        const entry = { iteration: i, score, config: { ...config } };

        if (abortRef.current) {
          setIterationHistory((prev) => [...prev, { ...entry, reasoning: 'Stopped by user' }]);
          setLoopStatus('done');
          break;
        }

        if (score >= SCORE_THRESHOLD) {
          setIterationHistory((prev) => [...prev, { ...entry, reasoning: `Score ${score} >= ${SCORE_THRESHOLD} threshold. Done!` }]);
          setLoopStatus('done');
          break;
        }

        if (i === MAX_ITERATIONS) {
          setIterationHistory((prev) => [...prev, { ...entry, reasoning: `Max iterations (${MAX_ITERATIONS}) reached. Best score: ${score}` }]);
          setLoopStatus('done');
          break;
        }

        // Get layout adjustments from Claude
        setLoopStatus('adjusting');
        const { adjustedConfig, reasoning } = await adjustLayout(config, evaluation, i);
        config = adjustedConfig;

        setIterationHistory((prev) => [...prev, { ...entry, reasoning }]);
      }
    } catch (err) {
      console.error('Auto-optimize failed:', err);
      setEvalError(err.message);
      setLoopStatus('error');
    } finally {
      setOptimizing(false);
      setRunning(false);
    }
  }, [layoutConfig, captureScreenshot]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
  }, []);

  const handleImportToLucid = useCallback(async () => {
    setImportResult(null);
    const folderId = import.meta.env.VITE_LUCID_FOLDER_ID || null;
    const result = await importDiagramJSON(
      diagramData,
      'AWS AgentCore — MSAP Architecture',
      folderId,
    );
    if (result) {
      setImportResult(result);
    }
  }, [diagramData, importDiagramJSON]);

  // Render the SVG from diagram data
  const { vb, shapeElements, lineElements, markers } = renderDiagramToSVG(diagramData);
  const viewBoxStr = `${vb.x} ${vb.y} ${vb.width} ${vb.height}`;

  const progressPct = optimizing ? (currentIteration / MAX_ITERATIONS) * 100 : 0;

  return (
    <div className="diagram-preview">
      {/* Toolbar */}
      <div className="preview-toolbar">
        <button
          className="preview-btn preview-btn--evaluate"
          onClick={handleEvaluate}
          disabled={running}
        >
          {running && !optimizing ? 'Evaluating...' : 'Evaluate'}
        </button>
        <button
          className="preview-btn preview-btn--regen"
          onClick={handleRegenerate}
          disabled={running}
        >
          Regenerate
        </button>
        {!optimizing ? (
          <button
            className="preview-btn preview-btn--optimize"
            onClick={handleAutoOptimize}
            disabled={running}
          >
            Auto-Optimize
          </button>
        ) : (
          <button
            className="preview-btn preview-btn--stop"
            onClick={handleStop}
          >
            Stop
          </button>
        )}
        <button
          className="preview-btn preview-btn--import"
          onClick={handleImportToLucid}
          disabled={running || lucidLoading}
        >
          {lucidLoading ? 'Importing...' : 'Import to Lucid'}
        </button>
      </div>

      {/* Lucid import result */}
      {importResult && (
        <div className="preview-success">
          Imported to Lucidchart — Document ID: {importResult.documentId || importResult.id || JSON.stringify(importResult)}
        </div>
      )}
      {lucidError && (
        <div className="preview-error">{lucidError}</div>
      )}

      {/* Optimization progress */}
      {optimizing && (
        <div className="optimize-progress">
          <div className="optimize-progress-header">
            <span className="optimize-status">{STATUS_LABELS[loopStatus]}</span>
            <span className="optimize-iteration">
              Iteration {currentIteration} / {MAX_ITERATIONS}
            </span>
          </div>
          <div className="optimize-progress-bar">
            <div
              className="optimize-progress-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* SVG Preview */}
      <div className="preview-svg-wrapper" ref={wrapperRef}>
        <svg
          viewBox={viewBoxStr}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ background: '#ffffff' }}
        >
          <defs>
            {markers}
          </defs>
          <g className="shapes">{shapeElements}</g>
          <g className="lines">{lineElements}</g>
        </svg>
      </div>

      {/* Stats */}
      <div className="preview-stats">
        {diagramData.shapes.length} shapes, {diagramData.lines.length} lines
      </div>

      {/* Error display */}
      {evalError && (
        <div className="preview-error">
          {evalError}
        </div>
      )}

      {/* AI Feedback */}
      {feedback && <AIFeedbackPanel feedback={feedback} />}

      {/* Iteration History */}
      {iterationHistory.length > 0 && (
        <div className="iteration-history">
          <h4 className="preview-section-title">Optimization History</h4>
          <div className="iteration-cards">
            {iterationHistory.map((entry) => (
              <div key={entry.iteration} className="iteration-card">
                <div className="iteration-card-header">
                  <span className="iteration-number">Iteration {entry.iteration}</span>
                  <span
                    className={`iteration-score ${
                      entry.score >= SCORE_THRESHOLD ? 'iteration-score--good' : 'iteration-score--low'
                    }`}
                  >
                    Score: {entry.score}/10
                  </span>
                </div>
                <p className="iteration-reasoning">{entry.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DiagramPreview;
