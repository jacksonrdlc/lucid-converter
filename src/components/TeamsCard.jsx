import './TeamsCard.css';

function TeamsCard() {
  const roles = ['Product Manager', 'QA Engineer', 'Developer', 'Analytics Lead'];

  return (
    <div className="teams-card">
      <div className="teams-icon">💬</div>
      <div className="teams-title">Microsoft Teams</div>
      <div className="teams-sub">HITL Interface</div>
      <div className="teams-roles">
        {roles.map((role, idx) => (
          <span key={idx} className="teams-role">{role}</span>
        ))}
      </div>
    </div>
  );
}

export default TeamsCard;
