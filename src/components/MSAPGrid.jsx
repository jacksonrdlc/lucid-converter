import './MSAPGrid.css';
import MSAPComponent from './MSAPComponent';

function MSAPGrid() {
  const components = [
    {
      type: 'runtime',
      icon: '⚙️',
      label: 'Orchestration',
      title: 'Runtime & Orchestration',
      bullets: [
        'Deterministic step execution',
        'State: Draft → Review → Approved',
        'Pause / resume at HITL gates',
        'Idempotent safe retries',
        '8-hour execution windows',
        'A2A protocol support',
      ],
    },
    {
      type: 'ingestion',
      icon: '🔌',
      label: 'Context Layer',
      title: 'Unified Context Ingestion',
      bullets: [
        'Read-only in Phase 1',
        'Source-tagged on every object',
        'Figma screens → captioned text',
        'Jira structured records',
        'Confluence docs + PRDs',
        'HB error payloads + stack traces',
      ],
    },
    {
      type: 'schemas',
      icon: '🗃️',
      label: 'Canonical Schemas',
      title: 'Artifact Schemas',
      bullets: [
        'Prevents semantic drift',
        'Confidence + source metadata',
        'Traceability IDs on all artifacts',
        'Required + optional field defs',
      ],
      chips: ['Requirement', 'Story', 'Test Case', 'Incident'],
    },
    {
      type: 'hitl',
      icon: '👤',
      label: 'Human Review',
      title: 'HITL Review Interface',
      bullets: [
        'Source ↔ output side-by-side',
        'Approve / Edit / Reject',
        'Mandatory reason on rejection',
        'One interface across all agents',
        'Feedback loops back to agent',
      ],
    },
  ];

  return (
    <div className="msap-grid">
      {components.map((comp, idx) => (
        <MSAPComponent key={idx} {...comp} />
      ))}
    </div>
  );
}

export default MSAPGrid;
