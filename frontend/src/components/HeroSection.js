import React, { useEffect, useRef } from 'react';
import './HeroSection.css';

const TICKER_ITEMS = [
  'AI Image Analysis', 'Listing Descriptions', 'Social Captions',
  'SEO Titles', 'Bullet Points', 'Call to Actions',
  'Target Audience', 'Headline Copy', 'Marketing Kit',
  'AI Image Analysis', 'Listing Descriptions', 'Social Captions',
  'SEO Titles', 'Bullet Points', 'Call to Actions',
  'Target Audience', 'Headline Copy', 'Marketing Kit',
];

export default function HeroSection() {
  const cursorRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
      if (blobRef.current) {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        blobRef.current.style.background = `radial-gradient(600px at ${x}% ${y}%, rgba(255,77,141,0.14), transparent 60%)`;
      }
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const scrollToGenerate = () =>
    document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="hero" id="hero">
      {/* Interactive mouse blob */}
      <div className="hero-blob" ref={blobRef} />

      {/* Cursor dot */}
      <div className="cursor-dot" ref={cursorRef} />

      {/* Grid */}
      <div className="hero-grid" />

      <div className="hero-inner container">
        {/* Left */}
        <div className="hero-left">
          <div className="tag reveal delay-1">
            <span className="dot" />
            Free · Open Source · AI Powered
          </div>

          <h1 className="hero-title reveal delay-2">
            Turn Property<br />
            <span className="hero-title-em">Photos Into</span><br />
            <span className="hero-title-outline">Marketing</span><br />
            <span className="hero-title-em">Gold.</span>
          </h1>

          <p className="hero-subtitle reveal delay-3">
            Upload any property image. Enter basic details.
            Receive a complete AI-generated marketing kit —
            headline, description, social captions, SEO title — in under 30 seconds.
          </p>

          <div className="hero-actions reveal delay-4">
            <button className="btn-pink" onClick={scrollToGenerate}>
              Generate Now — It's Free
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 9H14M9 4L14 9L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="btn-outline" onClick={scrollToGenerate}>
              Try Demo (No API Key)
            </button>
          </div>

          <div className="hero-stats reveal delay-5">
            {[['&lt; 30s','Generation time'],['100%','Open Source'],['3','AI Providers']].map(([v,l],i) => (
              <div key={i} className="hero-stat">
                <span className="stat-v" dangerouslySetInnerHTML={{__html: v}} />
                <span className="stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Floating UI mockup */}
        <div className="hero-right reveal-right delay-2">
          <div className="hero-card">
            <div className="card-toolbar">
              <div className="toolbar-dots"><span/><span/><span/></div>
              <span className="toolbar-label">propai.app</span>
              <div className="toolbar-status"><span className="status-live"/>Live</div>
            </div>

            <div className="card-upload-zone">
              <div className="upload-icon">📸</div>
              <p className="upload-text">property photo uploaded</p>
              <div className="upload-bar">
                <div className="upload-fill" style={{width:'100%'}}/>
              </div>
            </div>

            <div className="card-ai-badge">
              <div className="ai-spinner"/>
              <span>AI analysing image...</span>
            </div>

            <div className="card-output">
              <div className="output-row">
                <span className="out-label pink">Headline</span>
                <div className="out-shimmer w-full" />
              </div>
              <div className="output-row mt">
                <span className="out-label">Description</span>
                <div className="out-shimmer" />
                <div className="out-shimmer w-80" />
                <div className="out-shimmer w-full" />
              </div>
              <div className="output-row mt">
                <span className="out-label">Features</span>
                {[...Array(4)].map((_,i) => (
                  <div key={i} className="out-bullet">
                    <div className="bullet-dot-pink"/>
                    <div className="out-shimmer flex-1" style={{width:`${55+i*12}%`}}/>
                  </div>
                ))}
              </div>
              <div className="card-btns">
                <button className="card-btn pink-btn">Copy All</button>
                <button className="card-btn">Download</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <span className="ticker-sep">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
