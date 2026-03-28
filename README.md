# 🏠 PropAI v2 — AI Property Marketing Platform
**Project-2026S1_24 · Tech Adaptive**

> One-page scrolling app · Dark/Light theme toggle · Retro-pink design · Scroll animations · Split-screen layouts · FREE AI models

---

## 🆓 Free AI Models (No Credit Card Needed!)

| Purpose | Model | Provider | Cost |
|---------|-------|----------|------|
| **Image Analysis** | `Salesforce/blip-image-captioning-large` | Hugging Face | **FREE** |
| **Text Generation** | `mistralai/Mistral-7B-Instruct-v0.3` | Hugging Face | **FREE** |
| Image Analysis (premium) | Claude Vision | Anthropic | Paid |
| Text Generation (premium) | GPT-4o | OpenAI | Paid |

### Get Your Free Hugging Face Key
1. Go to: https://huggingface.co/settings/tokens
2. Click **"New token"** → Name it anything → Role: **Read**
3. Copy the token (starts with `hf_...`)
4. Paste into `backend/.env` as `HF_API_KEY=hf_...`

---

## 🚀 Running Commands (VS Code Terminal)

### Step 1 — Extract zip and open in VS Code
```bash
# Right-click the zip → Extract → open extracted folder in VS Code
# Then open VS Code Terminal (Ctrl+` or View → Terminal)
```

### Step 2 — Install all dependencies
```bash
npm install
npm run install:all
```

### Step 3 — Set up environment
```bash
cd backend
cp .env.example .env
```
Then open `backend/.env` and add your HuggingFace key:
```
AI_PROVIDER=free
HF_API_KEY=hf_your_token_here
```

### Step 4 — Run both servers (one command!)
```bash
# From the ROOT folder (propai-v2/)
cd ..
npm run dev
```

This starts:
- **Backend API** → http://localhost:5000
- **Frontend App** → http://localhost:3000 (opens automatically)

### Alternative — Run separately (two terminals)
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

---

## 🎭 Demo Mode (Zero Setup)
No API key at all? Click **"Try Demo"** in the app — uses mock responses to show the full flow.

---

## 📁 Project Structure
```
propai-v2/
├── frontend/
│   ├── public/index.html
│   └── src/
│       ├── App.js              # Main app, theme state
│       ├── index.css           # Design system (dark/light vars)
│       ├── hooks/
│       │   └── useScrollReveal.js
│       └── components/
│           ├── Navbar.js/css        # Fixed nav + theme toggle
│           ├── HeroSection.js/css   # Animated hero, mouse blob, ticker
│           ├── HowItWorksSection.js/css  # Split-screen steps
│           ├── GenerateSection.js/css    # Upload form
│           ├── ResultsSection.js/css     # AI output dashboard
│           ├── TechSection.js/css        # Stack + free models
│           └── FooterSection.js/css
├── backend/
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── routes/property.js
│       └── services/aiService.js   # All 3 AI providers
├── package.json    ← root (run scripts here)
└── README.md
```

---

## ☁️ Deploy to GitHub + Vercel + Render

### Push to GitHub
```bash
git init
git add .
git commit -m "PropAI v2 - Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/propai-v2.git
git push -u origin main
```

### Frontend → Vercel (Free)
1. Go to https://vercel.com → Import project
2. Root Directory: `frontend`
3. Framework: Create React App
4. Deploy ✅

### Backend → Render (Free)
1. Go to https://render.com → New Web Service
2. Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add env vars from `backend/.env`
6. Deploy ✅

---

## 🎨 Design Features
- ✅ Dark / Light theme toggle (persists in localStorage)
- ✅ One-page smooth scroll layout
- ✅ Retro pink `#ff4d8d` accent theme
- ✅ Scroll-triggered reveal animations (fade up, left, right)
- ✅ Split-screen alternating How It Works sections
- ✅ Interactive mouse-tracking blob effect on hero
- ✅ Marquee ticker banner
- ✅ Animated UI mockup card
- ✅ Custom scrollbar, selection highlight, cursor dot
- ✅ Syne (display) + Cabinet Grotesk (body) fonts

---

*Project-2026S1_24 · Tech Adaptive · 2026*
