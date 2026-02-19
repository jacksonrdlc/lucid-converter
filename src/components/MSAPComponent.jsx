import './MSAPComponent.css';

function MSAPComponent({ type, icon, label, title, bullets, chips }) {
  return (
    <div className={`msap-component mc-${type}`}>
      <div className="mc-header">
        <span className="mc-icon">{icon}</span>
        <span className="mc-label">{label}</span>
      </div>
      <div className="mc-title">{title}</div>
      <ul className="mc-bullets">
        {bullets.map((bullet, idx) => (
          <li key={idx}>{bullet}</li>
        ))}
      </ul>
      {chips && (
        <div className="schema-chips">
          {chips.map((chip, idx) => (
            <span key={idx} className="schema-chip">{chip}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default MSAPComponent;
