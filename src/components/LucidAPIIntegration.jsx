import DiagramPreview from './DiagramPreview';

function LucidAPIIntegration() {
  return (
    <div style={{ padding: '20px', background: '#f9fafb', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '700', color: '#374151' }}>
        Lucid Diagram Preview
      </h2>
      <DiagramPreview />
    </div>
  );
}

export default LucidAPIIntegration;
