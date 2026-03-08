# MVCVS — Multilingual Voice Comprehension & Verification System
### AWS AI for Bharat Hackathon

> **Measuring understanding, not just translating.**

---

## 🚀 Quick Setup (Copy-Paste Ready)

```bash
# 1. Create Vite project (if starting fresh)
npm create vite@latest mvcvs -- --template react
cd mvcvs

# 2. Install all dependencies
npm install react-router-dom reactflow lucide-react

# 3. Install Tailwind CSS
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p

# 4. Copy all project files from this repo into your mvcvs/ folder
# (Replace the generated src/ with the provided src/)

# 5. Run the dev server
npm run dev
```

---

## 📁 Project Structure

```
mvcvs/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                      # Entry point
    ├── App.jsx                       # Router setup
    ├── index.css                     # Global styles + Tailwind
    ├── context/
    │   └── SessionContext.jsx        # Global state (scenario, processing, scores)
    ├── data/
    │   └── scenarios.js             # All mock data for 3 scenarios
    └── pages/
        ├── LandingPage.jsx          # Route: /
        ├── ExpertPortal.jsx         # Route: /expert
        └── CitizenPortal.jsx        # Route: /citizen
```

---

## 🎬 Demo Flow

### Full Demo (2-3 minutes):

1. **Landing Page (`/`)** → Select a scenario (Hospital / Bank / Government) → Click **"Enter as Expert"**

2. **Expert Portal (`/expert`)** → Click the **blue mic button** to start recording → Click **stop** after ~3 seconds → Watch the AI pipeline animate (ASR → Semantic Parser → DAG Constructor) → See the **Procedural Logic DAG** render → Click **"Open Citizen View"**

3. **Citizen Portal (`/citizen`)** → Toggle between **English / Hindi / Telugu** → Press **Play** to simulate audio → Read the simplified steps → Answer the **comprehension quiz** → Submit to see:
   - **Risk Score** (High/Medium/Low)
   - **Misunderstanding Detected** alerts for wrong answers
   - **Adaptive re-explanations** with simpler analogies
   - Score feeds back to the **Expert Risk Dashboard**

---

## 🏗️ Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| State Management | React Context API | Session data, processing states, quiz scores |
| Routing | React Router DOM v6 | 3 views: Landing, Expert, Citizen |
| UI Framework | Tailwind CSS | Dark-mode utility styling |
| Graph Visualization | React Flow v11 | Procedural Logic DAG |
| Icons | Lucide React | Consistent icon system |

---

## 📊 Mock Scenarios

| Scenario | Domain | Key Risk |
|----------|--------|----------|
| **Hospital – BPPV** | Medical | Patient sleeping wrong → crystals don't settle |
| **Bank – Student Loan** | Financial | Missing EMI post-moratorium → penalty + credit damage |
| **Government – PAN/Aadhaar** | Civic | PAN becoming inoperative → can't do banking |

---

## 🤖 Simulated AI Pipeline

The Expert Portal simulates the following AWS AI services:
- **ASR Engine** → Amazon Transcribe (multilingual)
- **Semantic Parser** → Amazon Bedrock / Claude (procedural extraction)  
- **DAG Constructor** → Custom logic graph builder
- **Translation** → Amazon Translate (EN → HI → TE)

---

## 🔑 Key Features for Judges

✅ **Zero Hardware** — Browser-only, no devices needed  
✅ **Procedural Meaning Extraction** — Extracts *steps, deadlines, consequences* (not just words)  
✅ **Comprehension Verification** — Interactive quiz engine  
✅ **Adaptive Re-explanation** — Wrong answer triggers simpler analogy  
✅ **Predictive Risk Scoring** — HIGH/MEDIUM/LOW before failure occurs  
✅ **Multilingual** — English, Hindi, Telugu with full translations  
✅ **DAG Visualization** — Visual proof of logic extraction  
