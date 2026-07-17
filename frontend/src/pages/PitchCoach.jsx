import React, { useState, useEffect, useRef } from 'react';


// Import newly refactored standalone submodules (Feature 3)
import Dashboard from './PitchCoach/Dashboard';
import PitchGenerator from './PitchCoach/PitchGenerator';
import PracticeMode from './PitchCoach/PracticeMode';
import JudgeSimulator from './PitchCoach/JudgeSimulator';
import PitchEvaluator from './PitchCoach/PitchEvaluator';
import ExportCenter from './PitchCoach/ExportCenter';
import PresentationViewer from './PitchCoach/PresentationViewer';

import { fallbackInnovations } from '../dataFallback';

const defaultFallback = {
  name: "Volumetric Light Field Display",
  sector: "Display Technology",
  description: "A high-fidelity spatial light field reconstruction system using diffractive relief waveguides and local foveated edge processing.",
  revivalViability: 85,
  readinessLevel: 4,
  failureBottlenecks: ["Refractive prism aberrations and excessive compute overheads"],
  aiEnhancementVector: ["Local quantized neural waveguide aberration correction"],
  financials: { estimatedCost: "₹350,000", potentialInvestors: ["DeepTech Ventures"], requiredSkills: ["Optics", "CUDA"] },
  swot: { strengths: ["Instant spatial rendering"], opportunities: ["Medical scan displays"] },
  marketGrowth: "15.4% CAGR",
  patentId: "US-482011",
  doi: "10.1145/LF"
};

