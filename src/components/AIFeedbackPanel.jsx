import './AIFeedbackPanel.css';

const CATEGORY_LABELS = {
  textContainment: 'Text Containment',
  shapeOverlap: 'Shape Overlap',
  containment: 'Parent Containment',
  informationCompleteness: 'Information Completeness',
  structuralFidelity: 'Structural Fidelity',
  // Legacy keys (kept for backwards compatibility)
  textOverflow: 'Text Overflow',
  textOverlap: 'Text Overlap',
  spacing: 'Spacing',
  readability: 'Readability',
  layoutQuality: 'Layout Quality',
  colorContrast: 'Color Contrast',
};

function scoreBadgeClass(score) {
  if (score >= 8) return 'score-badge--green';
  if (score >= 5) return 'score-badge--amber';
  return 'score-badge--red';
}

function AIFeedbackPanel({ feedback }) {
  if (!feedback) return null;

  // If feedback is a raw string (JSON parsing failed on server), show it directly
  if (typeof feedback === 'string') {
    return (
      <div className="ai-feedback-panel">
        <h3 className="ai-feedback-title">AI Evaluation</h3>
        <pre className="ai-feedback-raw">{feedback}</pre>
      </div>
    );
  }

  const { overallScore, summary, categories } = feedback;

  return (
    <div className="ai-feedback-panel">
      <div className="ai-feedback-header">
        <h3 className="ai-feedback-title">AI Evaluation</h3>
        {overallScore != null && (
          <span className={`score-badge score-badge--lg ${scoreBadgeClass(overallScore)}`}>
            {overallScore}/10
          </span>
        )}
      </div>

      {summary && <p className="ai-feedback-summary">{summary}</p>}

      {categories && (
        <div className="ai-feedback-categories">
          {Object.entries(categories).map(([key, cat]) => (
            <div key={key} className="category-card">
              <div className="category-header">
                <span className="category-name">
                  {CATEGORY_LABELS[key] || key}
                </span>
                {cat.score != null && (
                  <span className={`score-badge ${scoreBadgeClass(cat.score)}`}>
                    {cat.score}/10
                  </span>
                )}
              </div>

              {cat.issues && cat.issues.length > 0 && (
                <div className="category-section">
                  <span className="category-section-label">Issues</span>
                  <ul className="category-list">
                    {cat.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cat.suggestions && cat.suggestions.length > 0 && (
                <div className="category-section">
                  <span className="category-section-label">Suggestions</span>
                  <ul className="category-list category-list--suggestions">
                    {cat.suggestions.map((sug, i) => (
                      <li key={i}>{sug}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIFeedbackPanel;
