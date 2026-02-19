import './GatewayStrip.css';

function GatewayStrip() {
  return (
    <div className="gateway-strip">
      <div className="gw-box gw-gateway">
        <div className="gw-title">🔀 Gateway</div>
        <div className="gw-sub">Unified MCP hub · Single secure endpoint · IAM + OAuth 2.0</div>
        <div className="gw-chips">
          <span className="gw-chip">Tool routing</span>
          <span className="gw-chip">Browser</span>
          <span className="gw-chip">Code Interp</span>
        </div>
      </div>

      <div className="gw-box gw-memory">
        <div className="gw-title">🧠 Memory</div>
        <div className="gw-sub">Solves agent statelessness across sessions</div>
        <div className="gw-chips">
          <span className="gw-chip">Short-term</span>
          <span className="gw-chip">Long-term</span>
          <span className="gw-chip">Episodic</span>
          <span className="gw-chip">365d · KMS</span>
        </div>
      </div>

      {/* MCP connectors label */}
      <div className="mcp-connectors-box">
        <div className="mcp-connectors-label">MCP CONNECTORS</div>

        <div className="mcp-connectors-content">
          {/* Input connectors */}
          <div className="mcp-section-label">INBOUND ← Enterprise</div>

          <div className="mcp-connector-item adobe">
            <div style={{ fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📊 Adobe Analytics
            </div>
            <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Event schema · CData MCP</div>
          </div>

          {/* Output connectors */}
          <div className="mcp-section-label" style={{ marginTop: '4px' }}>OUTBOUND → Enterprise</div>
          
          <div className="mcp-connector-item jira">
            <div style={{ fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🟦 Jira · Linear MCP
            </div>
            <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Ticket write · draft only</div>
          </div>

          <div className="mcp-connector-item confluence">
            <div style={{ fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              📘 Confluence MCP
            </div>
            <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>PRD draft · doc write</div>
          </div>

          <div className="mcp-connector-item zephyr">
            <div style={{ fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🧪 Zephyr MCP
            </div>
            <div style={{ fontSize: '9px', opacity: 0.8, marginTop: '2px' }}>Test write · human gated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GatewayStrip;
