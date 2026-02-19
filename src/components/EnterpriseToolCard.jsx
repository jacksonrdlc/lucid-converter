import './EnterpriseToolCard.css';

function EnterpriseToolCard({ icon, name, description, mcpLabel, className }) {
  return (
    <div className={`ent-tool ${className}`}>
      <div className="ent-tool-header">
        <span className="ent-tool-icon">{icon}</span>
        <span className="ent-tool-name">{name}</span>
      </div>
      <div className="ent-tool-sub">{description}</div>
      <span className="ent-tool-mcp">via {mcpLabel}</span>
    </div>
  );
}

export default EnterpriseToolCard;
