import './BottomRail.css';

function BottomRail() {
  const nodes = [
    {
      icon: '🗂️',
      label: 'Amazon S3',
      title: 'Rule Sets & Artifacts',
      description: 'Config-driven workflow definitions · Shared prompt templates',
      dots: ['Prompt templates', 'Cedar policies', 'Draft checkpoints'],
      class: 'rn-s3',
    },
    {
      icon: '🔭',
      label: 'AgentCore Observability',
      title: 'Traceability & Ops',
      description: '"Git blame for requirements" — every artifact traced end-to-end',
      dots: ['Prompt version', 'Model version', 'Reviewer ID', 'CloudWatch'],
      class: 'rn-observ',
    },
    {
      icon: '📏',
      label: 'Policy + Evaluations',
      title: 'Governance',
      description: 'Agents may draft, not decide · Policy-driven not prompt-driven',
      dots: ['Cedar rules', 'No autonomous writes', '13 evaluators', 'Kill switch'],
      class: 'rn-policy',
    },
  ];

  return (
    <div className="bottom-rail">
      <div className="rail-label">⚡ Shared Platform Infrastructure</div>
      <div className="rail-grid">
        {nodes.map((node, idx) => (
          <div key={idx} className={`rail-node ${node.class}`}>
            <div className="rn-icon">{node.icon}</div>
            <div className="rn-label">{node.label}</div>
            <div className="rn-title">{node.title}</div>
            <div className="rn-sub">{node.description}</div>
            <div className="rn-dots">
              {node.dots.map((dot, dotIdx) => (
                <span key={dotIdx} className="rn-dot">{dot}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BottomRail;
