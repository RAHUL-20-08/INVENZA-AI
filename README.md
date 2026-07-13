# Lost Innovation - AI-Powered Innovation Revival Platform

**Lost Innovation** is an AI-powered operating system and web platform built for hackathons to discover, analyze, and revive forgotten, abandoned, or underutilized innovations from around the world. By combining historical database auditing, semantic search overlap mapping, predictive commercialization forecasting, and automated business modeling, it turns yesterday's failed projects into tomorrow's opportunities.

---

## 🌟 Hackathon Key Features

1. **Cyber-Tech Dark Dashboard**: Interactive indicators displaying global metrics, revival odds, TRL levels, market trends (via SVG lines), and comparative lists of failure bottlenecks and AI integration vectors.
2. **Semantic Idea Audit Portal**: Paste raw project abstracts or text to verify patent similarity, check overlapping research, and generate dynamic readiness profiles.
3. **Business Model Canvas Generator**: Pre-populates the classic 9-box Lean Startup Canvas (Key Partners, Key Activities, Cost Structure, Channels, etc.) custom-tailored to the active innovation.
4. **Commercialization Roadmap & SWOT**: Four-phase development timelining, technical skills analyzer, estimated developer budgets, and a detailed investor target board.
5. **Interactive Cross-Innovation Knowledge Graph**: An animated force-directed node-link network rendered in high-performance HTML5 Canvas showing dependencies between failed projects, core bottlenecks, and modern technologies.
6. **ReviveAI Copilot Chat Assistant**: A floating chat widget enabling users to consult an AI assistant in real-time regarding how to scale hardware designs, resolve bio-diagnostics, or pivot business models.

---

## 📂 Jury-Friendly Project Directory Structure

```
D:\lost-innovation\
├── database\                # Pre-seeded SQLite/JSON historical dataset
│   └── database.json        # Rich profiles of 20+ actual tech failures (Lytro, Pebble, Glass, Ara...)
├── backend\                 # Express REST API Server
│   ├── config\              # Env files & constants
│   ├── controllers\         # MVC Business Logic (Search, Analyze, Chat, Graph)
│   ├── routes\              # Express Endpoints
│   ├── app.js               # Express Server boot file
│   └── package.json
├── frontend\                # Vite React SPA App
│   ├── public\              # Icons & static assets
│   ├── src\
│   │   ├── components\      # Sidebar, Canvas Graph, Chat Assistant widget
│   │   ├── pages\           # Dashboard view, Explorer audit portal, Startup Builder canvas
│   │   ├── styles\          # Custom CSS stylesheets (Dark-theme cyber variable system)
│   │   ├── App.jsx          # Main client controller
│   │   └── main.jsx         # React mounting
│   └── package.json
└── README.md                # System overview and instruction manual
```

---

## ⚙️ How to Run the Project Locally

### 1. Start the Express Backend Server
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd D:\lost-innovation\backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the API server:
   ```bash
   npm start
   ```
   The backend will start running on **`http://localhost:5000`**.

### 2. Start the Vite React Frontend
1. Open a second terminal window and navigate to the frontend directory:
   ```bash
   cd D:\lost-innovation\frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The web application will boot instantly on **`http://localhost:5173`**.

Open your browser and navigate to **`http://localhost:5173`** to test the platform.

---

## 🔧 Technical Stack Details

- **Frontend**: React.js, Vite, Lucide Icons
- **Backend**: Node.js, Express.js (ES Modules syntax)
- **Database**: Pre-seeded relational JSON storage
- **Styling**: Vanilla CSS utilizing custom HSL variable mappings, glassmorphism filters, grid panels, and keyframe micro-animations.
- **Physics Engine**: Custom vector math-based force layout written in canvas loops to run 60FPS node repulsions without third-party graphing libraries.
