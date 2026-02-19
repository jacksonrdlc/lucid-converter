function Legend() {
  const items = [
    { color: '#5B21B6', label: 'External HITL (Teams)' },
    { color: '#1E3A5F', label: 'Runtime & Orchestration' },
    { color: '#1B4F8A', label: 'Context Ingestion' },
    { color: '#374151', label: 'Canonical Schemas' },
    { color: '#1D4ED8', label: 'HITL Review' },
    { color: '#5B21B6', label: 'Memory' },
    { color: '#1B4F8A', label: 'Gateway + MCP Connectors' },
    { color: '#92400E', label: 'Policy + Evaluations' },
    { color: '#0052CC', label: 'Enterprise Tools (external)' },
  ];

  return (
    <div className="legend">
      {items.map((item, idx) => (
        <div key={idx} className="li">
          <div className="ld" style={{ background: item.color }}></div>
          {item.label}
        </div>
      ))}
      <div style={{ marginLeft: 'auto', fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#9CA3AF' }}>
        Slalom · Cigna / MDLive Discovery · 2025
      </div>
    </div>
  );
}

export default Legend;
