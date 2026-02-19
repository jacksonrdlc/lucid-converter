import { useEffect, useRef, useState } from 'react';
import { architectureData, generateLucidDiagram } from '../utils/lucidDiagramData';

function LucidDiagramGenerator() {
  const containerRef = useRef(null);
  const [diagramData, setDiagramData] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');

  useEffect(() => {
    // Generate diagram structure
    const diagram = generateLucidDiagram(architectureData);
    setDiagramData(diagram);
  }, []);

  const exportDiagram = () => {
    if (!diagramData) return;

    const exportData = {
      version: '1.0',
      title: architectureData.title,
      description: architectureData.description,
      timestamp: new Date().toISOString(),
      ...diagramData,
    };

    // Create JSON string
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create and trigger download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `agentcore-architecture-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>Lucid Diagram Export</h2>
        <button
          onClick={exportDiagram}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: '#3B82F6',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          ⬇️ Export as JSON
        </button>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '16px' }}>
        <h3 style={{ margin: '0 0 12px', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
          Diagram Structure
        </h3>
        
        {diagramData ? (
          <div style={{ fontSize: '12px', fontFamily: 'monospace', overflow: 'auto', maxHeight: '400px' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>Objects ({diagramData.objects.length}):</strong>
              {diagramData.objects.map((obj, idx) => (
                <div key={idx} style={{ paddingLeft: '12px', marginTop: '4px', color: '#666' }}>
                  • {obj.id} — {obj.type} @ ({obj.x}, {obj.y})
                </div>
              ))}
            </div>

            <div>
              <strong>Connections ({diagramData.connections.length}):</strong>
              {diagramData.connections.map((conn, idx) => (
                <div key={idx} style={{ paddingLeft: '12px', marginTop: '4px', color: '#666' }}>
                  • {conn.from} → {conn.to} {conn.label && `[${conn.label}]`}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Generating diagram...</p>
        )}
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: '#EFF6FF', borderRadius: '6px', fontSize: '13px', color: '#1E40AF', lineHeight: '1.6' }}>
        <strong>How to use in Lucidchart:</strong>
        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Download the JSON file</li>
          <li>Go to <a href="https://lucidchart.com" target="_blank" rel="noopener noreferrer">lucidchart.com</a></li>
          <li>Create a new diagram or import the JSON by using their API or developer tools</li>
          <li>The diagram structure includes all objects and their positions for recreating this architecture visualization</li>
        </ol>
      </div>
    </div>
  );
}

export default LucidDiagramGenerator;
