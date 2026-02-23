import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SYSTEM_PROMPT = `You are a diagram layout optimizer. You will receive the current layout configuration for an architecture diagram and an AI evaluation of the rendered result. Your job is to suggest numeric adjustments to FIX DEFECTS — not to make things bigger or more spread out.

PHILOSOPHY:
The diagram is an information-dense architecture diagram. Compact, small text is FINE. The goal is to eliminate visual defects (text spilling outside boxes, shapes overlapping peers, children escaping parent containers) while preserving the compact, information-rich layout. Do NOT increase sizes unless text is being clipped or truncated. If things look tight but nothing is spilling or overlapping, the layout is GOOD — leave it alone.

LAYOUT PARAMETERS AND THEIR MEANINGS:
- TEAMS_X (number, >= 10): X position of the left "Teams" column.
- TEAMS_W (number, 120-250): Width of the Teams card column.
- AWS_X (number, >= TEAMS_X + TEAMS_W + 50): X position of the central AWS cloud container.
- AWS_W (number, 800-1200): Width of the AWS cloud container. Contains runtime + gateway columns.
- TOOLS_X (number, >= AWS_X + AWS_W + 50): X position of the right Enterprise Tools column.
- TOOLS_W (number, 150-300): Width of the Enterprise Tools card column.
- TOP (number, 30-100): Y position of the top of the diagram.
- RT_W (number, 500-900): Width of the Runtime column inside AWS. Gateway width = AWS_W - RT_W - 55.
- GW_GAP (number, 5-30): Horizontal gap between Runtime and Gateway columns inside AWS.
- MSAP_H (number, 150-300): Height of each MSAP card in the 2x2 grid.
- MSAP_GAP (number, 5-25): Gap between MSAP cards.
- TOOL_H (number, 80-160): Height of each Enterprise Tool card.
- TOOL_GAP (number, 5-20): Vertical gap between tool cards.
- CW (number, 0.45-0.75): Character width ratio for text measurement. Lower = narrower chars assumed = more text per line.
- LH (number, 1.3-2.2): Line height ratio. Lower = tighter lines.
- FIT_MIN (number, 4-7): Minimum font size in auto-fit (pt).
- FIT_MAX (number, 12-22): Maximum font size in auto-fit (pt).

DYNAMIC CONTAINER SIZING:
Parent containers (AWS Cloud, Runtime box) automatically resize to fit children. You do NOT need to manage container sizes.

STRATEGY FOR COMMON DEFECTS:
- Text spilling outside a card → INCREASE the card dimension (MSAP_H, TOOL_H) OR DECREASE CW/LH to make text measurement tighter so auto-fit picks a smaller font.
- Shapes overlapping peers → INCREASE the gap (MSAP_GAP, TOOL_GAP, GW_GAP) by a small amount.
- Children escaping parent → This auto-fixes via dynamic sizing. If still happening, check column widths.
- Everything looks clean → Return an EMPTY adjustments object. Do not change things that aren't broken.

CONSTRAINTS:
- Total width: TOOLS_X + TOOLS_W < 1800.
- No column overlap: AWS_X > TEAMS_X + TEAMS_W + 30; TOOLS_X > AWS_X + AWS_W + 30.
- Gateway width (AWS_W - RT_W - 55) >= 120.
- All widths/heights must be positive.

Return ONLY valid JSON (no markdown, no code fences):
{
  "adjustments": {
    "<PARAM_NAME>": <new_value>,
    ...
  },
  "reasoning": "<1-3 sentences explaining what defect you are fixing>"
}

Only include parameters you are changing. If all scores are >= 7 and no defects are reported, return empty adjustments: {"adjustments": {}, "reasoning": "No defects to fix."}. Make small, targeted changes (5-10%) to fix one defect at a time.`;

export async function adjustLayoutRoute(req, res) {
  const { currentConfig, evaluation, iteration } = req.body;

  if (!currentConfig || !evaluation) {
    return res.status(400).json({ error: 'Missing "currentConfig" or "evaluation" fields' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Iteration ${iteration || 1} of defect-fixing.

CURRENT LAYOUT CONFIG:
${JSON.stringify(currentConfig, null, 2)}

EVALUATION RESULTS (scores 1-10, higher = fewer defects):
${JSON.stringify(evaluation, null, 2)}

Fix the lowest-scoring category first. If a category reports no issues, do not adjust parameters related to it. If all scores are >= 7, return empty adjustments.`,
        },
      ],
    });

    let text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: 'Failed to parse Claude response as JSON', raw: text });
    }

    const adjustments = parsed.adjustments || {};
    const reasoning = parsed.reasoning || '';

    // Merge adjustments into current config
    const adjustedConfig = { ...currentConfig, ...adjustments };

    // Validate constraints
    if (adjustedConfig.TOOLS_X + adjustedConfig.TOOLS_W > 1800) {
      adjustedConfig.TOOLS_X = 1800 - adjustedConfig.TOOLS_W;
    }
    if (adjustedConfig.AWS_X <= adjustedConfig.TEAMS_X + adjustedConfig.TEAMS_W + 30) {
      adjustedConfig.AWS_X = adjustedConfig.TEAMS_X + adjustedConfig.TEAMS_W + 50;
    }
    if (adjustedConfig.TOOLS_X <= adjustedConfig.AWS_X + adjustedConfig.AWS_W + 30) {
      adjustedConfig.TOOLS_X = adjustedConfig.AWS_X + adjustedConfig.AWS_W + 50;
    }
    const gwWidth = adjustedConfig.AWS_W - adjustedConfig.RT_W - 55;
    if (gwWidth < 120) {
      adjustedConfig.RT_W = adjustedConfig.AWS_W - 55 - 120;
    }
    // Ensure all widths/heights are positive
    for (const key of ['TEAMS_W', 'AWS_W', 'TOOLS_W', 'RT_W', 'MSAP_H', 'MSAP_GAP', 'TOOL_H', 'TOOL_GAP', 'GW_GAP']) {
      if (adjustedConfig[key] <= 0) adjustedConfig[key] = currentConfig[key];
    }

    return res.json({ adjustedConfig, reasoning });
  } catch (err) {
    console.error('[adjust-layout] Claude API error:', err.message);
    return res.status(502).json({ error: `Claude API error: ${err.message}` });
  }
}
