import './AWSRegion.css';
import MSAPGrid from './MSAPGrid';
import BedrockRow from './BedrockRow';
import BottomRail from './BottomRail';
import GatewayStrip from './GatewayStrip';

function AWSRegion() {
  return (
    <div className="aws-region">
      <span className="aws-region-label">
        <svg width="15" height="15" viewBox="0 0 24 24">
          <rect width="24" height="24" rx="3" fill="#FF9900" />
          <text x="12" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white" fontFamily="sans-serif">
            aws
          </text>
        </svg>
        AWS Cloud
      </span>
      <span className="msap-tag">MSAP — Minimal Shared Agent Platform</span>

      <div className="aws-inner">
        {/* AgentCore Runtime */}
        <div>
          <div className="col-header">⚙ AgentCore Runtime &amp; MSAP Components</div>
          <div className="runtime-box">
            <div className="runtime-title">AgentCore Runtime</div>
            <div className="runtime-sub">Any Framework: CrewAI · LangGraph · LlamaIndex · Strands</div>

            <MSAPGrid />

            <BedrockRow />
          </div>

          {/* Bottom Rail inside AWS */}
          <BottomRail />
        </div>

        {/* AgentCore Gateway strip */}
        <div>
          <div className="col-header">🔀 AgentCore Gateway</div>
          <GatewayStrip />
        </div>
      </div>
    </div>
  );
}

export default AWSRegion;
