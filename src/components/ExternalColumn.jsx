import './ExternalColumn.css';
import TeamsCard from './TeamsCard';
import EnterpriseToolCard from './EnterpriseToolCard';

function ExternalColumn({ side = 'left' }) {
  if (side === 'left') {
    return (
      <div className="external-col">
        <div className="ext-label">External</div>
        <TeamsCard />
      </div>
    );
  }

  // Right side - Enterprise Tools
  const tools = [
    { icon: '🔴', name: 'Honeybadger', description: 'Error monitoring · Stack traces · Alerts · Webhooks', mcp: 'Honeybadger MCP', class: 'et-hb' },
    { icon: '🎨', name: 'Figma', description: 'Design files · Screens · User flows · Annotations', mcp: 'Figma MCP', class: 'et-figma' },
    { icon: '🟦', name: 'Jira', description: 'Epics · Stories · Subtasks · Sprints · Backlog', mcp: 'Jira MCP', class: 'et-jira' },
    { icon: '🟪', name: 'Linear', description: 'Alt ticket management · Engineering teams', mcp: 'Linear MCP', class: 'et-linear' },
    { icon: '📘', name: 'Confluence', description: 'PRD drafts · Error reports · Knowledge base · Specs', mcp: 'Confluence MCP', class: 'et-conf' },
    { icon: '🧪', name: 'Zephyr', description: 'Test plans · Test cases · Automated execution', mcp: 'Zephyr MCP', class: 'et-zephyr' },
  ];

  return (
    <div className="external-col">
      <div className="ext-label">Enterprise Tools</div>
      {tools.map((tool, idx) => (
        <EnterpriseToolCard
          key={idx}
          icon={tool.icon}
          name={tool.name}
          description={tool.description}
          mcpLabel={tool.mcp}
          className={tool.class}
        />
      ))}
    </div>
  );
}

export default ExternalColumn;
