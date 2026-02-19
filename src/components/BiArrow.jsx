import './BiArrow.css';

function BiArrow({ downColor = '#7C3AED', upColor = '#94A3B8', downLabel = 'input', upLabel = 'response' }) {
  return (
    <div className="bi-arrow">
      {/* down = input */}
      <div className="ba-line-down" style={{ background: downColor }}></div>
      <div className="ba-arrowhead-down" style={{ borderTop: `7px solid ${downColor}` }}></div>
      <div className="ba-label" style={{ color: downColor }}>{downLabel}</div>
      <div className="ba-gap"></div>
      {/* up = response */}
      <div className="ba-label" style={{ color: upColor }}>{upLabel}</div>
      <div className="ba-arrowhead-up" style={{ borderBottom: `7px solid ${upColor}` }}></div>
      <div className="ba-line-down" style={{ background: upColor }}></div>
    </div>
  );
}

export default BiArrow;
