/**
 * Converts AgentCore Architecture to Lucid Diagram format
 */

export const architectureData = {
  title: 'AWS AgentCore — MDLive Enterprise SDLC Agent Architecture',
  description: 'Minimal Shared Agent Platform (MSAP) · 4 Pilot Workflows · Human-in-the-Loop with Stage Gate Control',
  
  sections: {
    external: {
      teams: {
        id: 'teams-external',
        type: 'external-app',
        name: 'Microsoft Teams',
        description: 'HITL Interface',
        roles: ['Product Manager', 'QA Engineer', 'Developer', 'Analytics Lead'],
        color: '#5B21B6',
      },
    },
    
    awsCloud: {
      region: 'AWS Cloud',
      label: 'MSAP — Minimal Shared Agent Platform',
      
      runtime: {
        id: 'runtime-orchestration',
        name: 'Runtime & Orchestration',
        icon: '⚙️',
        description: 'Deterministic step execution',
        features: [
          'Deterministic step execution',
          'State: Draft → Review → Approved',
          'Pause / resume at HITL gates',
          'Idempotent safe retries',
          '8-hour execution windows',
          'A2A protocol support',
        ],
        color: '#1E3A5F',
      },
      
      ingestion: {
        id: 'context-ingestion',
        name: 'Unified Context Ingestion',
        icon: '🔌',
        description: 'Read-only in Phase 1',
        features: [
          'Read-only in Phase 1',
          'Source-tagged on every object',
          'Figma screens → captioned text',
          'Jira structured records',
          'Confluence docs + PRDs',
          'HB error payloads + stack traces',
        ],
        color: '#1B4F8A',
      },
      
      schemas: {
        id: 'canonical-schemas',
        name: 'Artifact Schemas',
        icon: '🗃️',
        description: 'Prevents semantic drift',
        features: [
          'Prevents semantic drift',
          'Confidence + source metadata',
          'Traceability IDs on all artifacts',
          'Required + optional field defs',
        ],
        schemas: ['Requirement', 'Story', 'Test Case', 'Incident'],
        color: '#374151',
      },
      
      hitl: {
        id: 'hitl-review',
        name: 'HITL Review Interface',
        icon: '👤',
        description: 'Source ↔ output side-by-side',
        features: [
          'Source ↔ output side-by-side',
          'Approve / Edit / Reject',
          'Mandatory reason on rejection',
          'One interface across all agents',
          'Feedback loops back to agent',
        ],
        color: '#1D4ED8',
      },
      
      bedrock: {
        id: 'bedrock-identity',
        name: 'Amazon Bedrock & Identity',
        features: [
          { name: 'Amazon Bedrock', sub: 'Foundation models · Inference · Embeddings · Model routing', color: '#065F46' },
          { name: 'AgentCore Identity', sub: 'Cognito · IAM · OAuth 2.0 · Multi-tenant token vault', color: '#1E3A5F' },
        ],
      },
      
      infrastructure: {
        id: 'shared-infrastructure',
        name: 'Shared Platform Infrastructure',
        items: [
          {
            icon: '🗂️',
            name: 'Amazon S3',
            title: 'Rule Sets & Artifacts',
            description: 'Config-driven workflow definitions · Shared prompt templates',
            dots: ['Prompt templates', 'Cedar policies', 'Draft checkpoints'],
            color: '#9A3412',
          },
          {
            icon: '🔭',
            name: 'AgentCore Observability',
            title: 'Traceability & Ops',
            description: '"Git blame for requirements" — every artifact traced end-to-end',
            dots: ['Prompt version', 'Model version', 'Reviewer ID', 'CloudWatch'],
            color: '#1E3A5F',
          },
          {
            icon: '📏',
            name: 'Policy + Evaluations',
            title: 'Governance',
            description: 'Agents may draft, not decide · Policy-driven not prompt-driven',
            dots: ['Cedar rules', 'No autonomous writes', '13 evaluators', 'Kill switch'],
            color: '#92400E',
          },
        ],
      },
      
      gateway: {
        id: 'agentcore-gateway',
        name: 'AgentCore Gateway',
        items: [
          {
            name: 'Gateway',
            description: 'Unified MCP hub · Single secure endpoint · IAM + OAuth 2.0',
            chips: ['Tool routing', 'Browser', 'Code Interp'],
            color: '#1B4F8A',
          },
          {
            name: 'Memory',
            description: 'Solves agent statelessness across sessions',
            chips: ['Short-term', 'Long-term', 'Episodic', '365d · KMS'],
            color: '#5B21B6',
          },
        ],
        connectors: {
          inbound: [
            {
              name: 'Adobe Analytics',
              description: 'Event schema · CData MCP',
              color: '#9A3412',
            },
          ],
          outbound: [
            {
              name: 'Jira · Linear MCP',
              description: 'Ticket write · draft only',
              color: '#0052CC',
            },
            {
              name: 'Confluence MCP',
              description: 'PRD draft · doc write',
              color: '#172B4D',
            },
            {
              name: 'Zephyr MCP',
              description: 'Test write · human gated',
              color: '#065F46',
            },
          ],
        },
      },
    },
    
    enterpriseTools: {
      tools: [
        {
          icon: '🔴',
          name: 'Honeybadger',
          description: 'Error monitoring · Stack traces · Alerts · Webhooks',
          mcp: 'Honeybadger MCP',
          color: '#B91C1C',
        },
        {
          icon: '🎨',
          name: 'Figma',
          description: 'Design files · Screens · User flows · Annotations',
          mcp: 'Figma MCP',
          color: '#7C3AED',
        },
        {
          icon: '🟦',
          name: 'Jira',
          description: 'Epics · Stories · Subtasks · Sprints · Backlog',
          mcp: 'Jira MCP',
          color: '#0052CC',
        },
        {
          icon: '🟪',
          name: 'Linear',
          description: 'Alt ticket management · Engineering teams',
          mcp: 'Linear MCP',
          color: '#5E6AD2',
        },
        {
          icon: '📘',
          name: 'Confluence',
          description: 'PRD drafts · Error reports · Knowledge base · Specs',
          mcp: 'Confluence MCP',
          color: '#172B4D',
        },
        {
          icon: '🧪',
          name: 'Zephyr',
          description: 'Test plans · Test cases · Automated execution',
          mcp: 'Zephyr MCP',
          color: '#065F46',
        },
      ],
    },
  },
};

