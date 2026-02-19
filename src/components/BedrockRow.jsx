import './BedrockRow.css';

function BedrockRow() {
  return (
    <div className="bedrock-row">
      <div className="bedrock-chip bc-bedrock">
        <div className="bc-title">🧠 Amazon Bedrock</div>
        <div className="bc-sub">Foundation models · Inference · Embeddings · Model routing</div>
      </div>
      <div className="bedrock-chip bc-cognito">
        <div className="bc-title">🔐 AgentCore Identity</div>
        <div className="bc-sub">Cognito · IAM · OAuth 2.0 · Multi-tenant token vault</div>
      </div>
    </div>
  );
}

export default BedrockRow;
