import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import HowItWorksSection from './components/HowItWorksSection';
import GenerateSection from './components/GenerateSection';
import ResultsSection from './components/ResultsSection';
import TechSection from './components/TechSection';
import FooterSection from './components/FooterSection';
import { useScrollReveal } from './hooks/useScrollReveal';
import './App.css';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load persisted theme
  useEffect(() => {
    const saved = localStorage.getItem('propai-theme');
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('propai-theme', next);
  };

  const handleResult = (data, preview) => {
    setResult(data);
    setImagePreview(preview);
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setImagePreview(null);
    document.getElementById('generate')?.scrollIntoView({ behavior: 'smooth' });
  };

  useScrollReveal();

  return (
    <div className="app">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <HeroSection />
      <HowItWorksSection />
      <GenerateSection onResult={handleResult} />
      {result && <ResultsSection result={result} imagePreview={imagePreview} onReset={handleReset} />}
      <TechSection />
      <FooterSection />
    </div>
  );
}