/**
 * Generate Lucid diagram JSON from architecture data
 */
export function generateLucidDiagram(data = architectureData) {
  const objects = [];
  const connections = [];

  // Calculate positions
  const leftX = 50;
  const gatewayX = 350;
  const rightX = 1050;
  const topY = 100;
  const midY = 350;

  // Teams card (external)
  objects.push({
    id: 'teams-card',
    type: 'shape',
    shapeType: 'rectangle',
    x: leftX,
    y: topY,
    width: 140,
    height: 180,
    text: { content: 'Microsoft Teams\nHITL Interface\n\nProduct Manager\nQA Engineer\nDeveloper\nAnalytics Lead' },
    fill: '#5B21B6',
    fontColor: '#fff',
    strokeColor: '#000',
    strokeWidth: 1,
  });

  // AWS Cloud container
  objects.push({
    id: 'aws-cloud',
    type: 'shape',
    shapeType: 'rectangle',
    x: gatewayX,
    y: topY,
    width: 650,
    height: 580,
    text: { content: 'AWS Cloud\nMSAP — Minimal Shared Agent Platform' },
    fill: '#F6F9FF',
    strokeColor: '#3B82F6',
    strokeWidth: 2,
  });

  // Runtime Components (2x2 grid inside AWS)
  const components = [
    { ...data.sections.awsCloud.runtime, x: gatewayX + 20, y: topY + 40 },
    { ...data.sections.awsCloud.ingestion, x: gatewayX + 330, y: topY + 40 },
    { ...data.sections.awsCloud.schemas, x: gatewayX + 20, y: topY + 200 },
    { ...data.sections.awsCloud.hitl, x: gatewayX + 330, y: topY + 200 },
  ];

  components.forEach((comp) => {
    objects.push({
      id: comp.id,
      type: 'shape',
      shapeType: 'rectangle',
      x: comp.x,
      y: comp.y,
      width: 290,
      height: 140,
      text: { content: `${comp.name}\n${comp.features.slice(0, 3).join('\n')}` },
      fill: comp.color,
      fontColor: '#fff',
      fontSize: 9,
    });
  });

  // Gateway section (right inside AWS)
  objects.push({
    id: 'gateway-section',
    type: 'shape',
    shapeType: 'rectangle',
    x: gatewayX + 620,
    y: topY + 40,
    width: 20,
    height: 360,
    fill: '#1B4F8A',
    strokeColor: '#0E3366',
    strokeWidth: 2,
  });

  // Enterprise Tools (external, right side)
  const tools = data.sections.enterpriseTools.tools;
  tools.forEach((tool, idx) => {
    objects.push({
      id: `tool-${tool.name.toLowerCase()}`,
      type: 'shape',
      shapeType: 'rectangle',
      x: rightX,
      y: topY + idx * 95,
      width: 140,
      height: 85,
      text: { content: `${tool.icon} ${tool.name}\n${tool.description}` },
      fill: tool.color,
      fontColor: '#fff',
      fontSize: 9,
    });
  });

  // Connections
  connections.push(
    { id: 'conn1', type: 'connector', shape: 'straight', startShapeId: 'teams-card', endShapeId: 'aws-cloud', label: 'input' },
    { id: 'conn2', type: 'connector', shape: 'straight', startShapeId: 'aws-cloud', endShapeId: 'tool-jira', label: 'write' },
    { id: 'conn3', type: 'connector', shape: 'straight', startShapeId: 'aws-cloud', endShapeId: 'tool-confluence', label: 'write' }
  );

  return { objects, connections };
}

export default architectureData;
