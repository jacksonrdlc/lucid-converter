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
        icon: '\u25C6',
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
        icon: '\u25C8',
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
        icon: '\u25A3',
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
        icon: '\u25B6',
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
            icon: '\u25FC',
            name: 'Amazon S3',
            title: 'Rule Sets & Artifacts',
            description: 'Config-driven workflow definitions · Shared prompt templates',
            dots: ['Prompt templates', 'Cedar policies', 'Draft checkpoints'],
            color: '#9A3412',
          },
          {
            icon: '\u25C9',
            name: 'AgentCore Observability',
            title: 'Traceability & Ops',
            description: '"Git blame for requirements" — every artifact traced end-to-end',
            dots: ['Prompt version', 'Model version', 'Reviewer ID', 'CloudWatch'],
            color: '#1E3A5F',
          },
          {
            icon: '\u25AE',
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
          icon: '\u25CF',
          name: 'Honeybadger',
          description: 'Error monitoring · Stack traces · Alerts · Webhooks',
          mcp: 'Honeybadger MCP',
          color: '#B91C1C',
        },
        {
          icon: '\u25C6',
          name: 'Figma',
          description: 'Design files · Screens · User flows · Annotations',
          mcp: 'Figma MCP',
          color: '#7C3AED',
        },
        {
          icon: '\u25A0',
          name: 'Jira',
          description: 'Epics · Stories · Subtasks · Sprints · Backlog',
          mcp: 'Jira MCP',
          color: '#0052CC',
        },
        {
          icon: '\u25AA',
          name: 'Linear',
          description: 'Alt ticket management · Engineering teams',
          mcp: 'Linear MCP',
          color: '#5E6AD2',
        },
        {
          icon: '\u25A3',
          name: 'Confluence',
          description: 'PRD drafts · Error reports · Knowledge base · Specs',
          mcp: 'Confluence MCP',
          color: '#172B4D',
        },
        {
          icon: '\u25B3',
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
 * Default layout configuration — every hardcoded layout constant is exposed here.
 * Pass overrides to generateLucidDiagram() to adjust the layout programmatically.
 */
export const DEFAULT_LAYOUT_CONFIG = {
  // Column positions / widths
  TEAMS_X: 30,
  TEAMS_W: 170,
  AWS_X: 290,
  AWS_W: 1020,
  TOOLS_X: 1400,
  TOOLS_W: 210,
  TOP: 50,

  // AWS internal: runtime column width & gateway gap
  RT_W: 700,
  GW_GAP: 15,

  // MSAP card dimensions
  MSAP_H: 220,
  MSAP_GAP: 12,

  // Tool card dimensions
  TOOL_H: 115,
  TOOL_GAP: 10,

  // Text measurement tuning — calibrated for Lucid's text renderer,
  // which renders ~25-30% wider than browser foreignObject.
  CW: 0.78,    // avg char-width / font-px (conservative for Lucid)
  LH: 2.1,     // line-height / font-px (accounts for Lucid line spacing)
  FIT_MIN: 5,  // min font size for fitText binary search
  FIT_MAX: 14, // max font size for fitText binary search
};

/**
 * Generate Lucid diagram JSON from architecture data.
 * Layout matches the HTML: Teams | arrows | AWS Cloud (runtime + gateway) | arrows | Enterprise Tools
 * Text uses HTML styling: <p style="color:#fff;font-size:12pt;font-weight:bold">
 *
 * @param {object} data - Architecture data (defaults to built-in architectureData)
 * @param {object} layoutConfig - Partial overrides merged onto DEFAULT_LAYOUT_CONFIG
 */
export function generateLucidDiagram(data = architectureData, layoutConfig = {}) {
  const cfg = { ...DEFAULT_LAYOUT_CONFIG, ...layoutConfig };

  const shapes = [];
  const lines = [];

  // ── shared text-measurement constants ──
  const PT = 1.333;                    // pt → px
  const CW = cfg.CW;                  // avg char-width / font-px (conservative)
  const LH = cfg.LH;                  // line-height / font-px (generous spacing)
  const BF = 1.15;                     // bold width stretch (Lucid renders bold wider)
  const BI = 24;                       // bullet indent px (Lucid UL indent is wider)

  // Measure the pixel height of a single text item at a resolved pt size.
  // uw = usable width (box width minus padding)
  // pt = final point size (ratio already applied)
  function measureItem(uw, pt, it) {
    const fpx = pt * PT;
    const cw  = fpx * CW * (it.bold ? BF : 1);
    const lh  = fpx * LH;
    let t = 0;

    if (it.isList) {
      t += 0.4 * fpx; // UL top margin
      for (const b of it.text) {
        const cpl = Math.max(1, Math.floor((uw - BI) / cw));
        t += Math.ceil(b.length / cpl) * lh;
      }
      t += 0.4 * fpx; // UL bottom margin
    } else {
      for (const seg of String(it.text).split(/<br\s*\/?>/)) {
        const clean = seg.replace(/<[^>]+>/g, '').replace(/&\w+;/g, 'X');
        if (!clean) continue;
        const cpl = Math.max(1, Math.floor(uw / cw));
        t += Math.ceil(clean.length / cpl) * lh;
      }
    }
    return t;
  }

  // ── auto-sizing: find max font sizes that fit a box ──
  // items: [{ text: string|string[], ratio: number, bold?: bool, isList?: bool }]
  //   ratio = relative size (1.0 = title, 0.7 = body, …)
  //   isList = text is string[] of bullet items (indented)
  // Returns one pt size per item.
  function fitText(w, h, items) {
    // Adaptive padding: 12% of smallest dim, capped at 18px per side
    const pad = Math.min(18, Math.min(w, h) * 0.12);
    const uw = w - 2 * pad;
    const uh = h - 2 * pad;

    const measure = (base) => {
      let t = 0;
      let first = true;
      for (const it of items) {
        const pt = base * it.ratio;
        if (!first) t += 0.5 * (pt * PT);
        first = false;
        t += measureItem(uw, pt, it);
      }
      return t;
    };

    let lo = cfg.FIT_MIN, hi = cfg.FIT_MAX;
    for (let i = 0; i < 20; i++) {
      const m = (lo + hi) / 2;
      measure(m) <= uh ? (lo = m) : (hi = m);
    }
    return items.map(it => Math.max(6, Math.floor(lo * it.ratio)));
  }

  // For card groups: min per slot across all variants → consistent sizes
  function fitGroup(w, h, variants) {
    const all = variants.map(v => fitText(w, h, v));
    return all[0].map((_, i) => Math.min(...all.map(a => a[i])));
  }

  // Stack text layers on top of a background rect.
  // elements: [{ html, pt, item: {text, ratio, bold?, isList?} }]
  // Returns array of txt() shapes with IDs {baseId}-txt-0, …
  // Text shapes are clamped to never extend beyond the parent card bounds.
  function stackTexts(baseId, cx, cy, cw, ch, elements) {
    const pad = Math.min(18, Math.min(cw, ch) * 0.12);
    const uw = cw - 2 * pad;
    const maxY = cy + ch - pad;
    const result = [];
    let y = cy + pad;

    elements.forEach((el, idx) => {
      const fpx = el.pt * PT;
      // Inter-block gap
      if (idx > 0) y += 0.5 * fpx;
      if (y >= maxY) return; // past the card bottom, skip remaining
      const h = measureItem(uw, el.pt, el.item);
      const clampedH = Math.min(h, maxY - y);
      result.push(txt(`${baseId}-txt-${idx}`, cx + pad, y, uw, clampedH, el.html));
      y += h;
    });
    return result;
  }

  // ── text helpers ──
  // White text on dark backgrounds (most cards)
  const white = (size, weight, text, align = 'left') =>
    `<p style="color:#ffffff;font-size:${size}pt;font-weight:${weight};text-align:${align}">${text}</p>`;
  const wBold = (size, text, align) => white(size, 'bold', text, align);
  const wNorm = (size, text, align) => white(size, 'normal', text, align);
  // Dark text on light backgrounds (labels, MCP box)
  const dark = (color, size, weight, text) =>
    `<p style="color:${color};font-size:${size}pt;font-weight:${weight};text-align:left">${text}</p>`;
  // Bullet list in white (parameterized size)
  const wBullets = (items, size) =>
    `<ul>${items.map(i => `<li><p style="color:#ffffffDD;font-size:${size}pt">${i}</p></li>`).join('')}</ul>`;
  // Chip row in white (parameterized size)
  const wChips = (items, size) =>
    wNorm(size, items.join('  |  '));

  // ── shape helpers ──
  function rect(id, x, y, w, h, text, fill, strokeColor = '#00000000', strokeWidth = 1, strokeStyle = 'solid') {
    const s = { id, type: 'rectangle', boundingBox: { x, y, w, h },
      style: { fill: { type: 'color', color: fill }, stroke: { color: strokeColor, width: strokeWidth, style: strokeStyle },
        rounding: 7 } };
    s.text = text || '';
    return s;
  }
  function ctr(id, x, y, w, h, note, fill, strokeColor, strokeWidth = 2, strokeStyle = 'solid') {
    const s = { id, type: 'rectangleContainer', boundingBox: { x, y, w, h },
      style: { fill: { type: 'color', color: fill }, stroke: { color: strokeColor, width: strokeWidth, style: strokeStyle },
        rounding: 10 } };
    if (note) s.note = note;
    return s;
  }
  function txt(id, x, y, w, h, text) {
    return { id, type: 'text', boundingBox: { x, y, w, h }, text };
  }
  function ln(id, fromId, toId, label, color = '#333333', fromPos, toPos) {
    const e1 = { type: 'shapeEndpoint', style: 'none', shapeId: fromId };
    const e2 = { type: 'shapeEndpoint', style: 'arrow', shapeId: toId };
    if (fromPos && toPos) { e1.position = fromPos; e2.position = toPos; }
    const l = { id, lineType: 'elbow', endpoint1: e1, endpoint2: e2,
      stroke: { color, width: 2, style: 'solid' } };
    if (label) l.text = [{ text: label, position: 0.5, side: 'top' }];
    return l;
  }

  // ── layout constants (from config) ──
  const TEAMS_X = cfg.TEAMS_X;  const TEAMS_W = cfg.TEAMS_W;
  const AWS_X = cfg.AWS_X;      const AWS_W = cfg.AWS_W;
  const TOOLS_X = cfg.TOOLS_X;  const TOOLS_W = cfg.TOOLS_W;
  const TOP = cfg.TOP;

  // Inside AWS: runtime column vs gateway column (derived)
  const RT_X = AWS_X + 20;
  const RT_W = cfg.RT_W;
  const GW_X = RT_X + RT_W + cfg.GW_GAP;
  const GW_W = AWS_W - RT_W - 55;

  // MSAP grid (derived from config)
  const MSAP_W = (RT_W - 30) / 2;
  const MSAP_H = cfg.MSAP_H;
  const MSAP_GAP = cfg.MSAP_GAP;
  const MSAP_X = RT_X + 15;
  const MSAP_Y = TOP + 105;

  // ── pre-compute Y positions for dynamic container sizing ──
  const MSAP_GRID_BOTTOM = MSAP_Y + 2 * MSAP_H + MSAP_GAP;

  // Runtime box encompasses MSAP 2×2 grid
  const RUNTIME_BOX_Y = TOP + 55;
  const RUNTIME_BOX_H = MSAP_GRID_BOTTOM - RUNTIME_BOX_Y + 18;

  // Bedrock + rail sit below runtime box, still inside AWS cloud
  const BEDROCK_Y = MSAP_GRID_BOTTOM + 14;
  const RAIL_Y = BEDROCK_Y + 85 + 10;
  const RAIL_BOTTOM = RAIL_Y + 28 + 210;

  // Gateway column
  const GW_Y = TOP + 55;
  const MCP_Y = GW_Y + 320;
  const MCP_BOX_H = 390;
  const MCP_BOTTOM = MCP_Y + MCP_BOX_H;

  // AWS cloud: must encompass the taller of the two columns
  const AWS_CONTENT_BOTTOM = Math.max(RAIL_BOTTOM, MCP_BOTTOM);
  const AWS_CLOUD_H = AWS_CONTENT_BOTTOM - TOP + 30;

  // Legend follows below AWS cloud
  const LEG_Y = TOP + AWS_CLOUD_H + 20;

  // ══════════════════════════════════════════════
  // 1. CONTAINERS (back layer — sized to fit children)
  // ══════════════════════════════════════════════

  shapes.push(ctr('aws-cloud', AWS_X, TOP, AWS_W, AWS_CLOUD_H,
    '<p style="color:#3B82F6;font-size:9pt;font-weight:bold">AWS Cloud</p><p style="color:#5B21B6;font-size:8pt;font-weight:bold">MSAP - Minimal Shared Agent Platform</p>',
    '#F6F9FF', '#3B82F6', 2));

  shapes.push(ctr('runtime-box', RT_X, RUNTIME_BOX_Y, RT_W, RUNTIME_BOX_H,
    '<p style="color:#C2410C;font-size:9pt;font-weight:bold">AGENTCORE RUNTIME</p><p style="color:#9A3412;font-size:7pt">Any Framework: CrewAI - LangGraph - LlamaIndex - Strands</p>',
    '#FFFAF5', '#F97316', 2, 'dashed'));

  // ══════════════════════════════════════════════
  // 2. COLUMN HEADERS
  // ══════════════════════════════════════════════

  shapes.push(txt('hdr-ext-left', TEAMS_X, TOP, TEAMS_W, 22,
    '<p style="color:#9CA3AF;font-size:8pt;font-weight:bold;text-align:center">EXTERNAL</p>'));
  shapes.push(txt('hdr-runtime', RT_X, TOP + 30, RT_W, 22,
    '<p style="color:#9CA3AF;font-size:8pt;font-weight:bold">AgentCore Runtime &amp; MSAP Components</p>'));
  shapes.push(txt('hdr-gateway', GW_X, TOP + 30, GW_W, 22,
    '<p style="color:#9CA3AF;font-size:8pt;font-weight:bold">AgentCore Gateway</p>'));
  shapes.push(txt('hdr-ext-right', TOOLS_X, TOP, TOOLS_W, 22,
    '<p style="color:#9CA3AF;font-size:8pt;font-weight:bold;text-align:center">ENTERPRISE TOOLS</p>'));

  // ══════════════════════════════════════════════
  // 3. MSAP 2x2 GRID
  // ══════════════════════════════════════════════

  const msapCards = [
    { id: 'msap-runtime', icon: '\u25C6', label: 'ORCHESTRATION', title: 'Runtime &amp; Orchestration',
      bullets: ['Deterministic step execution', 'State: Draft &gt; Review &gt; Approved', 'Pause / resume at HITL gates',
        'Idempotent safe retries', '8-hour execution windows', 'A2A protocol support'],
      color: '#1E3A5F', border: '#0F2040', col: 0, row: 0 },
    { id: 'msap-ingestion', icon: '\u25C8', label: 'CONTEXT LAYER', title: 'Unified Context Ingestion',
      bullets: ['Read-only in Phase 1', 'Source-tagged on every object', 'Figma screens &gt; captioned text',
        'Jira structured records', 'Confluence docs + PRDs', 'HB error payloads + stack traces'],
      color: '#1B4F8A', border: '#0E3366', col: 1, row: 0 },
    { id: 'msap-schemas', icon: '\u25A3', label: 'CANONICAL SCHEMAS', title: 'Artifact Schemas',
      bullets: ['Prevents semantic drift', 'Confidence + source metadata',
        'Traceability IDs on all artifacts', 'Required + optional field defs'],
      chips: ['Requirement', 'Story', 'Test Case', 'Incident'],
      color: '#374151', border: '#1F2937', col: 0, row: 1 },
    { id: 'msap-hitl', icon: '\u25B6', label: 'HUMAN REVIEW', title: 'HITL Review Interface',
      bullets: ['Source / output side-by-side', 'Approve / Edit / Reject',
        'Mandatory reason on rejection', 'One interface across all agents', 'Feedback loops back to agent'],
      color: '#1D4ED8', border: '#1E40AF', col: 1, row: 1 },
  ];

  const msapLayouts = msapCards.map(c => [
    { text: `${c.icon}  ${c.label}`, ratio: 0.70 },
    { text: c.title, ratio: 1.0, bold: true },
    { text: c.bullets, ratio: 0.80, isList: true },
    { text: c.chips ? '[ ' + c.chips.join(' | ') + ' ]' : '', ratio: 0.70 },
  ]);
  const [msapLabelPt, msapTitlePt, msapBulletPt, msapChipPt] = fitGroup(MSAP_W, MSAP_H, msapLayouts);

  msapCards.forEach(c => {
    const cx = MSAP_X + c.col * (MSAP_W + MSAP_GAP);
    const cy = MSAP_Y + c.row * (MSAP_H + MSAP_GAP);
    shapes.push(rect(c.id, cx, cy, MSAP_W, MSAP_H, null, c.color, c.border, 1));
    const chipText = c.chips ? '[ ' + c.chips.join(' | ') + ' ]' : '';
    const labelWithIcon = `${c.icon}  ${c.label}`;
    const elements = [
      { html: wNorm(msapLabelPt, labelWithIcon), pt: msapLabelPt, item: { text: labelWithIcon, ratio: 0.70 } },
      { html: wBold(msapTitlePt, c.title), pt: msapTitlePt, item: { text: c.title, ratio: 1.0, bold: true } },
      { html: wBullets(c.bullets, msapBulletPt), pt: msapBulletPt, item: { text: c.bullets, ratio: 0.80, isList: true } },
    ];
    if (chipText) elements.push({ html: wNorm(msapChipPt, chipText), pt: msapChipPt, item: { text: chipText, ratio: 0.70 } });
    shapes.push(...stackTexts(c.id, cx, cy, MSAP_W, MSAP_H, elements));
  });

  // ══════════════════════════════════════════════
  // 4. BEDROCK ROW
  // ══════════════════════════════════════════════

  const bedrockItems = [
    { id: 'bedrock-model', title: 'Amazon Bedrock', sub: 'Foundation models \u00b7 Inference \u00b7 Embeddings \u00b7 Model routing', color: '#065F46', border: '#022C22' },
    { id: 'bedrock-identity', title: 'AgentCore Identity', sub: 'Cognito \u00b7 IAM \u00b7 OAuth 2.0 \u00b7 Multi-tenant token vault', color: '#1E3A5F', border: '#0F2040' },
  ];
  const brLayouts = bedrockItems.map(b => [
    { text: b.title, ratio: 1.0, bold: true },
    { text: b.sub, ratio: 0.75 },
  ]);
  const [brTitlePt, brSubPt] = fitGroup(MSAP_W, 85, brLayouts);

  bedrockItems.forEach((b, i) => {
    const bx = MSAP_X + i * (MSAP_W + MSAP_GAP);
    shapes.push(rect(b.id, bx, BEDROCK_Y, MSAP_W, 85, null, b.color, b.border, 1));
    shapes.push(...stackTexts(b.id, bx, BEDROCK_Y, MSAP_W, 85, [
      { html: wBold(brTitlePt, b.title), pt: brTitlePt, item: { text: b.title, ratio: 1.0, bold: true } },
      { html: wNorm(brSubPt, b.sub), pt: brSubPt, item: { text: b.sub, ratio: 0.75 } },
    ]));
  });

  // ══════════════════════════════════════════════
  // 5. SHARED PLATFORM INFRASTRUCTURE (bottom rail)
  // ══════════════════════════════════════════════

  const RAIL_CARD_W = (RT_W - 40) / 3;

  shapes.push(txt('rail-label', RT_X, RAIL_Y, RT_W, 22,
    '<p style="color:#C2410C;font-size:8pt;font-weight:bold">Shared Platform Infrastructure</p>'));

  const railCards = [
    { id: 'rail-s3', name: 'Amazon S3', title: 'Rule Sets &amp; Artifacts',
      desc: 'Config-driven workflow definitions \u00b7 Shared prompt templates',
      dots: ['Prompt templates', 'Cedar policies', 'Draft checkpoints'], color: '#9A3412', border: '#7C2D12' },
    { id: 'rail-observ', name: 'AgentCore Observability', title: 'Traceability &amp; Ops',
      desc: 'Every artifact traced end-to-end',
      dots: ['Prompt version', 'Model version', 'Reviewer ID', 'CloudWatch'], color: '#1E3A5F', border: '#0F2040' },
    { id: 'rail-policy', name: 'Policy + Evaluations', title: 'Governance',
      desc: 'Agents may draft, not decide \u00b7 Policy-driven not prompt-driven',
      dots: ['Cedar rules', 'No autonomous writes', '13 evaluators', 'Kill switch'], color: '#92400E', border: '#78350F' },
  ];
  const railLayouts = railCards.map(c => [
    { text: c.name, ratio: 0.70 },
    { text: c.title, ratio: 1.0, bold: true },
    { text: c.desc, ratio: 0.80 },
    { text: c.dots.join('  |  '), ratio: 0.70 },
  ]);
  const [railNamePt, railTitlePt, railDescPt, railChipPt] = fitGroup(RAIL_CARD_W, 210, railLayouts);

  railCards.forEach((c, i) => {
    const rx = RT_X + 10 + i * (RAIL_CARD_W + 12);
    const ry = RAIL_Y + 28;
    const dotsText = c.dots.join('  |  ');
    shapes.push(rect(c.id, rx, ry, RAIL_CARD_W, 210, null, c.color, c.border, 2));
    shapes.push(...stackTexts(c.id, rx, ry, RAIL_CARD_W, 210, [
      { html: wNorm(railNamePt, c.name), pt: railNamePt, item: { text: c.name, ratio: 0.70 } },
      { html: wBold(railTitlePt, c.title), pt: railTitlePt, item: { text: c.title, ratio: 1.0, bold: true } },
      { html: wNorm(railDescPt, c.desc), pt: railDescPt, item: { text: c.desc, ratio: 0.80 } },
      { html: wChips(c.dots, railChipPt), pt: railChipPt, item: { text: dotsText, ratio: 0.70 } },
    ]));
  });

  // ══════════════════════════════════════════════
  // 6. GATEWAY STRIP (right column inside AWS)
  // ══════════════════════════════════════════════

  // Gateway box
  const [gwTitlePt, gwDescPt, gwChipPt] = fitText(GW_W, 155, [
    { text: 'Gateway', ratio: 1.0, bold: true },
    { text: 'Unified MCP hub<br>Single secure endpoint<br>IAM + OAuth 2.0', ratio: 0.80 },
    { text: 'Tool routing  |  Browser  |  Code Interp', ratio: 0.70 },
  ]);
  const gwDescText = 'Unified MCP hub<br>Single secure endpoint<br>IAM + OAuth 2.0';
  const gwChipText = 'Tool routing  |  Browser  |  Code Interp';
  shapes.push(rect('gw-gateway', GW_X, GW_Y, GW_W, 155, null,
    '#1B4F8A', '#0E3366', 2));
  shapes.push(...stackTexts('gw-gateway', GW_X, GW_Y, GW_W, 155, [
    { html: wBold(gwTitlePt, 'Gateway'), pt: gwTitlePt, item: { text: 'Gateway', ratio: 1.0, bold: true } },
    { html: wNorm(gwDescPt, gwDescText), pt: gwDescPt, item: { text: gwDescText, ratio: 0.80 } },
    { html: wChips(['Tool routing', 'Browser', 'Code Interp'], gwChipPt), pt: gwChipPt, item: { text: gwChipText, ratio: 0.70 } },
  ]));

  // Memory box
  const [memTitlePt, memDescPt, memChipPt] = fitText(GW_W, 145, [
    { text: 'Memory', ratio: 1.0, bold: true },
    { text: 'Solves agent statelessness across sessions', ratio: 0.80 },
    { text: 'Short-term  |  Long-term  |  Episodic  |  365d \u00b7 KMS', ratio: 0.70 },
  ]);
  const memChipText = 'Short-term  |  Long-term  |  Episodic  |  365d \u00b7 KMS';
  shapes.push(rect('gw-memory', GW_X, GW_Y + 165, GW_W, 145, null,
    '#5B21B6', '#3B0764', 2));
  shapes.push(...stackTexts('gw-memory', GW_X, GW_Y + 165, GW_W, 145, [
    { html: wBold(memTitlePt, 'Memory'), pt: memTitlePt, item: { text: 'Memory', ratio: 1.0, bold: true } },
    { html: wNorm(memDescPt, 'Solves agent statelessness across sessions'), pt: memDescPt, item: { text: 'Solves agent statelessness across sessions', ratio: 0.80 } },
    { html: wChips(['Short-term', 'Long-term', 'Episodic', '365d \u00b7 KMS'], memChipPt), pt: memChipPt, item: { text: memChipText, ratio: 0.70 } },
  ]));

  // MCP Connectors box (dashed orange border, light bg)
  shapes.push(rect('mcp-box', GW_X, MCP_Y, GW_W, MCP_BOX_H, null,
    '#FFF5ED', '#F97316', 2, 'dashed'));

  // MCP header and section labels
  shapes.push(txt('mcp-header', GW_X + 5, MCP_Y + 5, GW_W - 10, 22,
    '<p style="color:#C2410C;font-size:9pt;font-weight:bold;text-align:left">MCP CONNECTORS</p>'));
  shapes.push(txt('mcp-inbound', GW_X + 5, MCP_Y + 30, GW_W - 10, 18,
    '<p style="color:#94A3B8;font-size:8pt;font-weight:bold;text-align:left">INBOUND</p>'));
  shapes.push(txt('mcp-outbound', GW_X + 5, MCP_Y + 120, GW_W - 10, 18,
    '<p style="color:#94A3B8;font-size:8pt;font-weight:bold;text-align:left">OUTBOUND</p>'));

  // MCP colored sub-rectangles
  const MCP_SUB_X = GW_X + 5;
  const MCP_SUB_W = GW_W - 10;
  const mcpSubs = [
    { id: 'mcp-adobe', name: 'Adobe Analytics', desc: 'Event schema \u00b7 CData MCP', color: '#9A3412', y: MCP_Y + 52 },
    { id: 'mcp-jira', name: 'Jira \u00b7 Linear MCP', desc: 'Ticket write \u00b7 draft only', color: '#0052CC', y: MCP_Y + 142 },
    { id: 'mcp-confluence', name: 'Confluence MCP', desc: 'PRD draft \u00b7 doc write', color: '#172B4D', y: MCP_Y + 210 },
    { id: 'mcp-zephyr', name: 'Zephyr MCP', desc: 'Test write \u00b7 human gated', color: '#065F46', y: MCP_Y + 278 },
  ];
  const mcpSubLayouts = mcpSubs.map(s => [
    { text: s.name, ratio: 1.0, bold: true },
    { text: s.desc, ratio: 0.80 },
  ]);
  const [mcpNamePt, mcpDescPt] = fitGroup(MCP_SUB_W, 58, mcpSubLayouts);

  mcpSubs.forEach(s => {
    shapes.push(rect(s.id, MCP_SUB_X, s.y, MCP_SUB_W, 58, null, s.color, '#00000000', 1));
    shapes.push(...stackTexts(s.id, MCP_SUB_X, s.y, MCP_SUB_W, 58, [
      { html: wBold(mcpNamePt, s.name), pt: mcpNamePt, item: { text: s.name, ratio: 1.0, bold: true } },
      { html: wNorm(mcpDescPt, s.desc), pt: mcpDescPt, item: { text: s.desc, ratio: 0.80 } },
    ]));
  });

  // ══════════════════════════════════════════════
  // 7. TEAMS CARD (external left)
  // ══════════════════════════════════════════════

  const teamsRolesText = 'HITL Interface<br>Product Manager<br>QA Engineer<br>Developer<br>Analytics Lead';
  const [teamsTitlePt, teamsBodyPt] = fitText(TEAMS_W, 270, [
    { text: 'Microsoft Teams', ratio: 1.0, bold: true },
    { text: teamsRolesText, ratio: 0.50 },
  ]);
  shapes.push(rect('teams-card', TEAMS_X, TOP + 25, TEAMS_W, 270, null,
    '#5B21B6', '#3B0764', 2));
  const teamsRolesHtml =
    wNorm(teamsBodyPt, 'HITL Interface', 'center') +
    '<br>' +
    wNorm(teamsBodyPt, 'Product Manager', 'center') +
    wNorm(teamsBodyPt, 'QA Engineer', 'center') +
    wNorm(teamsBodyPt, 'Developer', 'center') +
    wNorm(teamsBodyPt, 'Analytics Lead', 'center');
  shapes.push(...stackTexts('teams-card', TEAMS_X, TOP + 25, TEAMS_W, 270, [
    { html: wBold(teamsTitlePt, 'Microsoft Teams', 'center'), pt: teamsTitlePt, item: { text: 'Microsoft Teams', ratio: 1.0, bold: true } },
    { html: teamsRolesHtml, pt: teamsBodyPt, item: { text: teamsRolesText, ratio: 0.50 } },
  ]));

  // ══════════════════════════════════════════════
  // 8. ENTERPRISE TOOL CARDS (external right)
  // ══════════════════════════════════════════════

  const toolDefs = [
    { id: 'tool-hb', icon: '\u25CF', name: 'Honeybadger', desc: 'Error monitoring \u00b7 Stack traces \u00b7 Alerts \u00b7 Webhooks', mcp: '[ via Honeybadger MCP ]', color: '#B91C1C', border: '#7F1D1D' },
    { id: 'tool-figma', icon: '\u25C6', name: 'Figma', desc: 'Design files \u00b7 Screens \u00b7 User flows \u00b7 Annotations', mcp: '[ via Figma MCP ]', color: '#7C3AED', border: '#4C1D95' },
    { id: 'tool-jira', icon: '\u25A0', name: 'Jira', desc: 'Epics \u00b7 Stories \u00b7 Subtasks \u00b7 Sprints \u00b7 Backlog', mcp: '[ via Jira MCP ]', color: '#0052CC', border: '#003899' },
    { id: 'tool-linear', icon: '\u25AA', name: 'Linear', desc: 'Alt ticket management \u00b7 Engineering teams', mcp: '[ via Linear MCP ]', color: '#5E6AD2', border: '#4A55B0' },
    { id: 'tool-confluence', icon: '\u25A3', name: 'Confluence', desc: 'PRD drafts \u00b7 Error reports \u00b7 Knowledge base \u00b7 Specs', mcp: '[ via Confluence MCP ]', color: '#172B4D', border: '#0B1F3A' },
    { id: 'tool-zephyr', icon: '\u25B3', name: 'Zephyr', desc: 'Test plans \u00b7 Test cases \u00b7 Automated execution', mcp: '[ via Zephyr MCP ]', color: '#065F46', border: '#022C22' },
  ];
  const TOOL_H = cfg.TOOL_H;
  const TOOL_GAP = cfg.TOOL_GAP;
  const toolLayouts = toolDefs.map(t => [
    { text: `${t.icon} ${t.name}`, ratio: 1.0, bold: true },
    { text: t.desc, ratio: 0.80 },
    { text: t.mcp, ratio: 0.70 },
  ]);
  const [toolNamePt, toolDescPt, toolMcpPt] = fitGroup(TOOLS_W, TOOL_H, toolLayouts);

  toolDefs.forEach((t, i) => {
    const ty = TOP + 25 + i * (TOOL_H + TOOL_GAP);
    shapes.push(rect(t.id, TOOLS_X, ty, TOOLS_W, TOOL_H, null, t.color, t.border, 2));
    const toolTitle = `${t.icon} ${t.name}`;
    shapes.push(...stackTexts(t.id, TOOLS_X, ty, TOOLS_W, TOOL_H, [
      { html: wBold(toolNamePt, toolTitle), pt: toolNamePt, item: { text: toolTitle, ratio: 1.0, bold: true } },
      { html: wNorm(toolDescPt, t.desc), pt: toolDescPt, item: { text: t.desc, ratio: 0.80 } },
      { html: wNorm(toolMcpPt, t.mcp), pt: toolMcpPt, item: { text: t.mcp, ratio: 0.70 } },
    ]));
  });

  // ══════════════════════════════════════════════
  // 9. LEGEND ROW
  // ══════════════════════════════════════════════

  const legendItems = [
    { color: '#5B21B6', label: 'External HITL (Teams)' },
    { color: '#1E3A5F', label: 'Runtime &amp; Orchestration' },
    { color: '#1B4F8A', label: 'Context Ingestion' },
    { color: '#374151', label: 'Canonical Schemas' },
    { color: '#1D4ED8', label: 'HITL Review' },
    { color: '#5B21B6', label: 'Memory' },
    { color: '#1B4F8A', label: 'Gateway + MCP' },
    { color: '#92400E', label: 'Policy + Evaluations' },
    { color: '#0052CC', label: 'Enterprise Tools' },
  ];
  const LEG_CHIP_W = 165;
  const LEG_CHIP_H = 34;
  const legLayouts = legendItems.map(item => [
    { text: item.label, ratio: 1.0, bold: true },
  ]);
  const [legPt] = fitGroup(LEG_CHIP_W, LEG_CHIP_H, legLayouts);

  legendItems.forEach((item, i) => {
    const lx = TEAMS_X + i * (LEG_CHIP_W + 8);
    shapes.push(rect(`leg-${i}`, lx, LEG_Y, LEG_CHIP_W, LEG_CHIP_H, null, item.color));
    shapes.push(...stackTexts(`leg-${i}`, lx, LEG_Y, LEG_CHIP_W, LEG_CHIP_H, [
      { html: `<p style="color:#ffffff;font-size:${legPt}pt;font-weight:bold;text-align:center">${item.label}</p>`, pt: legPt, item: { text: item.label, ratio: 1.0, bold: true } },
    ]));
  });

  // ══════════════════════════════════════════════
  // 10. CONNECTIONS
  // ══════════════════════════════════════════════

  // Teams <-> AWS  (bidirectional)
  lines.push(ln('line-teams-input', 'teams-card', 'aws-cloud', 'input', '#7C3AED',
    { x: 1, y: 0.4 }, { x: 0, y: 0.4 }));
  lines.push(ln('line-aws-response', 'aws-cloud', 'teams-card', 'response', '#94A3B8',
    { x: 0, y: 0.6 }, { x: 1, y: 0.6 }));

  // Gateway -> Enterprise Tools  (write)
  lines.push(ln('line-gw-jira', 'gw-gateway', 'tool-jira', 'write', '#2563EB',
    { x: 1, y: 0.5 }, { x: 0, y: 0.5 }));
  lines.push(ln('line-gw-conf', 'gw-gateway', 'tool-confluence', 'write', '#2563EB',
    { x: 1, y: 0.7 }, { x: 0, y: 0.5 }));
  lines.push(ln('line-gw-zephyr', 'mcp-box', 'tool-zephyr', 'write', '#2563EB',
    { x: 1, y: 0.85 }, { x: 0, y: 0.5 }));

  // Enterprise Tools -> MCP box  (read)
  lines.push(ln('line-hb-mcp', 'tool-hb', 'mcp-box', 'read', '#94A3B8',
    { x: 0, y: 0.5 }, { x: 1, y: 0.12 }));
  lines.push(ln('line-figma-mcp', 'tool-figma', 'mcp-box', 'read', '#94A3B8',
    { x: 0, y: 0.5 }, { x: 1, y: 0.22 }));

  return { shapes, lines };
}

export default architectureData;
