import React from 'react';
import './HowItWorksSection.css';

const STEPS = [
  {
    num: '01', emoji: '📸',
    title: 'Upload Your Property Photo',
    desc: 'Drag & drop any property image — interior, exterior, garden. Our AI vision model analyses every pixel to extract room type, condition, style, lighting quality, and standout features automatically.',
    detail: 'Supports JPEG, PNG & WebP up to 10MB',
    highlight: 'Free AI: BLIP image captioning via Hugging Face',
  },
  {
    num: '02', emoji: '📝',
    title: 'Enter Property Details',
    desc: 'Fill in bedrooms, bathrooms, price, location, and any special features you want highlighted. The more context you provide, the richer the marketing copy becomes. Takes under 60 seconds.',
    detail: 'Bedrooms · Bathrooms · Price · Location · Size',
    highlight: '8 property types supported',
  },
  {
    num: '03', emoji: '🤖',
    title: 'AI Generates Your Marketing Kit',
    desc: 'Our AI text engine transforms the analysed visual data and your property details into a complete, professional marketing kit — headline, tagline, full description, bullet points, social caption, CTA, and SEO title.',
    detail: 'Powered by Mistral-7B (free) or Claude/GPT-4o',
    highlight: 'Output ready in under 30 seconds',
  },
  {
    num: '04', emoji: '🚀',
    title: 'Copy, Download & Publish',
    desc: 'One-click copy any section to clipboard. Download the full kit as a .txt file. Paste directly into your listings portals, CRM, social media, or email campaigns.',
    detail: 'Copy individual sections or download all at once',
    highlight: 'No watermarks. No subscriptions.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="hiw section-pad" id="how-it-works">
      <div className="container">
        <div className="hiw-header reveal">
          <div className="tag"><span className="dot"/>Process</div>
          <h2 className="hiw-title">
            How It <span className="pink">Works</span>
          </h2>
          <p className="hiw-subtitle">
            From raw photo to publication-ready marketing content in four simple steps.
          </p>
        </div>

        <div className="hiw-steps">
          {STEPS.map((step, i) => (
            <div key={i} className={`hiw-step ${i % 2 === 1 ? 'reverse' : ''}`}>
              {/* Visual side */}
              <div className={`step-visual reveal-${i % 2 === 0 ? 'left' : 'right'} delay-${i + 1}`}>
                <div className="step-visual-inner">
                  <div className="step-big-num">{step.num}</div>
                  <div className="step-emoji-wrap">
                    <span className="step-emoji">{step.emoji}</span>
                  </div>
                  <div className="step-highlight-badge">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L4.5 8.5L10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {step.highlight}
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className={`step-text reveal-${i % 2 === 0 ? 'right' : 'left'} delay-2`}>
                <div className="step-num-small">{step.num}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                <div className="step-detail">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/>
                    <path d="M7 5V7.5L8.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  {step.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
