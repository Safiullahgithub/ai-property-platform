import React from 'react';
import './FooterSection.css';

export default function FooterSection() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M11 1L1 8V21H8V15H14V21H21V8L11 1Z" stroke="currentColor" strokeWidth="1.6" fill="none"/>
                <circle cx="11" cy="8" r="2.5" fill="currentColor"/>
              </svg>
              <span>Prop<span className="pink">AI</span></span>
            </div>
            <p className="footer-tagline">AI-powered property marketing.<br/>Free. Open-source. Fast.</p>
            <p className="footer-project">Project-2026S1_24 · Tech Adaptive</p>
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Navigate</p>
            {[['Hero','hero'],['How It Works','how-it-works'],['Generate','generate'],['Tech Stack','tech']].map(([l,id]) => (
              <button key={id} className="footer-link" onClick={() => scrollTo(id)}>{l}</button>
            ))}
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Resources</p>
            <a className="footer-link" href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer">Get Free HF Key</a>
            <a className="footer-link" href="https://huggingface.co/Salesforce/blip-image-captioning-large" target="_blank" rel="noreferrer">BLIP Model</a>
            <a className="footer-link" href="https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3" target="_blank" rel="noreferrer">Mistral-7B Model</a>
            <a className="footer-link" href="https://vercel.com" target="_blank" rel="noreferrer">Deploy on Vercel</a>
          </div>

          <div className="footer-links-group">
            <p className="footer-group-title">Deployment</p>
            <a className="footer-link" href="https://vercel.com" target="_blank" rel="noreferrer">Vercel (Frontend)</a>
            <a className="footer-link" href="https://render.com" target="_blank" rel="noreferrer">Render (Backend)</a>
            <a className="footer-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 PropAI · Project-2026S1_24 · Tech Adaptive</span>
          <span className="footer-made">Built with React + Node.js + Hugging Face AI</span>
        </div>
      </div>
    </footer>
  );
}