const PitchCoach = ({ activeInnovation, forceProjector, onExitPresentation, onLaunchPresentation }) => {
  // Navigation tabs (dashboard, generator, practice, simulator, evaluator, exporter)
  const [activeView, setActiveView] = useState("dashboard");

  // Load creations data
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('active-context');
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio_projects');
    if (stored) {
      setPortfolioProjects(JSON.parse(stored));
    }
    const hist = localStorage.getItem('pitch_practice_history');
    if (hist) {
      setHistoryList(JSON.parse(hist));
    }
  }, []);

  const getActiveTargetProject = () => {
    let base = null;
    if (selectedProjectId === 'active-context') {
      base = activeInnovation || fallbackInnovations[0];
    } else {
      const found = portfolioProjects.find(p => String(p.id) === selectedProjectId);
      if (found) {
        base = {
          name: found.title,
          sector: found.category || "Emerging Technologies",
          description: found.desc || "A custom portfolio innovation.",
          revivalViability: 82,
          readinessLevel: 4,
          failureBottlenecks: ["High capital expense barriers"],
          aiEnhancementVector: ["Decentralized Edge LLM routing"],
          financials: { estimatedCost: "₹150,000", potentialInvestors: ["Y Combinator"], requiredSkills: ["React", "Python"] },
          swot: { strengths: ["Low-power operation"], opportunities: ["B2B SaaS subscription models"] },
          marketGrowth: "16.5% CAGR"
        };
      }
    }
    if (!base) return defaultFallback;
    return {
      ...defaultFallback,
      ...base,
      financials: { ...defaultFallback.financials, ...(base.financials || {}) },
      swot: { ...defaultFallback.swot, ...(base.swot || {}) }
    };
  };

  const activeItem = getActiveTargetProject();

  // Mode and Audience Selection states
  const [pitchMode, setPitchMode] = useState('hackathon'); 
  const [audienceType, setAudienceType] = useState('judges'); 

  // Slide Projector UI States
  const [presenting, setPresenting] = useState(!!forceProjector);
  const [generatingSlides, setGeneratingSlides] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generationError, setGenerationError] = useState(null);
  
  const [presentSlideIndex, setPresentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [showNotes, setShowNotes] = useState(!forceProjector);
  const [projectorView, setProjectorView] = useState('presentation'); // presentation, demo
  const [presentationTime, setPresentationTime] = useState(0); // in seconds

  // Voice Customization Controls
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [selectedVoiceName, setSelectedVoiceName] = useState("");
  const [availableVoices, setAvailableVoices] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceError, setVoiceError] = useState(null);

  // Layout sizing fullscreen refactoring variables
  const projectorRef = useRef(null);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const [notesWidth, setNotesWidth] = useState(25); // In % of viewport (15% to 30%)
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [mobileShowNotesDrawer, setMobileShowNotesDrawer] = useState(false);

  // Monitor Window Resize sizes
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const mobile = w <= 768;
      const tablet = w > 768 && w <= 1024;
      setIsMobile(mobile);
      setIsTablet(tablet);
      if (mobile) {
        setShowNotes(false);
      } else if (tablet) {
        setShowNotes(false);
      } else {
        if (forceProjector) {
          setShowNotes(false);
        } else {
          setShowNotes(true);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forceProjector]);

  // Monitor Fullscreen status triggers
  useEffect(() => {
    const handleFullscreenChange = () => {
      setNativeFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Drag handles for notes panel splitting (bound 15% - 30%)
  const startNotesResizing = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const percent = 100 - (e.clientX / window.innerWidth) * 100;
      const bounded = Math.max(15, Math.min(30, percent));
      setNotesWidth(bounded);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleNativeFullscreen = () => {
    if (!projectorRef.current) return;
    if (!document.fullscreenElement) {
      projectorRef.current.requestFullscreen().then(() => {
        setNativeFullscreen(true);
      }).catch(err => {
        console.error("Fullscreen request failed", err);
      });
    } else {
      document.exitFullscreen();
      setNativeFullscreen(false);
    }
  };

  // Load available speech voices on mount/changed
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const list = window.speechSynthesis.getVoices();
        setAvailableVoices(list);
        if (list.length > 0 && !selectedVoiceName) {
          const defaults = list.find(v => v.lang.startsWith('en-') && v.name.toLowerCase().includes('google')) || list.find(v => v.lang.startsWith('en-')) || list[0];
          setSelectedVoiceName(defaults.name);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoiceName]);

  // Interactive Live Demo States
  const [demoCommand, setDemoCommand] = useState("");
  const [demoLogs, setDemoLogs] = useState([
    "INVENZA REVIVAL RUNTIME v1.0.4 ACTIVE",
    "Type 'help' to see active diagnostic commands."
  ]);

  // Q&A practice states
  const [answers, setAnswers] = useState({ 0: "", 1: "", 2: "" });
  const [evaluating, setEvaluating] = useState({});
  const [evalResults, setEvalResults] = useState({});
  const [convictionScore, setConvictionScore] = useState(65);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Load Speech Recognition APIs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';
        rec.onstart = () => setIsRecording(true);
        rec.onend = () => setIsRecording(false);
        rec.onerror = () => setIsRecording(false);
        rec.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setAnswers(prev => ({
            ...prev,
            [activeQuestionIndex]: prev[activeQuestionIndex] 
              ? prev[activeQuestionIndex].trim() + ". " + text 
              : text
          }));
        };
        setRecognition(rec);
      }
    }
  }, [activeQuestionIndex]);

  // Presentation Timer
  useEffect(() => {
    let timer = null;
    if (presenting) {
      timer = setInterval(() => {
        setPresentationTime(prev => prev + 1);
      }, 1000);
    } else {
      setPresentationTime(0);
    }
    return () => clearInterval(timer);
  }, [presenting]);

  // --- DYNAMIC SLIDES GENERATION ENGINE (15 Slides) ---
  const generateSlidesList = () => {
    const name = activeItem.name || "Volumetric Light Field Display";
    const tech = activeItem.aiEnhancementVector?.[0] || "Edge AI NPUs";
    const bottleneck = activeItem.failureBottlenecks?.[0] || "obsolete hardware limitations";
    const cost = activeItem.financials?.estimatedCost || "₹350,000";
    const growth = activeItem.marketGrowth || "15.4% CAGR";
    const sector = activeItem.sector || "Display Technology";

    // Adaptive language focus depending on selected audience
    let hookText = `Pioneered as a cancelled asset in ${sector}, this project represents a massive untapped opportunity.`;
    let problemText = `The original implementation failed because of "${bottleneck}", keeping the Technology Readiness Level at TRL ${activeItem.readinessLevel || 4}.`;
    let gapText = `Existing solutions fail because foveated processing algorithms and Edge NPUs were not yet active during early testing.`;
    let marketText = `Targeting a high-growth sector expanding at ${growth}, offering a strong return profile.`;
    let businessText = `Establish early B2B developer licensing models to secure recurrent cashflows and protect proprietary SDK margins.`;

    if (audienceType === 'investors') {
      hookText = `A high-margin investment opportunity reviving ${name} for commercialization.`;
      problemText = `The legacy project collapsed due to high production overheads: "${bottleneck}".`;
      marketText = `Capitalizing on a sector expanding at ${growth}, aiming for seed round capitalization.`;
      businessText = `Requesting ${cost} in seed capital to secure Slide 8 monetization margins.`;
    } else if (audienceType === 'professors') {
      hookText = `An engineering review of diffractive relief waveguides in ${name} systems.`;
      problemText = `Foundational literature gap: "${bottleneck}". TRL is currently rated at ${activeItem.readinessLevel || 4}/9.`;
      gapText = `Prism glare and refractive aberrations remain unresolved in legacy papers.`;
      businessText = `Leverages published equations (Waveguide Refraction: η = 1.0 - (sin(θ)/n)) to bypass claims.`;
    }

    return [
      {
        id: 1,
        layout: 'cover',
        title: "Slide 1: Cover Slide",
        desc: `${name} Revival Framework`,
        detail: hookText,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="10" y="10" width="380" height="60" rx="6" fill="rgba(59,130,246,0.08)" stroke="var(--color-primary)" strokeWidth="1.5" />
            <text x="50%" y="45" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">REVIVAL BLUEPRINT: {name.toUpperCase()}</text>
          </svg>
        ),
        talkingPoints: ["Introduce team structure", "Present the target sector name", "Explain why the team is reviving this today"],
        notes: `Hello everyone. Today we are presenting the revival blueprint for ${name}. This technology belongs to the high-growth ${sector} sector. We are requesting a R&D seed capital of ${cost} to build the functional MVP.`,
        duration: "30s",
        animation: "Fade-in cover frame",
        questions: "What inspired your team to select this specific cancelled patent?",
        transition: "Next, we will look at the core historical bottleneck.",
        stats: `TRL: ${activeItem.readinessLevel || 4}/9`
      },
      {
        id: 2,
        layout: 'problem',
        title: "Slide 2: Problem Statement",
        desc: "Foundational Mechanical Bottleneck",
        detail: problemText,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <circle cx="200" cy="40" r="30" fill="rgba(239,68,68,0.1)" stroke="var(--color-danger)" strokeWidth="2" />
            <text x="200" y="44" dominantBaseline="middle" textAnchor="middle" fill="var(--color-danger)" fontSize="18" fontWeight="bold">!</text>
            <text x="200" y="76" dominantBaseline="middle" textAnchor="middle" fill="var(--text-muted)" fontSize="8">TRL LEVEL: {activeItem.readinessLevel || 4} / 9</text>
          </svg>
        ),
        talkingPoints: ["Detail the legacy engineering bottlenecks", "Explain the physical limitations of the era", "Show the historical cancellation date"],
        notes: `The main reason this technology was discarded was due to "${bottleneck}". This kept the early project locked at a low TRL rating, making commercial viability impossible until now.`,
        duration: "40s",
        animation: "Slide from left to highlight bottleneck",
        questions: "Why did previous developers fail to bypass this bottleneck?",
        transition: "Let us review how existing market solutions attempt to solve this.",
        stats: `TRL locked at level ${activeItem.readinessLevel || 4}`
      },
      {
        id: 3,
        layout: 'solutions-gap',
        title: "Slide 3: Existing Solutions",
        desc: "Why Previous Configurations Failed",
        detail: gapText,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <line x1="50" y1="40" x2="350" y2="40" stroke="var(--border-color)" strokeWidth="2" strokeDasharray="5,5" />
            <circle cx="100" cy="40" r="10" fill="var(--text-dim)" />
            <circle cx="200" cy="40" r="10" fill="var(--text-dim)" />
            <circle cx="300" cy="40" r="15" fill="var(--color-primary)" />
            <text x="300" y="43" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold">FIX</text>
          </svg>
        ),
        talkingPoints: ["Expose current market solutions", "Explain the cloud connection delay issues", "Detail the patent clash hazards of existing setups"],
        notes: `Current alternatives try to bypass this by pushing calculations to cloud servers. This creates massive latency, rendering it unusable for real-time safety critical applications.`,
        duration: "45s",
        animation: "Grid layout transition",
        questions: "How does your system guarantee safety-critical latency?",
        transition: "Now, let's look at our proposed AI-enabled wrap.",
        stats: "Refraction glare η > 30%"
      },
      {
        id: 4,
        layout: 'proposed-solution',
        title: "Slide 4: Proposed Solution",
        desc: "Invenza AI Tech Revival wrap",
        detail: `We bypass legacy limits by wrapping the core system with: - ${tech} - Local caching protocols.`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="50" y="15" width="120" height="50" rx="4" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
            <text x="110" y="40" textAnchor="middle" fill="var(--text-muted)" fontSize="10">Legacy Core</text>
            <path d="M 180 40 L 210 40" stroke="var(--color-primary)" strokeWidth="2" markerEnd="url(#arrow)" />
            <rect x="220" y="15" width="130" height="50" rx="4" fill="rgba(59,130,246,0.1)" stroke="var(--color-primary)" />
            <text x="285" y="40" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">Edge AI Revival</text>
          </svg>
        ),
        talkingPoints: ["Introduce the local software wrap", "Explain how local NPUs are leveraged", "Highlight the 82% viability metric"],
        notes: `Our solution is to wrap the legacy core with custom local ${tech} models. By running calculations directly on low-power chips, we achieve total offline operation.`,
        duration: "40s",
        animation: "Fade-in system solution block",
        questions: "Can this local model be updated dynamically?",
        transition: "Let's explore the operational architecture.",
        stats: "Revival index: 82%"
      },
      {
        id: 5,
        layout: 'features-grid',
        title: "Slide 5: Key Features",
        desc: "Core Operational Enhancements",
        detail: "94.2% ghosting reflection reduction; local weight loading calibrations; B2B licensing compliance.",
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="40" y="15" width="100" height="50" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="90" y="35" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">94.2%</text>
            <text x="90" y="52" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Ghosting Clear</text>
            <rect x="260" y="15" width="100" height="50" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="310" y="35" textAnchor="middle" fill="var(--color-success)" fontSize="12" fontWeight="bold">&lt; 12ms</text>
            <text x="310" y="52" textAnchor="middle" fill="var(--text-muted)" fontSize="8">PID Latency</text>
          </svg>
        ),
        talkingPoints: ["Present the main performance vectors", "Detail the hardware footprint optimizations", "Show the user interface responsive controls"],
        notes: `Key achievements include a 94.2% reduction in reflection glare and a responsive user dashboard showing telemetry in real-time.`,
        duration: "35s",
        animation: "Horizontal progress bars",
        questions: "What tests did you run to confirm the 94% reduction?",
        transition: "Here is the architectural schema mapping these loops.",
        stats: "Reflection reduction: 94.2%"
      },
      {
        id: 6,
        layout: 'architecture',
        title: "Slide 6: System Architecture",
        desc: "Edge-RAG Volumetric Routing Schema",
        detail: "Low-latency sensor telemetry loop running locally on device chips.",
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="20" y="25" width="80" height="30" rx="4" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
            <text x="60" y="43" textAnchor="middle" fill="var(--text-muted)" fontSize="9">Sensor Input</text>
            <path d="M 100 40 L 140 40" stroke="var(--color-primary)" strokeWidth="1.5" />
            <rect x="150" y="25" width="100" height="30" rx="4" fill="rgba(59,130,246,0.05)" stroke="var(--color-primary)" />
            <text x="200" y="43" textAnchor="middle" fill="#fff" fontSize="9">NPU Compressor</text>
            <path d="M 250 40 L 290 40" stroke="var(--color-secondary)" strokeWidth="1.5" />
            <rect x="300" y="25" width="80" height="30" rx="4" fill="rgba(0,242,254,0.05)" stroke="var(--color-secondary)" />
            <text x="340" y="43" textAnchor="middle" fill="#fff" fontSize="9">Local Buffer</text>
          </svg>
        ),
        talkingPoints: ["Walk through the sensor intake node", "Explain the local NPU routing logic", "Detail the data buffer safety cache"],
        notes: `The system processes sensor data locally in under 12 milliseconds. The data never leaves the local buffer, ensuring absolute compliance with security rules.`,
        duration: "50s",
        animation: "SVG flowchart trace line animation",
        questions: "What is the memory limit of your local cache buffer?",
        transition: "Next is the technology stack list supporting this schema.",
        stats: "Latency: < 12ms"
      },
      {
        id: 7,
        layout: 'tech-stack',
        title: "Slide 7: Technology Stack",
        desc: "Core Programming & Sourcing Stack",
        detail: `Coding: ${activeItem.gitLang || "Python / PyTorch"}. Sourced from repository ${activeItem.gitRepo || "WeiPhil/LightField Imaging"}.`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="30" y="20" width="100" height="40" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="80" y="44" textAnchor="middle" fill="var(--color-secondary)" fontSize="10" fontWeight="bold">CUDA / C++</text>
            <rect x="150" y="20" width="100" height="40" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="200" y="44" textAnchor="middle" fill="var(--color-secondary)" fontSize="10" fontWeight="bold">ESP32 SDK</text>
            <rect x="270" y="20" width="100" height="40" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="320" y="44" textAnchor="middle" fill="var(--color-secondary)" fontSize="10" fontWeight="bold">PyTorch</text>
          </svg>
        ),
        talkingPoints: ["List coding languages and libraries", "Describe physical processor requirements", "Show open source code source paths"],
        notes: `We build the system using ${activeItem.gitLang || "Python and CUDA"}. The model is heavily quantized to fit inside an 18MB compiled ESP32 firmware binary.`,
        duration: "30s",
        animation: "List layout fade-in",
        questions: "Why choose CUDA instead of standard OpenCL wrappers?",
        transition: "Let's look at the specific AI components.",
        stats: "Compiled binary: 18MB"
      },
      {
        id: 8,
        layout: 'ai-features',
        title: "Slide 8: AI Features",
        desc: "Quantized Local Weight Calibration",
        detail: `Using foveated NPU graphics processing to calibrate waveguide aberrations.`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="40" y="15" width="100" height="50" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="90" y="35" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">4-bit</text>
            <text x="90" y="52" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Quantization</text>
            <rect x="260" y="15" width="100" height="50" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="310" y="35" textAnchor="middle" fill="var(--color-success)" fontSize="12" fontWeight="bold">Foveated</text>
            <text x="310" y="52" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Rendering</text>
          </svg>
        ),
        talkingPoints: ["Detail model compression details", "Describe localized weight routing", "Outline self-correction capabilities"],
        notes: `We use foveated NPU graphics processing. The weights are compressed into 4-bit integer formats to prevent overheating of standard wearable batteries.`,
        duration: "35s",
        animation: "Pulsing radar visual circles",
        questions: "Does 4-bit quantization degrade the calibration accuracy?",
        transition: "We backed this design with patent freedom-to-operate checks.",
        stats: "Model weights: 4-bit quantized"
      },
      {
        id: 9,
        layout: 'patent-analysis',
        title: "Slide 9: Patent Analysis",
        desc: "Expired Claims Freedoms",
        detail: `Reviving expired patent register ${activeItem.patentId || "US-482011"}. Freedom-to-operate verified.`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="50" y="20" width="300" height="40" rx="4" fill="rgba(245,158,11,0.05)" stroke="var(--color-warning)" />
            <text x="200" y="44" textAnchor="middle" fill="var(--color-warning)" fontSize="11" fontWeight="bold">EXPIRED PATENT STATUS VERIFIED: SAFE TO REVIVE</text>
          </svg>
        ),
        talkingPoints: ["Show WIPO register status records", "State which specific claims are now expired", "Confirm no active patent clashes exist"],
        notes: `We verified that all 14 claims in register ${activeItem.patentId || "US-482011"} are expired. This gives us full freedom-to-operate without licensing friction.`,
        duration: "40s",
        animation: "Shield check overlay",
        questions: "Are there any pending continuation applications from the original patentee?",
        transition: "Let's examine academic research supporting this design.",
        stats: "Claims cleared: 14/14"
      },
      {
        id: 10,
        layout: 'research-support',
        title: "Slide 10: Research Support",
        desc: "Scientific Citations & DOIs",
        detail: `Referencing DOI ${activeItem.doi || "10.1145/LF"}. Validates mathematical refraction theories η = 1.0 - (sin(θ)/n).`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="50" y="25" width="300" height="35" rx="4" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
            <text x="200" y="46" textAnchor="middle" fill="var(--text-muted)" fontSize="9">η = 1.0 - (sin(θ)/n)</text>
          </svg>
        ),
        talkingPoints: ["Reference the primary research papers", "Show scientific waveguide refraction formulas", "Validate math proofs in current literature"],
        notes: `Our design is backed by diffractive relief waveguide formulas from DOI ${activeItem.doi || "10.1145/LF"}. Refraction calculations are verified mathematically.`,
        duration: "40s",
        animation: "LaTeX formula slide-in",
        questions: "How do you handle variance in refractive index calculations?",
        transition: "Let's review market opportunity growth matrices.",
        stats: "Citations: 24 articles"
      },
      {
        id: 11,
        layout: 'market-opportunity',
        title: "Slide 11: Market Opportunity",
        desc: "Sizing and Growth Matrix",
        detail: marketText,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="50" y="50" width="80" height="20" fill="var(--border-color)" />
            <rect x="160" y="30" width="80" height="40" fill="var(--color-primary)" />
            <rect x="270" y="10" width="80" height="60" fill="var(--color-secondary)" />
            <text x="90" y="45" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Legacy</text>
            <text x="200" y="25" textAnchor="middle" fill="#fff" fontSize="8">Current</text>
            <text x="310" y="5" textAnchor="middle" fill="#fff" fontSize="8">{growth}</text>
          </svg>
        ),
        talkingPoints: ["Present total addressable market sizing", "Describe the key target user groups", "Detail competitor segment gaps"],
        notes: `The target market is growing at a rate of ${growth}. The primary buyers are B2B hardware developers who need pre-packaged calibration modules.`,
        duration: "35s",
        animation: "Vertical bar chart heights",
        questions: "What is your customer acquisition cost strategy?",
        transition: "Here is the commercialization model.",
        stats: `${growth} target segment expansion`
      },
      {
        id: 12,
        layout: 'business-canvas',
        title: "Slide 12: Business Model",
        desc: "B2B Subscription & SDK licensing",
        detail: businessText,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="20" y="20" width="160" height="40" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="100" y="44" textAnchor="middle" fill="#fff" fontSize="10">SDK Subscription Node</text>
            <rect x="220" y="20" width="160" height="40" rx="4" fill="rgba(255,255,255,0.01)" stroke="var(--border-color)" />
            <text x="300" y="44" textAnchor="middle" fill="#fff" fontSize="10">Hardware Accessory Sales</text>
          </svg>
        ),
        talkingPoints: ["Expose recurring SaaS monetization paths", "Detail pricing plans for developers", "Outline the requested seed capital ask"],
        notes: `We license our calibration software as a recurring SDK subscription. We are raising ${cost} to build and pilot 100 prototype developer kits.`,
        duration: "40s",
        animation: "Pricing table highlights",
        questions: "How long is the payback period for developers using your SDK?",
        transition: "Let us look at our competitive advantages.",
        stats: `Ask: ${cost} Seed R&D Capital`
      },
      {
        id: 13,
        layout: 'swot-matrix',
        title: "Slide 13: Competitive Advantages",
        desc: "SWOT Moat Configurations",
        detail: `Strengths: ${activeItem.swot?.strengths?.[0] || "Low-power footprint"} | Opportunities: cloud-free offline security.`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="30" y="15" width="160" height="22" fill="rgba(52,211,153,0.08)" stroke="var(--color-success)" />
            <text x="110" y="29" textAnchor="middle" fill="var(--color-success)" fontSize="9">S: Low-power footprint</text>
            <rect x="210" y="15" width="160" height="22" fill="rgba(239,68,68,0.08)" stroke="var(--color-danger)" />
            <text x="290" y="29" textAnchor="middle" fill="var(--color-danger)" fontSize="9">W: Calibration overhead</text>
            <rect x="30" y="45" width="160" height="22" fill="rgba(59,130,246,0.08)" stroke="var(--color-primary)" />
            <text x="110" y="59" textAnchor="middle" fill="var(--color-primary)" fontSize="9">O: Cloud API interfaces</text>
            <rect x="210" y="45" width="160" height="22" fill="rgba(245,158,11,0.08)" stroke="var(--color-warning)" />
            <text x="290" y="59" textAnchor="middle" fill="var(--color-warning)" fontSize="9">T: Competitor clones</text>
          </svg>
        ),
        talkingPoints: ["Show the strength moats", "Detail cloud-free data isolation advantages", "Address competitor cloning defenses"],
        notes: `Our major strength is our low-power footprint and offline design. Competitors require active internet connections, which is a major security risk.`,
        duration: "35s",
        animation: "SWOT matrix grid overlay",
        questions: "How easily can a competitor clone your offline firmware?",
        transition: "Finally, let's explore future scoping.",
        stats: "Moat efficiency: 88%"
      },
      {
        id: 14,
        layout: 'future-roadmap',
        title: "Slide 14: Future Scope",
        desc: "Product Roadmaps & Expansion Paths",
        detail: "Upgrading into 3D Gaussian Splatting volumetric models and decentralized sensor mesh nodes.",
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <circle cx="60" cy="40" r="10" fill="var(--color-primary)" />
            <line x1="70" y1="40" x2="150" y2="40" stroke="var(--color-primary)" strokeWidth="2" />
            <circle cx="160" cy="40" r="10" fill="var(--color-secondary)" />
            <line x1="170" y1="40" x2="250" y2="40" stroke="var(--color-secondary)" strokeWidth="2" />
            <circle cx="260" cy="40" r="10" fill="var(--color-success)" />
            <text x="60" y="65" textAnchor="middle" fill="var(--text-muted)" fontSize="8">NPU MVP</text>
            <text x="160" y="65" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Splatting 3D</text>
            <text x="260" y="65" textAnchor="middle" fill="var(--text-muted)" fontSize="8">Decentralized Mesh</text>
          </svg>
        ),
        talkingPoints: ["Detail next major technical upgrades", "Show the 18-month engineering roadmap", "Highlight secondary market paths"],
        notes: `Over the next 18 months, we plan to implement 3D Gaussian Splatting to support high-fidelity holographic volumetric projections.`,
        duration: "40s",
        animation: "Linear timeline trace path",
        questions: "What GPU specs are needed for the 3D Splatting phase?",
        transition: "Let us conclude the presentation.",
        stats: "Timeline: 18 months roadmap"
      },
      {
        id: 15,
        layout: 'thank-you',
        title: "Slide 15: Thank You",
        desc: `Revive, Optimize, Scale — ${name}`,
        detail: `Contact: team@invenza.edu | Required Budget: ${cost}`,
        svg: (
          <svg width="100%" height="80" viewBox="0 0 400 80">
            <rect x="100" y="15" width="200" height="50" rx="6" fill="rgba(255,255,255,0.02)" stroke="var(--border-color)" />
            <text x="200" y="40" textAnchor="middle" fill="#fff" fontSize="13" fontWeight="bold">THANK YOU</text>
            <text x="200" y="54" textAnchor="middle" fill="var(--text-muted)" fontSize="8">QUESTIONS?</text>
          </svg>
        ),
        talkingPoints: ["Summarize the seed funding ask", "Provide contact channels", "Invite panel questions"],
        notes: `Thank you for your time. We are ready to take your questions regarding ${name}.`,
        duration: "30s",
        animation: "Fade out cover frame",
        questions: "Any final questions from the judges?",
        transition: "End of presentation.",
        stats: "Invenza Presentation Engine"
      }
    ];
  };

  const slidesList = generateSlidesList();

  const tempo = audienceType === 'investors' || audienceType === 'incubators'
    ? "150 WPM (Vibrant & punchy)"
    : audienceType === 'professors' || audienceType === 'experts'
    ? "130 WPM (Deliberate & academic)"
    : "140 WPM (Steady & clear)";

  const tone = audienceType === 'investors' || audienceType === 'incubators'
    ? "Persuasive & value-focused"
    : audienceType === 'professors' || audienceType === 'experts'
    ? "Highly technical & precise"
    : "Professional & analytical";

  const getActiveScript = () => {
    const name = activeItem.name || "Ng, R. & Levoy, M.";
    const tech = activeItem.aiEnhancementVector?.[0] || "Edge AI NPUs";
    const bottleneck = activeItem.failureBottlenecks?.[0] || "obsolete hardware limitations";
    const cost = activeItem.financials?.estimatedCost || "₹350,000";
    const growth = activeItem.marketGrowth || "15.4% CAGR";
    
    if (pitchMode === 'elevator') {
      return `Hey! Did you know ${name} was filed years ago but failed due to ${bottleneck}? Today, we bypass this completely by running local ${tech} models on devices. With ${growth} market growth, this is a massive B2B licensing opportunity requiring just ${cost} in seed to MVP. Let's build it!`;
    }
    if (pitchMode === 'investor') {
      return `Good morning, partners. We are commercializing the expired patent asset of ${name}. By replacing legacy processing limits with proprietary ${tech} pipelines, we eliminate the historical overhead of ${bottleneck}. We are raising ${cost} to build our foveated ADAS prototype. The return profiles are backed by ${growth} growth metrics.`;
    }
    if (pitchMode === 'viva') {
      return `Respected professors. This project details the engineering revival design of ${name}. We address the primary literature gap: "${bottleneck}". Our research methodology builds a local ${tech} processing architecture. Testing indicates a stabilization response time under 12 milliseconds, validating our MVP parameters.`;
    }
    return `Hello judges. Today we present the revival of ${name}. The original project failed because of ${bottleneck}, leaving the Technology Readiness Level locked at TRL 4. Our solution? We inject decentralized ${tech} edge systems. We are expanding inside a high-growth market, and we've verified an 82% revival index. Let's make it happen!`;
  };
  const activeScript = getActiveScript();

  const evaluations = [
    { label: "Clarity", score: pitchMode === 'elevator' ? 95 : 85, desc: "Easy to follow; structured logic flow." },
    { label: "Innovation", score: activeItem.revivalViability || 82, desc: "High. Leverages expired patents cleanly." },
    { label: "Technical Depth", score: pitchMode === 'viva' ? 92 : 80, desc: "Leverages local NPU configurations." },
    { label: "Business Moat", score: audienceType === 'investors' ? 88 : 75, desc: "B2B licensing model is scalable." },
    { label: "Storytelling", score: 86, desc: "Hooks attention with historical failures." },
    { label: "Persuasiveness", score: 84, desc: "Strong backing evidence." }
  ];

  const practiceQuestions = [
    { id: 0, question: `How exactly does your modern team bypass the legacy constraint of "${activeItem.failureBottlenecks?.[0] || 'high capital barrier'}" in this configuration?`, helper: "Highlight modern AI or software upgrades (like Edge AI NPU chips or cloud scale frameworks)." },
    { id: 1, question: `What defensive IP moat are you building for ${activeItem.name} to prevent clone entries in the market?`, helper: "Focus on proprietary SDK licenses, local datasets, or unique integrations." },
    { id: 2, question: `If partners grant the cost estimate of ${activeItem.financials?.estimatedCost || "₹350,000"}, what are the specific milestones for Phase 1 and 2?`, helper: "Discuss wireframing, MVP validation, and testing schedules." }
  ];

  const handleStartRecording = () => {
    if (!recognition) {
      alert("Voice speech-to-text recognition is not supported in this browser. Please practice in Chrome or Edge.");
      return;
    }
    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.warn("Speech recognition already running.");
      }
    }
  };

  const speakCurrentSlide = (index) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setVoiceError("Voice narration is temporarily unavailable in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    setSpeaking(false);
    
    if (isMuted) {
      if (isPlaying) {
        const timer = setTimeout(() => {
          if (presentSlideIndex < slidesList.length - 1) {
            setPresentSlideIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 6000);
        return () => clearTimeout(timer);
      }
      return;
    }

    setTimeout(() => {
      const slide = slidesList[index];
      if (!slide) return;
      const text = slide.notes;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = voiceVolume;
      utterance.rate = voiceRate;
      if (selectedVoiceName) {
        const voices = window.speechSynthesis.getVoices();
        const match = voices.find(v => v.name === selectedVoiceName);
        if (match) utterance.voice = match;
      }
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (isPlaying && index < slidesList.length - 1) {
          setPresentSlideIndex(prev => prev + 1);
        } else if (isPlaying && index === slidesList.length - 1) {
          setIsPlaying(false);
        }
      };
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  // Sync vocal synthesis loops
  useEffect(() => {
    if (presenting) {
      speakCurrentSlide(presentSlideIndex);
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [presentSlideIndex, presenting, voiceVolume, voiceRate, selectedVoiceName, isMuted]);

  // Keyboard controls listener (Feature 4)
  const handleExit = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    if (onExitPresentation) {
      onExitPresentation();
    } else {
      setPresenting(false);
    }
  };

  useEffect(() => {
    if (!presenting) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setPresentSlideIndex(prev => Math.min(slidesList.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setPresentSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presenting, slidesList]);

  // Slide Generator Loader
  const handleLaunchProjector = async () => {
    setGeneratingSlides(true);
    setGenerationError(null);
    const steps = [
      "Analyzing Project...",
      "Generating Slides...",
      "Generating Speaker Notes...",
      "Starting Presentation..."
    ];
    for (let i = 0; i < steps.length; i++) {
      setGenerationStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    if (!activeItem.name) {
      setGenerationError("Presentation generation failed. Missing project context payload.");
      setGeneratingSlides(false);
      return;
    }
    setGeneratingSlides(false);
    setPresentSlideIndex(0);
    const id = activeItem.patentId || activeItem.name.replace(/\s+/g, '_').toLowerCase();
    if (onLaunchPresentation) {
      onLaunchPresentation(id);
    } else {
      setPresenting(true);
    }
  };

  const handleRunDemoCommand = (e) => {
    e.preventDefault();
    if (!demoCommand.trim()) return;
    const cmd = demoCommand.trim().toLowerCase();
    let res = "";
    if (cmd === 'help') {
      res = "Available commands: 'help', 'analyze', 'compile', 'moat', 'clear'.";
    } else if (cmd === 'analyze') {
      res = `Analyzing ${activeItem.name}... Done. Revival score is 85%.`;
    } else if (cmd === 'compile') {
      res = `Compiling localized telemetry buffer... Success. Latency = 11.4ms.`;
    } else if (cmd === 'moat') {
      res = `Checking active claims... Evasion vectors: 100% clean.`;
    } else if (cmd === 'clear') {
      setDemoLogs([]);
      setDemoCommand("");
      return;
    } else {
      res = `Command '${cmd}' not recognized.`;
    }
    setDemoLogs(prev => [...prev, `> ${demoCommand}`, res]);
    setDemoCommand("");
  };

  // PPTX Outlines
  const handleDownloadPPTX = () => {
    let content = `INVENZA PRESENTATION OUTLINE: ${activeItem.name.toUpperCase()}\n\n`;
    slidesList.forEach(s => {
      content += `SLIDE ${s.id}: ${s.title}\nDetails: ${s.detail}\nNotes: ${s.notes}\n\n`;
    });
    const file = new Blob([content], { type: 'text/plain' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${activeItem.name.replace(/\s+/g, '_')}_presentation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Teleprompter Scripts (.md)
  const handleDownloadScript = () => {
    let content = `INVENZA PRESENTATION SCRIPT\nProject: ${activeItem.name}\n\n`;
    slidesList.forEach(s => {
      content += `--- Slide ${s.id} ---\n"${s.notes}"\n\n`;
    });
    const file = new Blob([content], { type: 'text/markdown' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${activeItem.name.replace(/\s+/g, '_')}_speaking_script.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Speaker notes guides
  const handleDownloadSpeakerNotes = () => {
    let content = `INVENZA SPEAKER NOTES GUIDE\n\n`;
    slidesList.forEach(s => {
      content += `SLIDE ${s.id}: ${s.title}\nTransition: ${s.transition}\nNotes:\n${s.notes}\n\n`;
    });
    const file = new Blob([content], { type: 'text/plain' });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = `${activeItem.name.replace(/\s+/g, '_')}_speaker_notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleToggleSpeech = () => {
    if (speaking) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    } else {
      speakCurrentSlide(presentSlideIndex);
    }
  };

  const submitAnswer = async (qIdx) => {
    const answerText = answers[qIdx];
    if (!answerText || answerText.trim().length < 8) {
      alert("Please provide a longer answer before submitting!");
      return;
    }
    setEvaluating(prev => ({ ...prev, [qIdx]: true }));
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pitch-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: activeItem.name, question: practiceQuestions[qIdx].question, answer: answerText })
      });
      const data = await response.json();
      if (data.success) {
        setEvalResults(prev => ({ ...prev, [qIdx]: { score: data.score, feedback: data.feedback } }));
        setConvictionScore(prev => Math.min(100, Math.max(0, prev + data.convictionChange)));
      }
    } catch (e) {
      const score = Math.min(94, 72 + Math.floor(Math.random() * 20));
      setEvalResults(prev => ({
        ...prev,
        [qIdx]: { score, feedback: "Dynamic offline assessment: Good job validating milestones. Focus on edge NPU specs." }
      }));
      setConvictionScore(prev => Math.min(100, Math.max(0, prev + 5)));
    } finally {
      setEvaluating(prev => ({ ...prev, [qIdx]: false }));
    }
  };

  // --- RENDER DYNAMIC standalone PresentationViewer PAGE ---
  if (presenting) {
    return (
      <PresentationViewer
        projectorRef={projectorRef}
        presentSlideIndex={presentSlideIndex}
        setPresentSlideIndex={setPresentSlideIndex}
        slidesList={slidesList}
        audienceType={audienceType}
        projectorView={projectorView}
        setProjectorView={setProjectorView}
        isMobile={isMobile}
        showNotes={showNotes}
        setShowNotes={setShowNotes}
        notesWidth={notesWidth}
        startNotesResizing={startNotesResizing}
        isDragging={isDragging}
        presentationTime={presentationTime}
        tempo={tempo}
        demoLogs={demoLogs}
        demoCommand={demoCommand}
        setDemoCommand={setDemoCommand}
        handleRunDemoCommand={handleRunDemoCommand}
        availableVoices={availableVoices}
        selectedVoiceName={selectedVoiceName}
        setSelectedVoiceName={setSelectedVoiceName}
        voiceVolume={voiceVolume}
        setVoiceVolume={setVoiceVolume}
        voiceRate={voiceRate}
        setVoiceRate={setVoiceRate}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        speaking={speaking}
        handleToggleSpeech={handleToggleSpeech}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        nativeFullscreen={nativeFullscreen}
        toggleNativeFullscreen={toggleNativeFullscreen}
        mobileShowNotesDrawer={mobileShowNotesDrawer}
        setMobileShowNotesDrawer={setMobileShowNotesDrawer}
        handleExit={handleExit}
        speakCurrentSlide={speakCurrentSlide}
      />
    );
  }

  // --- STANDARD COORDINATOR VIEW RENDER ---
  const renderViewContent = () => {
    switch (activeView) {
      case 'generator':
        return (
          <PitchGenerator 
            pitchMode={pitchMode}
            setPitchMode={setPitchMode}
            audienceType={audienceType}
            setAudienceType={setAudienceType}
            activeScript={activeScript}
            tempo={tempo}
            tone={tone}
            onBack={() => setActiveView('dashboard')}
            onSavePitch={() => alert("Pitch configurations saved successfully!")}
          />
        );
      case 'practice':
        return (
          <PracticeMode 
            slidesList={slidesList}
            onBack={() => setActiveView('dashboard')}
            onLaunchProjector={handleLaunchProjector}
            onSelectSlide={(idx) => { setPresentSlideIndex(idx); handleLaunchProjector(); }}
          />
        );
      case 'simulator':
        return (
          <JudgeSimulator 
            practiceQuestions={practiceQuestions}
            activeQuestionIndex={activeQuestionIndex}
            setActiveQuestionIndex={setActiveQuestionIndex}
            answers={answers}
            setAnswers={setAnswers}
            isRecording={isRecording}
            handleStartRecording={handleStartRecording}
            submitAnswer={submitAnswer}
            evaluating={evaluating}
            evalResults={evalResults}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'evaluator':
        return (
          <PitchEvaluator 
            evaluations={evaluations}
            convictionScore={convictionScore}
            onBack={() => setActiveView('dashboard')}
          />
        );
      case 'exporter':
        return (
          <ExportCenter 
            activeItem={activeItem}
            onBack={() => setActiveView('dashboard')}
            handleDownloadPPTX={handleDownloadPPTX}
            handleDownloadSpeakerNotes={handleDownloadSpeakerNotes}
            handleDownloadScript={handleDownloadScript}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            activeItem={activeItem}
            pitchMode={pitchMode}
            audienceType={audienceType}
            convictionScore={convictionScore}
            historyList={historyList}
            tempo={tempo}
            tone={tone}
            onSwitchView={setActiveView}
            onLaunchProjector={handleLaunchProjector}
          />
        );
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* HUD navigation headers (Not displayed inside standalone presentation) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div style={{ textAlign: 'left' }}>
          <span className="mono-tag" style={{ color: 'var(--color-secondary)' }}>AI PRESENTATION MENTOR</span>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', margin: '0.25rem 0 0 0', fontWeight: 800 }}>AI Pitch & Presenter</h2>
        </div>

        {/* HUD Sub-tabs */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '6px' }}>
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'generator', label: 'Pitch Generator' },
            { id: 'practice', label: 'Practice Guide' },
            { id: 'simulator', label: 'Judge Simulator' },
            { id: 'evaluator', label: 'Evaluator' },
            { id: 'exporter', label: 'Export Center' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              style={{
                background: activeView === tab.id ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                padding: '0.45rem 0.85rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render sub-view */}
      {renderViewContent()}

    </div>
  );
};

// React Error Boundary Class Component
class PitchCoachErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '450px',
          background: 'var(--bg-panel-solid)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2.5rem',
          margin: '2rem auto',
          maxWidth: '650px',
          color: 'var(--text-main)',
          fontFamily: 'var(--font-sans)',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(239, 68, 68, 0.15)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
            Unable to generate presentation.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.75rem' }}>
            The presentation engine failed to initialize or build the dynamic slides matrix context.
          </p>
          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button onClick={this.handleReset} className="tech-button" style={{ fontSize: '0.8rem', padding: '0.55rem 1.25rem' }}>
              Retry Rendering
            </button>
            <button onClick={() => window.location.reload()} className="tech-button tech-button-outline" style={{ fontSize: '0.8rem', padding: '0.55rem 1.25rem' }}>
              Regenerate
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const WrappedPitchCoach = (props) => (
  <PitchCoachErrorBoundary>
    <PitchCoach {...props} />
  </PitchCoachErrorBoundary>
);

export default WrappedPitchCoach;
