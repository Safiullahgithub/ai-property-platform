import React from 'react';
import './TechSection.css';

const STACK = [
  { name: 'React 18', role: 'Frontend UI', color: '#61dafb', free: true },
  { name: 'Node.js + Express', role: 'REST API', color: '#68a063', free: true },
  { name: 'HuggingFace BLIP', role: 'Image Analysis (FREE)', color: '#ff9d00', free: true },
  { name: 'Mistral-7B-Instruct', role: 'Text Generation (FREE)', color: '#7c3aed', free: true },
  { name: 'Claude Vision', role: 'Premium Image AI', color: '#d4af6b', free: false },
  { name: 'GPT-4o Vision', role: 'Premium Alt. AI', color: '#74aa9c', free: false },
  { name: 'Vercel + Render', role: 'Free Hosting', color: '#a78bfa', free: true },
  { name: 'GitHub', role: 'Version Control', color: '#f5f5f5', free: true },
];

export default function TechSection() {
  return (
    <section className="tech-section section-pad" id="tech">
      <div className="container">
        <div className="tech-header reveal">
          <div className="tag"><span className="dot"/>Stack</div>
          <h2 className="tech-title">Built on <span className="pink">Open-Source</span></h2>
          <p className="tech-sub">Free models first — upgrade to premium AI any time by changing one env variable.</p>
        </div>

        <div className="tech-grid">
          {STACK.map((t, i) => (
            <div key={i} className={`tech-card reveal delay-${(i % 4) + 1}`}>
              <div className="tech-dot" style={{ background: t.color }} />
              <div className="tech-name">{t.name}</div>
              <div className="tech-role">{t.role}</div>
              {t.free && <span className="free-pill">FREE</span>}
            </div>
          ))}
        </div>

        <div className="ai-models-box reveal delay-2">
          <h3>🤖 Free AI Models Used</h3>
          <div className="model-list">
            <div className="model-item">
              <div className="model-dot green"/>
              <div>
                <p className="model-name">Salesforce/blip-image-captioning-large</p>
                <p className="model-desc">Image analysis — extracts visual features from property photos. 100% free via Hugging Face.</p>
                <a href="https://huggingface.co/Salesforce/blip-image-captioning-large" target="_blank" rel="noreferrer" className="model-link">View on HuggingFace →</a>
              </div>
            </div>
            <div className="model-item">
              <div className="model-dot purple"/>
              <div>
                <p className="model-name">mistralai/Mistral-7B-Instruct-v0.3</p>
                <p className="model-desc">Text generation — creates marketing content, descriptions, captions. Free tier available.</p>
                <a href="https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3" target="_blank" rel="noreferrer" className="model-link">View on HuggingFace →</a>
              </div>
            </div>
          </div>
          <div className="model-get-key">
            <span>Get your free HuggingFace API key:</span>
            <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="key-link">
              huggingface.co/settings/tokens
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
