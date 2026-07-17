import React, { useState, useEffect } from 'react';


const MyProjects = ({ activeInnovation, setActiveInnovation }) => {
  // Predefined checklists per sector to dynamically assign checklist milestones
  const projectChecklists = {
    "Augmented Reality / Optics": [
      { id: 1, text: "Calibrate MicroLED projection light boundaries for high outdoor contrast", done: true },
      { id: 2, text: "Verify diffractive surface grating refraction index (n=1.82)", done: true },
      { id: 3, text: "Assemble prism waveguide lenses and run distortion checkups", done: false },
      { id: 4, text: "Configure edge NPU coordinate rendering for visual overlays", done: false },
      { id: 5, text: "Map compliance status with FCC and CE certification guides", done: false }
    ],
    "Bio-Diagnostics": [
      { id: 1, text: "Perform WIPO patent claims freedom-to-operate audit", done: true },
      { id: 2, text: "Configure ESP32 spectrophotometer calibration lookup curves", done: true },
      { id: 3, text: "Order microfluidic capillary test cartridge plastic parts", done: false },
      { id: 4, text: "Calibrate laser absorption spectroscopy wavelength readouts", done: false },
      { id: 5, text: "Compile FDA certification risk metrics inside dynamic console", done: false }
    ],
    "Smart Wearables": [
      { id: 1, text: "Optimize color Kaleido 3 electrophoretic refresh currents", done: true },
      { id: 2, text: "Configure BLE handshake pairing loop registers", done: true },
      { id: 3, text: "Assemble modular magnet pins for right-to-repair chassis", done: false },
      { id: 4, text: "Implement local notification parser offline scripts", done: false },
      { id: 5, text: "Test battery longevity under continuous sleep cycles", done: false }
    ],
    "Micro-Mobility": [
      { id: 1, text: "Optimize LFP high-density battery cell voltage limits", done: true },
      { id: 2, text: "Configure gyroscopic self-stabilization PID loop timing", done: true },
      { id: 3, text: "Assemble brushless motor telemetry interfaces", done: false },
      { id: 4, text: "Program ADAS computer vision sensor collision triggers", done: false },
      { id: 5, text: "Integrate sidewalk speed geofencing via GPS coordinate logs", done: false }
    ],
    "Environmental & Water Systems": [
      { id: 1, text: "Analyze bio-fouling membrane degradation rates", done: true },
      { id: 2, text: "Configure photovoltaic solar charging battery regulators", done: true },
      { id: 3, text: "Order micro-filtration mesh cartridge elements", done: false },
      { id: 4, text: "Test catalogued brine discharge dilution metrics", done: false },
      { id: 5, text: "Verify EPA water quality threshold clearance specifications", done: false }
    ],
    "General Tech": [
      { id: 1, text: "Audit legacy engineering failure points of the technology", done: true },
      { id: 2, text: "Build Business Model Canvas outline mapping partner streams", done: true },
      { id: 3, text: "Assemble elevator pitch presentation slides", done: false },
      { id: 4, text: "Calibrate local NPU processing parameters", done: false },
      { id: 5, text: "Push dynamic prototype files to public Git repository", done: false }
    ]
  };

  const getProjectChecklist = (sector) => {
    const sec = sector || "General Tech";
    if (sec.includes("Optics") || sec.includes("AR") || sec.includes("VR")) return projectChecklists["Augmented Reality / Optics"];
    if (sec.includes("Bio") || sec.includes("Diagnostics") || sec.includes("Health")) return projectChecklists["Bio-Diagnostics"];
    if (sec.includes("Wearables") || sec.includes("Watch")) return projectChecklists["Smart Wearables"];
    if (sec.includes("Mobility") || sec.includes("Scooter") || sec.includes("Car")) return projectChecklists["Micro-Mobility"];
    if (sec.includes("Water") || sec.includes("Filter") || sec.includes("Environmental")) return projectChecklists["Environmental & Water Systems"];
    return projectChecklists["General Tech"];
  };

  // State values for creating a brand-new custom workspace project
  const [customName, setCustomName] = useState('');
  const [customSector, setCustomSector] = useState('General Tech');
  const [customHackathon, setCustomHackathon] = useState('Hardware Revival Hackathon 2026');
  const [customBudget, setCustomBudget] = useState('₹150,000');

  // Resolve active workspace - defaults to user custom concept, fallback to dynamic builder if empty
  const [selectedProject, setSelectedProject] = useState(() => {
    return activeInnovation || {
      id: "workspace-default",
      name: "Custom Innovation Project Alpha",
      sector: "General Tech",
      targetHackathon: "Systems Engineering Challenge 2026",
      financials: { estimatedCost: "₹150,000" }
    };
  });

  // Keep synced if user selects or saves a project on another page
  useEffect(() => {
    if (activeInnovation) {
      setSelectedProject(activeInnovation);
    }
  }, [activeInnovation]);

  // Checklist state variables
  const [tasks, setTasks] = useState(() => getProjectChecklist(selectedProject.sector));

  // Sync checklist when active project changes
  useEffect(() => {
    setTasks(getProjectChecklist(selectedProject.sector));
  }, [selectedProject]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleCreateWorkspace = (e) => {
    e.preventDefault();
    if (!customName.trim()) {
      alert("Please enter a custom project name!");
      return;
    }
    const cleanName = customName.trim();
    const newProj = {
      id: "user-project-" + Date.now(),
      name: cleanName,
      sector: customSector,
      targetHackathon: customHackathon || "Custom Innovation Challenge 2026",
      financials: {
        estimatedCost: customBudget || "₹150,000",
        requiredSkills: ["Systems Integration", "Engineering Design", "Software Auditing", "Rapid Prototyping"],
        targetIndustries: [customSector, "AI-Enhanced Systems", "Smart Technology Platforms"],
        potentialInvestors: ["Y Combinator", "Techstars", "Angel Investors", "System Incubators"]
      },
      description: `A custom user-defined workspace project focused on engineering modifications and AI integrations for ${cleanName}.`,
      inventor: "User Workspace Analyst",
      patentId: "US-" + Math.floor(Math.random() * 9000000 + 1000000) + "-B2",
      yearFiled: new Date().getFullYear(),
      status: "Active Development",
      revivalViability: 85,
      commercialPotential: 80,
      marketGrowth: "CAGR 16.5% (Projected)",
      readinessLevel: 4,
      recommendationScore: 82,
      failureBottlenecks: [
        `Legacy Engineering: Early prototypes of ${cleanName} faced hardware bandwidth limits.`,
        `Ecosystem Gap: Developers lacked APIs to integrate ${cleanName} with modern cloud solutions.`,
        `Fabrication Costs: Launching ${cleanName} was delayed by high component manufacturing overheads.`
      ],
      aiEnhancementVector: [
        `NPU Offloading: Shift core computational tasks of ${cleanName} to local edge neural processors.`,
        `Edge RAG Hubs: Equip ${cleanName} with local semantic search indices for real-time offline lookups.`,
        `Microservice Wrapper: Package ${cleanName} endpoints as reusable API modules for easier third-party developer integrations.`
      ],
      swot: {
        strengths: [
          `Highly custom conceptual architecture of ${cleanName}`,
          "Sleek visual representation and modern structural layout"
        ],
        weaknesses: [
          `Complexity in setting up early physical prototypes of ${cleanName}`,
          "High dependency on initial sensor calibration parameters"
        ],
        opportunities: [
          `Connecting ${cleanName} grids with cloud analytical platforms`,
          "Growing demand for repairable, modular electronic appliances"
        ],
        threats: [
          `Highly competitive fast-mover clone markets in the ${customSector} sector`,
          "Changing data privacy and storage compliance laws"
        ]
      },
      roadmap: [
        {"step": "Phase 1: RAG System Audit", "desc": `Map historical ${cleanName} bottlenecks and identify expired patent claims.`},
        {"step": "Phase 2: Synapse Pipeline Design", "desc": `Formulate visual overlays or local micro-LLM pipelines resolving past failures.`},
        {"step": "Phase 3: Prototype & Test", "desc": `Assemble a visual proof of concept for ${cleanName} and run local simulation stress tests.`},
        {"step": "Phase 4: Launch & Scale", "desc": `Deploy custom ${cleanName} developer APIs and launch modular scaling paths.`}
      ]
    };
    setSelectedProject(newProj);
    if (setActiveInnovation) {
      setActiveInnovation(newProj);
    }
    setCustomName('');
  };

  const completedCount = tasks.filter(t => t.done).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="mono-tag" style={{ color: 'var(--color-success)' }}>WORKSPACES MANAGER</span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.25rem', fontFamily: 'var(--font-display)' }}>My Projects Workspace</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Define your own active innovation project, configure custom checklists, and track milestones dynamically.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '2.25rem', alignItems: 'start' }}>
        
        {/* Left Column: Create Form + Profile Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Workspace Creation Form */}
          <form onSubmit={handleCreateWorkspace} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)' }}>auto_awesome</span>
              <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>New Workspace Creator</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>PROJECT WORKSPACE NAME</label>
              <input 
                type="text" 
                className="tech-input" 
                placeholder="Type your own custom project..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>TARGET SECTOR</label>
              <select 
                className="tech-select"
                value={customSector}
                onChange={(e) => setCustomSector(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="General Tech">General Tech</option>
                <option value="Augmented Reality / Optics">Augmented Reality / Optics</option>
                <option value="Bio-Diagnostics">Bio-Diagnostics</option>
                <option value="Smart Wearables">Smart Wearables</option>
                <option value="Micro-Mobility">Micro-Mobility</option>
                <option value="Environmental & Water Systems">Environmental Systems</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>TARGET HACKATHON</label>
              <input 
                type="text" 
                className="tech-input" 
                placeholder="e.g. Systems Revival Challenge"
                value={customHackathon}
                onChange={(e) => setCustomHackathon(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>BUDGET CAP</label>
              <input 
                type="text" 
                className="tech-input" 
                placeholder="e.g. ₹100,000"
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
              />
            </div>

            <button type="submit" className="tech-button" style={{ marginTop: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>add</span> Initialize Workspace
            </button>
          </form>

          {/* Active Project Info Card */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-success)' }}>folder</span>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Active Project Profile</h3>
            </div>

            <div>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontFamily: 'var(--font-sans)' }}>PROJECT NAME</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-main)', display: 'block', marginTop: '0.15rem' }}>{selectedProject.name || selectedProject.title}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>SECTOR</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-secondary)' }}>{selectedProject.sector}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>BUDGET LIMIT</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-success)', fontFamily: 'var(--font-sans)' }}>{selectedProject.financials?.estimatedCost || "₹150,000"}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', display: 'block', fontWeight: 'bold' }}>TARGET HACKATHON ENROLLMENT</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.15rem', display: 'block' }}>{selectedProject.targetHackathon || "Systems Engineering Challenge 2026"}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Milestone Progress</span>
                <span style={{ color: 'var(--color-success)' }}>{progressPercent}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-success))' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Task Checklist Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>Engineering Checklist</h3>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
              {completedCount} of {tasks.length} Done
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {tasks.map(t => (
              <div 
                key={t.id} 
                onClick={() => toggleTask(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: t.done ? 'rgba(16, 185, 129, 0.03)' : 'rgba(0,0,0,0.2)',
                  border: `1px solid ${t.done ? 'rgba(16,185,129,0.2)' : 'var(--border-color)'}`,
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.done ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-success)',  flexShrink: 0  }}>check_circle</span>
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--text-dim)',  flexShrink: 0  }}>radio_button_unchecked</span>
                )}
                <span style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? 'var(--text-muted)' : 'var(--text-main)' }}>
                  {t.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-secondary)',  flexShrink: 0, marginTop: '2px'  }}>error</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              <strong>Jury Tip</strong>: Complete the engineering checklist to secure higher scores in the "Execution Readiness" grading column.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default MyProjects;
