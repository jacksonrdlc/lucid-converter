import './App.css';
import { useState } from 'react';
import ExternalColumn from './components/ExternalColumn';
import BiArrow from './components/BiArrow';
import AWSRegion from './components/AWSRegion';
import Legend from './components/Legend';
import LucidDiagramGenerator from './components/LucidDiagramGenerator';
import LucidAPIIntegration from './components/LucidAPIIntegration';

function App() {
  const [showLucidExport, setShowLucidExport] = useState(false);
  const [showEvaluate, setShowEvaluate] = useState(false);
  return (
    <>
      <div className="pg-header">
        <div>
          <h1>AWS AgentCore — MDLive Enterprise SDLC Agent Architecture</h1>
          <p>Minimal Shared Agent Platform (MSAP) &nbsp;·&nbsp; 4 Pilot Workflows &nbsp;·&nbsp; Human-in-the-Loop with Stage Gate Control</p>
        </div>
        <div className="pg-header-right">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => setShowLucidExport(!showLucidExport)}
              style={{
                padding: '6px 12px',
                background: '#3B82F6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {showLucidExport ? 'Hide' : 'Export to Lucid'}
            </button>
            <button
              onClick={() => setShowEvaluate(!showEvaluate)}
              style={{
                padding: '6px 12px',
                background: '#8B5CF6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              {showEvaluate ? 'Hide' : 'Evaluate Diagram'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: '#6B7280', marginTop: 'auto' }}>Phase 1 Pilot &nbsp;·&nbsp; Slalom / MDLive<br/>
          Amazon Bedrock AgentCore</div>
        </div>
      </div>

      <div className="card">
        <div className="outer-layout">
          {/* ══ LEFT: Teams (external) ══ */}
          <ExternalColumn side="left" />

          {/* ══ Arrow: Teams ↔ AWS ══ */}
          <BiArrow 
            downColor="#7C3AED" 
            upColor="#94A3B8" 
            downLabel="input" 
            upLabel="response" 
          />

          {/* ══ CENTER: AWS Cloud ══ */}
          <AWSRegion />

          {/* ══ Arrow: AWS ↔ Enterprise Tools ══ */}
          <BiArrow 
            downColor="#2563EB" 
            upColor="#94A3B8" 
            downLabel="write" 
            upLabel="read" 
          />

          {/* ══ RIGHT: Enterprise Tools (external) ══ */}
          <ExternalColumn side="right" />
        </div>

        {/* Legend */}
        <Legend />
      </div>

      {/* Lucid Diagram Export Section */}
      {showLucidExport && <LucidDiagramGenerator />}

      {/* Diagram Evaluation Section */}
      {showEvaluate && <LucidAPIIntegration />}
    </>
  );
}

export default App;
