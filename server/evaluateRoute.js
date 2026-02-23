import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const EVALUATION_PROMPT = `You are evaluating a programmatically generated architecture diagram that will be imported into Lucidchart. The diagram is an SVG preview of the Lucid Standard Import JSON.

Your job is to evaluate whether the diagram is a clean, defect-free rendering — NOT whether the font sizes are large or the spacing is generous. Small, dense text is perfectly fine as long as it is legible, fully contained within its box, and not overlapping other elements. The goal is faithful reproduction of an information-rich architecture diagram, not a presentation slide.

Evaluate these categories on a 1-10 scale (10 = no defects):

1. **textContainment**: Is ALL text fully inside its colored card/box? Look for any text that spills past a shape boundary, is clipped mid-word, or trails outside its rectangle. Score 10 if every piece of text sits cleanly within its shape. Score low only for visible spillage or truncation.

2. **shapeOverlap**: Do any shapes, cards, or containers overlap each other? Specifically: do any colored rectangles sit on top of other colored rectangles where they should not? Containers (AWS Cloud, Runtime box) are expected to sit behind their children — that is correct layering, not overlap. Score low only when peer shapes (two cards, a card and a label, etc.) collide.

3. **containment**: Are all child shapes fully inside their parent containers? The MSAP cards should be inside the Runtime box. The Runtime box, Gateway column, Bedrock row, and Rail section should all be inside the AWS Cloud box. Score 10 if every child sits within its parent boundary.

4. **informationCompleteness**: Does the diagram appear to contain all expected sections? Look for: Teams card (left), AWS Cloud with MSAP cards, Gateway + Memory + MCP connectors, Bedrock row, Shared Infrastructure rail, Enterprise Tools column (right), and a Legend row. Score based on whether any sections appear missing or empty.

5. **structuralFidelity**: Is the three-column layout preserved (External left | AWS center | Tools right)? Are the MSAP cards in a 2x2 grid? Is the Gateway column to the right of the Runtime column inside AWS? Score based on correct spatial organization.

IMPORTANT SCORING GUIDANCE:
- A diagram with small but fully contained text, tight but non-overlapping spacing, and all information present should score 8-10.
- Do NOT penalize small font sizes, tight spacing, or compact layout — these are features, not bugs.
- DO penalize: text spilling outside boxes, shapes overlapping peers, children escaping parents, missing sections, broken layout structure.

For each category, list specific issues (referencing shape names/areas where visible) and actionable suggestions that focus on fixing containment and overlap — NOT on making things bigger.

Return ONLY valid JSON in this exact format (no markdown, no code fences):
{
  "overallScore": <1-10>,
  "summary": "<1-2 sentence overall assessment>",
  "categories": {
    "textContainment": {
      "score": <1-10>,
      "issues": ["<specific issue 1>", ...],
      "suggestions": ["<actionable fix 1>", ...]
    },
    "shapeOverlap": { "score": <1-10>, "issues": [...], "suggestions": [...] },
    "containment": { "score": <1-10>, "issues": [...], "suggestions": [...] },
    "informationCompleteness": { "score": <1-10>, "issues": [...], "suggestions": [...] },
    "structuralFidelity": { "score": <1-10>, "issues": [...], "suggestions": [...] }
  }
}`;

export async function evaluateRoute(req, res) {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Missing "image" field (base64 PNG)' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: image,
              },
            },
            {
              type: 'text',
              text: EVALUATION_PROMPT,
            },
          ],
        },
      ],
    });

    // Extract text from response
    let text = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();

    // Try to parse as JSON
    let evaluation;
    try {
      evaluation = JSON.parse(text);
    } catch {
      // If JSON parsing fails, return raw text so the UI can display it
      evaluation = text;
    }

    return res.json({ evaluation });
  } catch (err) {
    console.error('[evaluate] Claude API error:', err.message);
    return res.status(502).json({ error: `Claude API error: ${err.message}` });
  }
}
