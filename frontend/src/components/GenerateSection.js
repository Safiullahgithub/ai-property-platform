import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import './GenerateSection.css';

const TYPES = ['House','Apartment','Villa','Townhouse','Studio','Penthouse','Commercial','Land'];

export default function GenerateSection({ onResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [isDemo, setIsDemo] = useState(false);
  const [form, setForm] = useState({
    propertyType: 'House', bedrooms: '', bathrooms: '',
    price: '', location: '', size: '', notes: '',
  });

  const STEPS = [
    { icon: '🔍', text: 'Analysing image with AI vision...' },
    { icon: '🏠', text: 'Extracting property features...' },
    { icon: '✍️', text: 'Generating marketing content...' },
    { icon: '✨', text: 'Polishing your listing...' },
  ];

  useEffect(() => {
    let t;
    if (loading) t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 2200);
    return () => clearInterval(t);
  }, [loading]);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) { toast.error('JPEG / PNG / WebP under 10 MB only.'); return; }
    const f = accepted[0];
    setImage(f);
    setPreview(URL.createObjectURL(f));
    toast.success('Image ready!');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024, multiple: false,
  });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (demo = false) => {
    if (!demo && !image) { toast.error('Please upload a property image.'); return; }
    if (!form.location.trim()) { toast.error('Location is required.'); return; }

    setLoading(true); setStep(0); setIsDemo(demo);

    try {
      let res;
      if (demo) {
        res = await axios.post('/api/property/demo', form);
      } else {
        const fd = new FormData();
        fd.append('image', image);
        Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
        res = await axios.post('/api/property/generate', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 90000,
        });
      }
      onResult(res.data, preview);
      toast.success('Marketing kit generated!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Generation failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="gen-section section-pad" id="generate">
      {/* Loading overlay */}
      {loading && (
        <div className="gen-overlay">
          <div className="gen-modal">
            <div className="gen-spinner-wrap">
              <div className="gen-ring" />
              <div className="gen-ring gen-ring2" />
              <span className="gen-ring-icon">{STEPS[step].icon}</span>
            </div>
            <p className="gen-step-text">{STEPS[step].text}</p>
            {isDemo && <span className="demo-note">Demo mode — using mock responses</span>}
            <div className="gen-dots">
              {STEPS.map((_, i) => <span key={i} className={`gen-dot ${i <= step ? 'on' : ''}`} />)}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div className="gen-header reveal">
          <div className="tag"><span className="dot" />Generator</div>
          <h2 className="gen-title">
            Create Your <span className="pink">Listing</span>
          </h2>
          <p className="gen-subtitle">
            Upload a photo, fill in the details, and let AI do the heavy lifting.
          </p>
          {/* Free model notice */}
          <div className="free-notice reveal delay-2">
            <span className="free-badge">🆓 FREE</span>
            <span>Uses Hugging Face BLIP + Mistral-7B — no credit card needed.</span>
            <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="free-link">
              Get free API key →
            </a>
          </div>
        </div>

        <div className="gen-grid">
          {/* LEFT — Upload */}
          <div className="gen-left reveal-left delay-1">
            <div className="gen-card">
              <div className="gen-card-head">
                <span className="gen-step-badge">01</span>
                <h3>Property Image</h3>
              </div>

              {!preview ? (
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="dz-icon">
                    {isDragActive ? '⬇️' : (
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect x="1" y="1" width="38" height="38" rx="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 5"/>
                        <path d="M20 27V13M13 20L20 13L27 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p className="dz-main">{isDragActive ? 'Drop it!' : 'Drag & drop your photo'}</p>
                  <p className="dz-sub">or click to browse · JPEG, PNG, WebP · max 10 MB</p>
                </div>
              ) : (
                <div className="img-preview">
                  <img src={preview} alt="Preview" />
                  <div className="img-overlay">
                    <button onClick={() => { setImage(null); URL.revokeObjectURL(preview); setPreview(null); }}>
                      ✕ Remove
                    </button>
                  </div>
                  <div className="img-ready">✓ Ready</div>
                </div>
              )}

              {/* Tips */}
              <div className="tips-box">
                <p className="tips-title">💡 Photo tips</p>
                <ul>
                  <li>Bright, well-lit rooms work best</li>
                  <li>Capture the room's best angle</li>
                  <li>Include unique architectural features</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="gen-right reveal-right delay-2">
            <div className="gen-card">
              <div className="gen-card-head">
                <span className="gen-step-badge">02</span>
                <h3>Property Details</h3>
              </div>

              {/* Property type */}
              <div className="field">
                <label>Property Type</label>
                <div className="type-grid">
                  {TYPES.map(t => (
                    <button
                      key={t} type="button"
                      className={`type-btn ${form.propertyType === t ? 'active' : ''}`}
                      onClick={() => setForm(p => ({ ...p, propertyType: t }))}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Bed / Bath */}
              <div className="field-row">
                <div className="field">
                  <label>Bedrooms</label>
                  <input name="bedrooms" type="number" min="0" max="20"
                    value={form.bedrooms} onChange={handleChange} placeholder="e.g. 4" className="inp" />
                </div>
                <div className="field">
                  <label>Bathrooms</label>
                  <input name="bathrooms" type="number" min="0" max="20"
                    value={form.bathrooms} onChange={handleChange} placeholder="e.g. 2" className="inp" />
                </div>
              </div>

              {/* Price / Size */}
              <div className="field-row">
                <div className="field">
                  <label>Price ($)</label>
                  <input name="price" type="text"
                    value={form.price} onChange={handleChange} placeholder="e.g. 1,200,000" className="inp" />
                </div>
                <div className="field">
                  <label>Size (sq ft)</label>
                  <input name="size" type="number"
                    value={form.size} onChange={handleChange} placeholder="e.g. 2400" className="inp" />
                </div>
              </div>

              {/* Location */}
              <div className="field">
                <label>Location <span className="req">*</span></label>
                <input name="location" type="text"
                  value={form.location} onChange={handleChange}
                  placeholder="e.g. Mayfair, London" className="inp" required />
              </div>

              {/* Notes */}
              <div className="field">
                <label>
                  Extra Features
                  <span className="field-hint"> — optional highlights</span>
                </label>
                <textarea name="notes" rows={3}
                  value={form.notes} onChange={handleChange}
                  placeholder="e.g. private pool, south-facing garden, new kitchen..."
                  className="inp textarea" />
              </div>

              {/* Buttons */}
              <div className="gen-btns">
                <button
                  className="btn-pink gen-submit"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2L17 9L9 16M1 9H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Generate with AI
                </button>
                <button
                  className="btn-outline gen-demo"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  🎭 Try Demo
                </button>
              </div>
              <p className="gen-note">⚡ Content ready in &lt;30 seconds · Powered by Hugging Face (free) or Claude/GPT-4o</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
