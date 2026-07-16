import React, { createContext, useState, useContext, useEffect } from 'react';
import { useSearch } from './SearchContext';

const PortalContext = createContext();

export const usePortal = () => useContext(PortalContext);

export const PortalProvider = ({ children }) => {
  const { query, activeInnovation } = useSearch();

  // Portal selector state: 'student' or 'business'
  const [portalMode, setPortalMode] = useState('student');

  // Student guided steps (1 to 14)
  const studentStages = [
    { id: 1, name: "Identify the Problem", desc: "Formulate a concrete problem statement based on expired patents." },
    { id: 2, name: "Market Research", desc: "Determine technical constraints and target user base." },
    { id: 3, name: "Patent & Paper Audit", desc: "Locate verified academic publications and expired patents." },
    { id: 4, name: "Compare Existing Solutions", desc: "Contrast legacy failures with current commercial versions." },
    { id: 5, name: "Define Unique Features", desc: "Isolate the AI enabler or hardware layout that fixes the legacy gap." },
    { id: 6, name: "System Architecture", desc: "Create system flowchart structures and data pathways." },
    { id: 7, name: "UI Design", desc: "Draft screen coordinates and wireframe layouts." },
    { id: 8, name: "Create Backend Router", desc: "Setup API routes and local database structures." },
    { id: 9, name: "Integrate External APIs", desc: "Connect Wikipedia search filters and GitHub repositories." },
    { id: 10, name: "Test the Application", desc: "Verify hot reloading and solve syntax ReferenceErrors." },
    { id: 11, name: "Prepare Documentation", desc: "Compile project abstracts, methodologies, and limitations." },
    { id: 12, name: "Create Presentation Slides", desc: "Draft pitch blueprints and highlight the technical moat." },
    { id: 13, name: "Prepare Demo Video", desc: "Record UI flows and illustrate fallback safety loops." },
    { id: 14, name: "Submission Ready", desc: "Verify bundle files and prepare final submission codes." }
  ];

  // Business guided steps (1 to 12)
  const businessStages = [
    { id: 1, name: "Idea Validation", desc: "Check business idea feasibility against live patent registers." },
    { id: 2, name: "Market Research", desc: "Calculate Total Addressable Market (TAM) using dynamic indices." },
    { id: 3, name: "Customer Discovery", desc: "Conduct target user interviews to catalog legacy friction." },
    { id: 4, name: "Business Model Canvas", desc: "Formulate revenue streams and key collaborator frameworks." },
    { id: 5, name: "Prototype Design", desc: "Construct a static mock mockup displaying core telemetry metrics." },
    { id: 6, name: "MVP Scope Setup", desc: "Isolate the core minimum viable features needed to prove the moat." },
    { id: 7, name: "User Testing Loops", desc: "Gather user feedback on prototype metrics and navigation." },
    { id: 8, name: "Product Launch", desc: "Deploy online and set live API request throttles." },
    { id: 9, name: "Early Growth Marketing", desc: "Promote B2B developer kit licensing models." },
    { id: 10, name: "Scaling Operations", desc: "Migrate local databases to serverless scaling pools." },
    { id: 11, name: "Investment Readiness", desc: "Compile investment scores, growth forecasts, and risk matrices." },
    { id: 12, name: "Market Expansion", desc: "Formulate scaling plans into adjacent tech categories." }
  ];

  const [studentCompleted, setStudentCompleted] = useState(new Set([1]));
  const [businessCompleted, setBusinessCompleted] = useState(new Set([1]));
  const [studentStep, setStudentStep] = useState(1);
  const [businessStep, setBusinessStep] = useState(1);

  // AI Advice HUD State
  const [advice, setAdvice] = useState({
    message: "Welcome! To begin your innovation journey, identify the core problem statement.",
    nextTask: "Identify the problem statement",
    reason: "Formulating a clear problem based on historical bottlenecks ensures your project is focused.",
    time: "2 hours",
    difficulty: "Medium",
    resources: ["WIPO Classification Maps", "Lost Innovation Search Console"]
  });

  // Business Validation Report State
  const [startupReport, setStartupReport] = useState(null);
  const [startupLoading, setStartupLoading] = useState(false);
  const [startupError, setStartupError] = useState(null);

  const fetchStartupValidation = async (titleText) => {
    setStartupLoading(true);
    setStartupError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/startup-validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: titleText })
      });
      const data = await res.json();
      if (data.success) {
        setStartupReport(data.report);
      } else {
        setStartupError(data.message);
        setStartupReport(null);
      }
    } catch (err) {
      console.error(err);
      setStartupError("Verified information is currently unavailable from trusted sources.");
      setStartupReport(null);
    } finally {
      setStartupLoading(false);
    }
  };

  // Sync startup validation when active search item shifts
  useEffect(() => {
    if (activeInnovation) {
      fetchStartupValidation(activeInnovation.name);
    } else if (query && query.trim().length >= 3) {
      fetchStartupValidation(query);
    }
  }, [activeInnovation]);

  // Compute overall progress rate
  const studentProgress = Math.round((studentCompleted.size / studentStages.length) * 100);
  const businessProgress = Math.round((businessCompleted.size / businessStages.length) * 100);

  // Generate dynamic step-by-step guidance based on current step completion
  const generateStepAdvice = (portal, stepId) => {
    if (portal === 'student') {
      switch (stepId) {
        case 1:
          return {
            message: "Excellent. The problem statement is complete. Next, conduct market research.",
            nextTask: "Conduct Market Research",
            reason: "Verifies the scale of your target user segment and document initial deployment blockers.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["Google Patents Lookup Guidelines", "Academic Literature Search"]
          };
        case 2:
          return {
            message: "Great. Now search for similar projects, patents, and research papers.",
            nextTask: "Patent & Paper Audit",
            reason: "Identifies existing technologies in the public domain to prevent legal conflicts.",
            time: "4 hours",
            difficulty: "High",
            resources: ["arXiv Publication Registries", "WIPO Patent Index Search"]
          };
        case 3:
          return {
            message: "Good. Now compare existing solutions.",
            nextTask: "Compare Existing Solutions",
            reason: "Pinpoints exactly why previous hardware or software architectures crashed historically.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["SWOT Strategy Templates", "Historical Bottlenecks Database"]
          };
        case 4:
          return {
            message: "Excellent. Now define unique features.",
            nextTask: "Define Unique Features & Moat",
            reason: "Establishes your project's technical advantage (e.g. Edge AI local processors).",
            time: "2 hours",
            difficulty: "Medium",
            resources: ["TinyML Hardware Documentation", "Edge Computing Protocols"]
          };
        case 5:
          return {
            message: "Now prepare system architecture.",
            nextTask: "System Architecture Blueprinting",
            reason: "Draws data flowcharts and verifies API integrations before coding.",
            time: "4 hours",
            difficulty: "High",
            resources: ["Mermaid.js Flowchart Guide", "System Ingress Frameworks"]
          };
        case 6:
          return {
            message: "Now design the UI.",
            nextTask: "UI Layout Structuring",
            reason: "Designs clean screens using Inter font families and corporate obsidian variables.",
            time: "3 hours",
            difficulty: "Low",
            resources: ["Obsidian Palette Blueprint", "Figma Coordinate Specs"]
          };
        case 7:
          return {
            message: "Now create the backend.",
            nextTask: "Create Backend Router Paths",
            reason: "Sets up Express servers and registers API endpoints.",
            time: "5 hours",
            difficulty: "High",
            resources: ["Express Routing Tutorials", "Node Module Structures"]
          };
        case 8:
          return {
            message: "Now integrate APIs.",
            nextTask: "Integrate External APIs",
            reason: "Wires Wikipedia query checks and GitHub codebase search queries.",
            time: "4 hours",
            difficulty: "High",
            resources: ["Wikipedia REST API Rules", "GitHub Octokit Docs"]
          };
        case 9:
          return {
            message: "Now test the application.",
            nextTask: "Perform API & Flow Testing",
            reason: "Ensures stable communication and resolves ReferenceErrors in the browser console.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["Vite HMR logs Guide", "Console Debugging Checklist"]
          };
        case 10:
          return {
            message: "Now prepare documentation.",
            nextTask: "Compile Documentation",
            reason: "Compiles project abstracts, methodology plans, and limitations markdown.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["AI Documentation Generator Tab", "README.md Blueprints"]
          };
        case 11:
          return {
            message: "Now create presentation slides.",
            nextTask: "Create Presentation Slides Outline",
            reason: "Drafts a compelling slide layout highlighting your innovation's viability.",
            time: "2 hours",
            difficulty: "Low",
            resources: ["Slides Presentation blue prints", "Pitch Simulators"]
          };
        case 12:
          return {
            message: "Prepare demo video.",
            nextTask: "Record Prototype Demo Video",
            reason: "Showcases dynamic UI metrics, dashboard graphs, and fallback loops.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["Screen Recording Best Practices", "Demo Script Templates"]
          };
        case 13:
          return {
            message: "Congratulations! Your project is ready for submission.",
            nextTask: "Submit Final Project Bundle",
            reason: "Verifies git repo files are tracked and compiles final bundle codes.",
            time: "1 hour",
            difficulty: "Low",
            resources: ["Git Commit Guidelines", "Build Checklists"]
          };
        default:
          return {
            message: "Project is complete! Prepare for showcase presentations.",
            nextTask: "Showcase Prototype",
            reason: "Shares your innovation with technical judges and college advisors.",
            time: "N/A",
            difficulty: "Low",
            resources: ["Hackathons survival guidelines"]
          };
      }
    } else {
      // Business Portal Advice
      switch (stepId) {
        case 1:
          return {
            message: "Great. Now validate market size and TAM.",
            nextTask: "TAM & Market Research",
            reason: "Quantifies addressable market segments using industry growth indexes.",
            time: "4 hours",
            difficulty: "High",
            resources: ["Market Sizing Spreadsheet", "CAGR Growth Metrics"]
          };
        case 2:
          return {
            message: "Excellent. Now conduct customer discovery interviews.",
            nextTask: "Customer Discovery",
            reason: "Collects feedback to document user friction with legacy alternatives.",
            time: "5 hours",
            difficulty: "Medium",
            resources: ["Discovery Script Templates", "Interview Question Lists"]
          };
        case 3:
          return {
            message: "Now map your Business Model Canvas.",
            nextTask: "Formulate Business Model Canvas",
            reason: "Defines key revenue streams and licensing models.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["Business Model Canvas Blueprints", "Licensing Calculators"]
          };
        case 4:
          return {
            message: "Now design the initial prototype.",
            nextTask: "Design Interactive Prototype",
            reason: "Constructs a static user interface displaying core telemetry charts.",
            time: "4 hours",
            difficulty: "Medium",
            resources: ["Figma Prototype Blueprints", "Dashboard templates"]
          };
        case 5:
          return {
            message: "Now define your MVP scope.",
            nextTask: "Isolate MVP Features",
            reason: "Focuses resources on core enablers to prove the business moat.",
            time: "3 hours",
            difficulty: "Low",
            resources: ["MVP Feature Sorter", "Product Backlog Guides"]
          };
        case 6:
          return {
            message: "Now execute user testing loops.",
            nextTask: "Run MVP Testing Loops",
            reason: "Collects data on user interaction and resolves styling bugs.",
            time: "4 hours",
            difficulty: "Medium",
            resources: ["User Testing Feedback Forms", "Bug Tracker logs"]
          };
        case 7:
          return {
            message: "Now launch the product MVP.",
            nextTask: "Deploy MVP to Staging",
            reason: "launches the MVP and monitors real-time telemetry inputs.",
            time: "3 hours",
            difficulty: "High",
            resources: ["Staging Deployment Guides", "API Throttle Setups"]
          };
        case 8:
          return {
            message: "Now establish early growth marketing.",
            nextTask: "Early Growth Marketing",
            reason: "Promotes B2B licensing packages to startup developer fleets.",
            time: "4 hours",
            difficulty: "Medium",
            resources: ["B2B Sales Blueprints", "Licensing agreement models"]
          };
        case 9:
          return {
            message: "Now scale operational databases.",
            nextTask: "Scale Infrastructure Nodes",
            reason: "Migrates local databases to auto-scaling server pools.",
            time: "5 hours",
            difficulty: "High",
            resources: ["AWS / Cloud Sharding Guides", "Database indexing templates"]
          };
        case 10:
          return {
            message: "Now compile investment readiness.",
            nextTask: "Generate Investment Pitch Deck",
            reason: "Compiles startup health scores and growth predictions.",
            time: "3 hours",
            difficulty: "Medium",
            resources: ["Investment Pitch Templates", "Revenue Forecast sheets"]
          };
        case 11:
          return {
            message: "Now initiate adjacent expansion.",
            nextTask: "Market Expansion Strategy",
            reason: "Expands tech features into adjacent sectors (e.g. Bio-Diagnostics to general health logs).",
            time: "4 hours",
            difficulty: "High",
            resources: ["Market Expansion Maps", "Partnership agreement forms"]
          };
        default:
          return {
            message: "Startup validation complete! Prepared for VC funding rounds.",
            nextTask: "Schedule Pitch Meetings",
            reason: "Presents investment metrics to target technology venture capital groups.",
            time: "N/A",
            difficulty: "Medium",
            resources: ["Startup Pitch simulators"]
          };
      }
    }
  };

  const completeCurrentStep = () => {
    if (portalMode === 'student') {
      const nextStepId = studentStep + 1;
      setStudentCompleted(prev => new Set([...prev, nextStepId]));
      setStudentStep(nextStepId);
      const nextAdvice = generateStepAdvice('student', studentStep);
      setAdvice({
        ...nextAdvice,
        message: nextAdvice.message
      });
    } else {
      const nextStepId = businessStep + 1;
      setBusinessCompleted(prev => new Set([...prev, nextStepId]));
      setBusinessStep(nextStepId);
      const nextAdvice = generateStepAdvice('business', businessStep);
      setAdvice({
        ...nextAdvice,
        message: nextAdvice.message
      });
    }
  };

  const resetWorkflow = () => {
    setStudentCompleted(new Set([1]));
    setBusinessCompleted(new Set([1]));
    setStudentStep(1);
    setBusinessStep(1);
    setAdvice({
      message: "Welcome! To begin your innovation journey, identify the core problem statement.",
      nextTask: "Identify the problem statement",
      reason: "Formulating a clear problem based on historical bottlenecks ensures your project is focused.",
      time: "2 hours",
      difficulty: "Medium",
      resources: ["WIPO Classification Maps", "Lost Innovation Search Console"]
    });
  };

  // Sync advisor message when portal mode changes
  useEffect(() => {
    const activeStep = portalMode === 'student' ? studentStep : businessStep;
    const adviceIndex = activeStep - 1;
    const nextAdvice = generateStepAdvice(portalMode, adviceIndex > 0 ? adviceIndex : 1);
    setAdvice(nextAdvice);
  }, [portalMode]);

  return (
    <PortalContext.Provider value={{
      portalMode,
      setPortalMode,
      studentStages,
      businessStages,
      studentStep,
      businessStep,
      studentCompleted,
      businessCompleted,
      studentProgress,
      businessProgress,
      advice,
      completeCurrentStep,
      resetWorkflow,
      startupReport,
      startupLoading,
      startupError,
      fetchStartupValidation
    }}>
      {children}
    </PortalContext.Provider>
  );
};
