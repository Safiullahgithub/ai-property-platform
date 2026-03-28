import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './ResultsSection.css';

function CopyBtn({ text, label }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopied(false), 2500);
    } catch { toast.error('Copy failed.'); }
  };
  return (
    <button className={`copy-btn btn-ghost ${copied ? 'copied' : ''}`} onClick={copy}>
      {copied ? (
        <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
      ) : (
        <><svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="4" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M4 4V3a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H9" stroke="currentColor" strokeWidth="1.3"/></svg> Copy</>
      )}
    </button>
  );
}

function ContentCard({ title, badge, children, copyText }) {
  return (
    <div className="res-card">
      <div className="res-card-head">
        <div className="res-card-meta">
          <span className="res-card-title">{title}</span>
          {badge && <span className="res-badge">{badge}</span>}
        </div>
        {copyText && <CopyBtn text={copyText} label={title} />}
      </div>
      <div className="res-card-body">{children}</div>
    </div>
  );
}

export default function ResultsSection({ result, imagePreview, onReset }) {
  const { marketingContent: mc, imageAnalysis: ia, propertyData: pd, isDemo, generatedAt } = result;

  const downloadTxt = () => {
    const txt = [
      '═══════════════════════════════════',
      '  PropAI — Property Marketing Kit',
      `  Generated: ${new Date(generatedAt).toLocaleString()}`,
      '═══════════════════════════════════\n',
      `HEADLINE\n${mc.headline}\n`,
      `TAGLINE\n${mc.tagline}\n`,
      `DESCRIPTION\n${mc.fullDescription}\n`,
      `KEY FEATURES\n${mc.bulletPoints?.map(b => `• ${b}`).join('\n')}\n`,
      `SOCIAL CAPTION\n${mc.socialCaption}\n`,
      `CALL TO ACTION\n${mc.callToAction}\n`,
      `SEO TITLE\n${mc.seoTitle}\n`,
      `TARGET AUDIENCE\n${mc.targetAudience}\n`,
      `PROPERTY\n${pd.propertyType} · ${pd.bedrooms}bed · ${pd.bathrooms}bath · ${pd.price ? '$'+pd.price : 'POA'} · ${pd.location}`,
    ].join('\n');

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
    a.download = `propai-listing-${Date.now()}.txt`;
    a.click();
    toast.success('Downloaded!');
  };

  const allText = [mc.headline, mc.tagline, mc.fullDescription, mc.bulletPoints?.join('\n'), mc.socialCaption, mc.callToAction].join('\n\n');

  return (
    <section className="res-section section-pad" id="results">
      <div className="container">
        {/* Header */}
        <div className="res-header reveal">
          <div className="res-header-left">
            <div className="tag">
              <span className="dot" />
              {isDemo ? 'Demo Result' : 'AI Generated'}
            </div>
            <h2 className="res-title">Your <span className="pink">Marketing Kit</span></h2>
            <p className="res-time">Generated {new Date(generatedAt).toLocaleString()}</p>
          </div>
          <div className="res-header-actions">
            <CopyBtn text={allText} label="All Content" />
            <button className="btn-ghost" onClick={downloadTxt}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V9M3.5 6.5L7 10L10.5 6.5M1 13H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download .txt
            </button>
            <button className="btn-pink res-new-btn" onClick={onReset}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7A6 6 0 0113 7M13 7L10 4M13 7L10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              New Listing
            </button>
          </div>
        </div>

        {/* Hero banner */}
        <div className="res-banner reveal delay-1">
          {imagePreview && (
            <div className="banner-img-wrap">
              <img src={imagePreview} alt="Property" className="banner-img" />
              <div className="banner-overlay" />
            </div>
          )}
          <div className="banner-content">
            <span className="banner-badge">{pd.propertyType} · {pd.location}</span>
            <h1 className="banner-headline">{mc.headline}</h1>
            <p className="banner-tagline">"{mc.tagline}"</p>
            <div className="banner-specs">
              {pd.price && <span className="banner-price">${Number(pd.price.replace(/,/g,'')).toLocaleString()}</span>}
              {pd.bedrooms && <span>🛏 {pd.bedrooms} bed</span>}
              {pd.bathrooms && <span>🚿 {pd.bathrooms} bath</span>}
              {pd.size && <span>📐 {Number(pd.size).toLocaleString()} sqft</span>}
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="res-grid">
          {/* Left — Content */}
          <div className="res-main">
            {/* Full description */}
            <ContentCard title="Full Description" badge="Copy-ready" copyText={mc.fullDescription}>
              <div className="desc-text">
                {mc.fullDescription?.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </ContentCard>

            {/* Bullet points */}
            <ContentCard title="Key Features" badge="Bullet Points" copyText={mc.bulletPoints?.join('\n')}>
              <ul className="bullet-list">
                {mc.bulletPoints?.map((b, i) => (
                  <li key={i}>
                    <span className="bullet-icon">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M2 5.5L4.5 8L9 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </ContentCard>

            {/* Social + CTA */}
            <div className="two-up reveal delay-2">
              <ContentCard title="Social Caption" badge="Instagram / LinkedIn" copyText={mc.socialCaption}>
                <p className="social-text">{mc.socialCaption}</p>
              </ContentCard>
              <ContentCard title="Call to Action" badge="Email footer" copyText={mc.callToAction}>
                <p className="cta-italic">{mc.callToAction}</p>
              </ContentCard>
            </div>

            {/* SEO + Audience */}
            <div className="two-up reveal delay-3">
              <ContentCard title="SEO Title" badge="Meta tag" copyText={mc.seoTitle}>
                <p className="seo-text">{mc.seoTitle}</p>
              </ContentCard>
              <ContentCard title="Target Audience" badge="Ad targeting" copyText={mc.targetAudience}>
                <p className="audience-text">{mc.targetAudience}</p>
              </ContentCard>
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="res-side">
            {/* AI Analysis */}
            <div className="side-card reveal-right delay-2">
              <div className="side-head">
                <h4>🔍 AI Image Analysis</h4>
                <span className="ai-tag">Vision AI</span>
              </div>
              <div className="analysis-grid">
                {[
                  ['Room', ia?.roomType],
                  ['Condition', ia?.condition],
                  ['Style', ia?.style],
                  ['Lighting', ia?.lighting],
                  ['Size', ia?.estimatedSize],
                  ['Atmosphere', ia?.atmosphere],
                ].filter(([,v]) => v).map(([k,v]) => (
                  <div key={k} className="analysis-cell">
                    <span className="cell-key">{k}</span>
                    <span className="cell-val">{v}</span>
                  </div>
                ))}
              </div>
              {ia?.keyFeatures?.length > 0 && (
                <div className="feature-tags">
                  {ia.keyFeatures.map((f,i) => <span key={i} className="feat-tag">{f}</span>)}
                </div>
              )}
              {ia?.standoutElement && (
                <div className="standout">
                  <span className="standout-label">⭐ Standout</span>
                  <p>{ia.standoutElement}</p>
                </div>
              )}
            </div>

            {/* Property summary */}
            <div className="side-card reveal-right delay-3">
              <div className="side-head"><h4>🏠 Property Summary</h4></div>
              {[
                ['Type', pd.propertyType], ['Location', pd.location],
                ['Bedrooms', pd.bedrooms], ['Bathrooms', pd.bathrooms],
                ['Size', pd.size ? `${Number(pd.size).toLocaleString()} sqft` : null],
                ['Price', pd.price ? `$${pd.price}` : null],
              ].filter(([,v]) => v).map(([k,v]) => (
                <div key={k} className="summary-row">
                  <span className="sum-k">{k}</span>
                  <span className="sum-v">{v}</span>
                </div>
              ))}
            </div>

            {/* CTA card */}
            <div className="side-card side-cta reveal-right delay-4">
              <p className="cta-eyebrow">Satisfied with the results?</p>
              <h4 className="cta-heading">Ready to Publish</h4>
              <button className="btn-pink" style={{width:'100%',justifyContent:'center'}} onClick={downloadTxt}>
                Download Full Kit
              </button>
              <button className="btn-outline" style={{width:'100%',justifyContent:'center',marginTop:'10px'}} onClick={onReset}>
                Generate Another
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
