// Client-side Database Fallback & Simulated AI Engine (Offline Capabilities)
export const mockHackathons = [
  {
    id: "h1",
    platform: "Unstop",
    name: "AI Innovate 2026",
    organizer: "TechVentures",
    description: "Build cutting-edge AI solutions for global challenges. Open to students and professionals.",
    mode: "Online",
    venue: "Virtual / GatherTown",
    prizePool: "$10,000",
    deadline: "2026-08-15T23:59:59",
    teamSize: "1-4",
    officialLink: "#",
    tags: ["AI", "Open Innovation"],
    matchScore: 95,
    daysRemaining: 30,
    status: "Open"
  },
  {
    id: "h2",
    platform: "Knowafest",
    name: "IoT Smart City Hack",
    organizer: "CityTech University",
    description: "Develop IoT infrastructure for the smart cities of tomorrow. Hardware provided for offline participants.",
    mode: "Hybrid",
    venue: "Campus / Zoom",
    prizePool: "$5,000",
    deadline: "2026-07-25T23:59:59",
    teamSize: "2-5",
    officialLink: "#",
    tags: ["IoT", "Smart Cities"],
    matchScore: 88,
    daysRemaining: 9,
    status: "Closing Soon"
  },
  {
    id: "h3",
    platform: "Unstop",
    name: "HealthTech 3.0",
    organizer: "BioMedical Corp",
    description: "Revolutionizing healthcare through data and biotechnology.",
    mode: "Online",
    venue: "Virtual / Teams",
    prizePool: "$15,000",
    deadline: "2026-09-01T23:59:59",
    teamSize: "1-5",
    officialLink: "#",
    tags: ["Healthcare", "AI"],
    matchScore: 78,
    daysRemaining: 47,
    status: "Open"
  }
];

export const mockUsers = [
  { id: 1, name: "Harish Analyst", email: "harishwarankrish20@gmail.com", role: "student", portal: "student", status: "Active", lastLogin: "2026-07-16T10:00:00" },
  { id: 2, name: "Business Pro", email: "analyst@outlook.com", role: "business", portal: "business", status: "Active", lastLogin: "2026-07-15T09:30:00" },
  { id: 3, name: "Jane Doe", email: "jane.doe@university.edu", role: "student", portal: "student", status: "Suspended", lastLogin: "2026-07-10T14:20:00" },
  { id: 4, name: "Tech Startup Inc.", email: "founder@techstartup.com", role: "business", portal: "business", status: "Active", lastLogin: "2026-07-16T11:15:00" }
];

export const mockAuditLogs = [
  { id: 101, timestamp: "2026-07-16T10:05:22", user: "harishwarankrish20@gmail.com", action: "User logged in", portal: "student", type: "auth" },
  { id: 102, timestamp: "2026-07-16T10:15:40", user: "harishwarankrish20@gmail.com", action: "Viewed Patent US8289440B2", portal: "student", type: "activity" },
  { id: 103, timestamp: "2026-07-16T11:20:10", user: "founder@techstartup.com", action: "Created Startup Pitch Draft", portal: "business", type: "activity" },
  { id: 104, timestamp: "2026-07-15T09:31:00", user: "analyst@outlook.com", action: "User logged in", portal: "business", type: "auth" },
  { id: 105, timestamp: "2026-07-15T14:45:12", user: "jane.doe@university.edu", action: "Failed Login Attempt", portal: "student", type: "security" },
  { id: 106, timestamp: "2026-07-10T14:20:00", user: "System", action: "Suspended account: jane.doe@university.edu", portal: "system", type: "security" }
];

export const fallbackInnovations = [
  {
    "id": "lytro-camera",
    "name": "Lytro Light Field Camera",
    "inventor": "Ren Ng",
    "patentId": "US8289440B2",
    "yearFiled": 2011,
    "status": "Discontinued",
    "sector": "Computational Photography",
    "commercialPotential": 88,
    "marketGrowth": "CAGR 22.4%",
    "revivalViability": 89,
    "readinessLevel": 7,
    "recommendationScore": 92,
    "failureBottlenecks": [
      "High Manufacturing Cost: Custom microlens arrays were extremely expensive to manufacture at scale.",
      "Slow Processing Speeds: Volumetric calculations for refocusing took minutes per photo on standard consumer CPUs.",
      "Low Export Resolution: High sensor data resulted in low final pixel output resolution (1-2 megapixels).",
      "Mobile Smartphone Boom: Consumers shifted to convenience and app-centric smartphone cameras."
    ],
    "aiEnhancementVector": [
      "Apply Modern AI Volumetric Neural Fields: Use NeRF (Neural Radiance Fields) and 3D Gaussian Splatting for real-time volumetric photo reconstruction.",
      "Edge-AI Coprocessors: Leverage modern mobile NPUs (Neural Processing Units) for instant light-field depth calculations.",
      "AR/VR Volumetric Capturing: Reposition the tech as standard capturing modules for Apple Vision Pro and Meta Quest contents.",
      "Dual-Camera Sensor Fusion: Combine standard high-res sensors with small light-field arrays for high-fidelity hybrid imaging."
    ],
    "marketTrend": [
      {"year": 2020, "value": 35},
      {"year": 2022, "value": 52},
      {"year": 2024, "value": 75},
      {"year": 2026, "value": 90}
    ],
    "swot": {
      "strengths": ["Captures full directional light data", "Post-capture refocusing capabilities", "Deep depth field information"],
      "weaknesses": ["Massive file sizes", "Complex hardware requirements", "Low static image quality"],
      "opportunities": ["Spatial computing boom", "Metaverse volumetric content", "Industrial inspection 3D scanning"],
      "threats": ["Computational photography models mimicking depth digitally", "High-resolution standard stereo-cameras"]
    },
    "roadmap": [
      {"step": "Phase 1: Sensor Redesign", "desc": "Design a hybrid CMOS sensor integrating a standard micro-lens grid, targeting 4K volumetric resolution."},
      {"step": "Phase 2: Depth-Splatting Algorithm", "desc": "Write custom CUDA/Metal kernels to compile volumetric depth information in under 50ms."},
      {"step": "Phase 3: Spatial API Integration", "desc": "Build plugins for Unity and Unreal Engine to directly export volumetric footage for spatial devices."},
      {"step": "Phase 4: Hardware Prototyping", "desc": "Release an open-source optical module compatible with mobile developers and hobbyist camera rigs."}
    ],
    "financials": {
      "estimatedCost": "$850,000",
      "requiredSkills": ["Computational Photography", "Optics Engineering", "CUDA/GPU programming", "Spatial computing API development"],
      "targetIndustries": ["VR/AR Content Creation", "Medical Imaging", "Autonomous Vehicle Vision Systems"],
      "potentialInvestors": ["Meta Reality Labs", "Apple Inc.", "Sony Ventures", "Sequoia Capital"]
    }
  },
  {
    "id": "pebble-smartwatch",
    "name": "Pebble Smartwatch",
    "inventor": "Eric Migicovsky",
    "patentId": "US9455796B2",
    "yearFiled": 2012,
    "status": "Acquired & Discontinued",
    "sector": "Wearable Technology",
    "commercialPotential": 82,
    "marketGrowth": "CAGR 14.8%",
    "revivalViability": 84,
    "readinessLevel": 8,
    "recommendationScore": 86,
    "failureBottlenecks": [
      "Under-funded Operating System: Couldn't compete with massive software budgets of Apple (watchOS) and Google (Wear OS).",
      "Display Competitiveness: Consumers quickly favored full-color, high-brightness OLED screens over reflective monochrome e-ink.",
      "Lack of Cellular Integration: Lacked standalone LTE capabilities, making it dependent on smartphone tethering."
    ],
    "aiEnhancementVector": [
      "Smarter Low-Power UI: Use localized LLMs to parse and summarize incoming notifications directly on-device with minimal energy.",
      "Ultra-low Power Color E-Ink: Integrate modern Kaleido 3 color e-paper displays for vibrant but static screen tech.",
      "Digital Detox positioning: Market the watch as an anti-addiction, high-focus productivity screen.",
      "Solar Energy Harvesting: Build micro-solar cells into the screen bezel to support indefinite battery life."
    ],
    "marketTrend": [
      {"year": 2020, "value": 40},
      {"year": 2022, "value": 45},
      {"year": 2024, "value": 68},
      {"year": 2026, "value": 84}
    ],
    "swot": {
      "strengths": ["7-10 day battery life", "Outdoor sunlight visibility", "Highly active developer fanbase"],
      "weaknesses": ["Limited UI graphical abilities", "No cellular connectivity", "No advanced biological health sensors"],
      "opportunities": ["Digital detox movement", "E-paper dashboard smartwatches", "Long-term patient biometric monitoring"],
      "threats": ["Ultra-cheap smartbands", "Premium high-battery sports watches (Garmin)"]
    },
    "roadmap": [
      {"step": "Phase 1: Solar Bezel R&D", "desc": "Engineer a solar-harvesting crystal bezel to trickle charge the wearable."},
      {"step": "Phase 2: Color E-Ink OS", "desc": "Refactor the original Pebble SDK to support color e-paper with fast refresh rates."},
      {"step": "Phase 3: Offline Health AI", "desc": "Integrate tinyML models on an ARM Cortex processor to analyze ECG and heart rate anomalies locally."},
      {"step": "Phase 4: Crowd-Fund Launch", "desc": "Launch a Kickstarter campaign for the 'Pebble Revival' highlighting offline privacy and 15-day battery."}
    ],
    "financials": {
      "estimatedCost": "$450,000",
      "requiredSkills": ["Embedded Systems", "E-Paper Display Systems", "TinyML on Microcontrollers", "Hardware manufacturing"],
      "targetIndustries": ["Wearable Electronics", "Digital Wellbeing", "Biometric Health Tracking"],
      "potentialInvestors": ["Y Combinator", "Fitbit Founders", "Kickstarter community", "Kholsa Ventures"]
    }
  },
  {
    "id": "google-glass",
    "name": "Google Glass (Explorer Edition)",
    "inventor": "Babak Parviz (Project Glass)",
    "patentId": "US8902511B1",
    "yearFiled": 2012,
    "status": "Discontinued",
    "sector": "Augmented Reality",
    "commercialPotential": 94,
    "marketGrowth": "CAGR 38.2%",
    "revivalViability": 91,
    "readinessLevel": 6,
    "recommendationScore": 95,
    "failureBottlenecks": [
      "Social Backlash (Privacy): The visible front camera raised major privacy concerns (users dubbed 'Glassholes').",
      "Poor Display Optics: Small prism projection was difficult to see in bright light and caused eye strain.",
      "Inefficient Battery/Overheating: Heavy compute on-board caused the frame to heat up and drained battery in 45 minutes.",
      "Undefined Consumer Value: No clear killer app or utility that justified the $1,500 developer pricing."
    ],
    "aiEnhancementVector": [
      "Replace Prism with MicroLED Waveguides: Use transparent diffractive waveguide lenses for high-brightness overlay.",
      "Conversational AI Interface: Use Whisper for voice input and GPT-4o style vision models to turn the glasses into an intelligent visual assistant.",
      "Privacy-First Shutter: Install a mechanical or electrochromic shutter that visually blocks the camera when not explicitly active.",
      "Enterprise-Focused Edge Processing: Deploy specific models for industrial maintenance, surgeon overlay, or warehouse picking."
    ],
    "marketTrend": [
      {"year": 2020, "value": 50},
      {"year": 2022, "value": 58},
      {"year": 2024, "value": 82},
      {"year": 2026, "value": 95}
    ],
    "swot": {
      "strengths": ["Lightweight form factor", "Heads-up notification style", "Strong developer framework"],
      "weaknesses": ["Heat dissipation issues", "Distorted prism displays", "Awkward social appearance"],
      "opportunities": ["Generative AI Visual Assistant market", "Enterprise hands-free checklists", "Real-time subtitle translators"],
      "threats": ["Apple Vision Pro/Meta Orion", "Smart audio-only glasses (Ray-Ban Meta)"]
    },
    "roadmap": [
      {"step": "Phase 1: Optical Upgrade", "desc": "Source high-brightness microLED modules and thin diffractive waveguides."},
      {"step": "Phase 2: Conversational NPU Integration", "desc": "Embed a lightweight Snapdragon AR processor with built-in NPU for offline speech recognition."},
      {"step": "Phase 3: Visual Search AI Engine", "desc": "Implement on-device vector database queries to identify objects and translate languages instantly."},
      {"step": "Phase 4: B2B Maintenance Pilot", "desc": "Partner with logistics hubs to roll out hands-free barcode scanning and route finding."}
    ],
    "financials": {
      "estimatedCost": "$1,200,000",
      "requiredSkills": ["Waveguide Optics", "On-device AI / NPU optimization", "Embedded OS", "Industrial UX design"],
      "targetIndustries": ["Logistics & Warehousing", "Healthcare / Surgical Overlays", "Consumer Smart Glasses"],
      "potentialInvestors": ["Intel Capital", "Qualcomm Ventures", "Google Ventures", "Honeywell Labs"]
    }
  },
  {
    "id": "segway-pt",
    "name": "Segway Personal Transporter",
    "inventor": "Dean Kamen",
    "patentId": "US6302230B1",
    "yearFiled": 2001,
    "status": "Discontinued",
    "sector": "Micro-mobility",
    "commercialPotential": 75,
    "marketGrowth": "CAGR 18.6%",
    "revivalViability": 82,
    "readinessLevel": 9,
    "recommendationScore": 79,
    "failureBottlenecks": [
      "Prohibitive Price Point: Launched at $5,000 in 2001, which was too expensive for casual commuters.",
      "Over-engineering: Complex self-balancing gyroscopic sensors made the unit heavy (100 lbs) and hard to transport.",
      "Regulatory Hurdles: Sidewalk bans and lack of bike-lane classifications restricted where it could be legally driven.",
      "Social Stigma: Seen as bulky and uncool, losing the younger demographic to skateboards and bikes."
    ],
    "aiEnhancementVector": [
      "Lightweight Carbon Fiber Frame: Reduce weight to under 30 lbs using composite materials and smaller brushless motors.",
      "AI Geofencing & ADAS: Integrate computer vision to dynamically adjust speed on sidewalks vs bike lanes.",
      "App-Less Shared Mobility Model: Incorporate cellular IoT nodes for dockless sharing networks (like Lime or Bird).",
      "Self-Parking / Summoning: Use autonomous pathfinding to let the unit park itself or drive to a user's location."
    ],
    "marketTrend": [
      {"year": 2020, "value": 65},
      {"year": 2022, "value": 72},
      {"year": 2024, "value": 80},
      {"year": 2026, "value": 85}
    ],
    "swot": {
      "strengths": ["Flawless self-balancing technology", "Zero emissions", "High torque electric motors"],
      "weaknesses": ["Extremely heavy and bulky", "Expensive replacement batteries", "Difficult to store inside apartments"],
      "opportunities": ["Last-mile delivery integration", "Shared micro-mobility platforms", "Airport/Warehouse security patrols"],
      "threats": ["Foldable electric scooters", "Low-cost e-bikes"]
    },
    "roadmap": [
      {"step": "Phase 1: Weight Reduction", "desc": "Redesign the motor casing and chassis using aluminum/carbon fiber composite."},
      {"step": "Phase 2: IoT Integration", "desc": "Add global cellular LTE chipsets and smart-locking remote systems."},
      {"step": "Phase 3: ADAS Safety System", "desc": "Mount front ultrasonic and camera modules to prevent pedestrian collisions."},
      {"step": "Phase 4: Shared Fleet Pilot", "desc": "Roll out 100 units in a dense tourist destination for self-balancing rental tours."}
    ],
    "financials": {
      "estimatedCost": "$600,000",
      "requiredSkills": ["Control Systems Engineering", "Brushless DC Motor Design", "IoT Firmware Development", "ADAS / Computer Vision"],
      "targetIndustries": ["Urban Commuting", "Campus & Tourism Transport", "Automated Security Devices"],
      "potentialInvestors": ["SoftBank Vision Fund", "Lime Ventures", "Bird Global", "Segway-Ninebot Group"]
    }
  },
  {
    "id": "project-ara",
    "name": "Project Ara Modular Smartphone",
    "inventor": "Google (ATAP)",
    "patentId": "US9369989B2",
    "yearFiled": 2013,
    "status": "Cancelled",
    "sector": "Consumer Electronics",
    "commercialPotential": 85,
    "marketGrowth": "CAGR 19.3%",
    "revivalViability": 86,
    "readinessLevel": 5,
    "recommendationScore": 88,
    "failureBottlenecks": [
      "Uni-bus Latency: Speed limits of the modular bus (UniPro) caused bottlenecks in sensor and display frame rates.",
      "Module Attachment Durability: Magnetic locks were fragile, leading to modules disconnecting when dropped.",
      "Bulk & Weight: The exoskeleton frame and separate module shells made the phone 2-3 times thicker than standard phones.",
      "Lack of OEM Support: Hardware manufacturers preferred selling complete upgrades rather than single components."
    ],
    "aiEnhancementVector": [
      "UniPro Upgrade with PCIe Gen 4: Use high-speed optical connections or wireless ultra-wideband for module communication.",
      "Modern Electromagnetic Clamps: Deploy smart electro-permanent magnets managed by firmware to secure modules on impacts.",
      "AI Hardware Resource Negotiator: Create an on-device AI system configuration manager to hot-swap modules without device reboots.",
      "Circular Economy Positioning: Partner with carbon-neutral repair campaigns to pitch modular tech for zero-waste electronics."
    ],
    "marketTrend": [
      {"year": 2020, "value": 30},
      {"year": 2022, "value": 45},
      {"year": 2024, "value": 68},
      {"year": 2026, "value": 85}
    ],
    "swot": {
      "strengths": ["Infinitely upgradable device lifespan", "Dramatically reduces electronic waste", "Custom hardware modular layouts"],
      "weaknesses": ["Increased structural fragility", "Higher base weight and width", "Loss of water-resistance certifications"],
      "opportunities": ["Right to Repair legislative push", "Specialized hardware modules (flir cameras, bio-sensors)", "Industrial customizable devices"],
      "threats": ["Monolithic device manufacturing giants", "Standardized trade-in cycles"]
    },
    "roadmap": [
      {"step": "Phase 1: High-Speed Optical Bus", "desc": "Engineer a fiber-optic communication path linking individual module nodes to the CPU base."},
      {"step": "Phase 2: Electro-Magnetic Locking System", "desc": "Write shock-sensor interrupts that boost voltage to magnets instantly upon dropping detection."},
      {"step": "Phase 3: Open-Source CAD Registry", "desc": "Release precise 3D specifications for modules on GitHub for third-party hardware developers."},
      {"step": "Phase 4: Kickstarter Module Launch", "desc": "Launch an initial phone kit featuring an e-ink screen module and high-capacity battery module."}
    ],
    "financials": {
      "estimatedCost": "$1,800,000",
      "requiredSkills": ["Optoelectronic Engineering", "CAD/Hardware Housing", "Low-level Linux Kernel Development", "Electromagnetics"],
      "targetIndustries": ["Eco-friendly Consumer Tech", "Specialized Field Hardware", "Mobile Hardware Prototyping"],
      "potentialInvestors": ["Fairphone Ventures", "iFixit Investment Group", "European Circular Economy Fund", "Google ATAP Partners"]
    }
  }
];

export const fallbackGraph = {
  nodes: [
    { id: "s-photo", label: "Computational Photo", type: "sector", group: 1 },
    { id: "s-wear", label: "Wearables", type: "sector", group: 1 },
    { id: "s-ar", label: "Augmented Reality", type: "sector", group: 1 },
    { id: "s-micro", label: "Micro-Mobility", type: "sector", group: 1 },
    { id: "s-bio", label: "Bio-Diagnostics", type: "sector", group: 1 },

    { id: "i-lytro", label: "Lytro Camera", type: "failed", group: 2 },
    { id: "i-pebble", label: "Pebble Watch", type: "failed", group: 2 },
    { id: "i-glass", label: "Google Glass", type: "failed", group: 2 },
    { id: "i-segway", label: "Segway PT", type: "failed", group: 2 },
    { id: "i-ara", label: "Project Ara", type: "failed", group: 2 },

    { id: "b-sensor", label: "Expensive Micro-Lens", type: "bottleneck", group: 3 },
    { id: "b-mono", label: "Monochrome screen", type: "bottleneck", group: 3 },
    { id: "b-prism", label: "Prism optical strain", type: "bottleneck", group: 3 },
    { id: "b-gyro", label: "Heavy Gyroscopes", type: "bottleneck", group: 3 },
    { id: "b-unipro", label: "Slow UniPro Bus", type: "bottleneck", group: 3 },

    { id: "sol-nerf", label: "3D Gaussian Splatting", type: "solution", group: 4 },
    { id: "sol-kaleido", label: "Kaleido 3 Color E-Ink", type: "solution", group: 4 },
    { id: "sol-waveguide", label: "MicroLED Waveguide", type: "solution", group: 4 },
    { id: "sol-adas", label: "ADAS & AI Geofencing", type: "solution", group: 4 },
    { id: "sol-pcie", label: "PCIe Gen 4 bus", type: "solution", group: 4 }
  ],
  links: [
    { source: "i-lytro", target: "s-photo" },
    { source: "i-pebble", target: "s-wear" },
    { source: "i-glass", target: "s-ar" },
    { source: "i-segway", target: "s-micro" },
    { source: "i-ara", target: "s-wear" },

    { source: "i-lytro", target: "b-sensor" },
    { source: "i-pebble", target: "b-mono" },
    { source: "i-glass", target: "b-prism" },
    { source: "i-segway", target: "b-gyro" },
    { source: "i-ara", target: "b-unipro" },

    { source: "b-sensor", target: "sol-nerf" },
    { source: "b-mono", target: "sol-kaleido" },
    { source: "b-prism", target: "sol-waveguide" },
    { source: "b-gyro", target: "sol-adas" },
    { source: "b-unipro", target: "sol-pcie" },

    { source: "sol-nerf", target: "s-photo" },
    { source: "sol-kaleido", target: "s-wear" },
    { source: "sol-waveguide", target: "s-ar" },
    { source: "sol-adas", target: "s-micro" }
  ]
};

// Local similarity scoring
export const calculateClientSimilarity = (title, desc, sector) => {
  const cleanTitle = (title || "").trim().toLowerCase();
  const cleanDesc = (desc || "").trim().toLowerCase();
  const words = cleanTitle.split(/\s+/).filter(Boolean);

  // Set of common personal first/last names to block instantly
  const commonNames = new Set([
    'arjun', 'sharma', 'amit', 'kumar', 'rahul', 'singh', 'john', 'doe', 'smith', 'jane', 'mary', 
    'alex', 'vijay', 'priya', 'sanjay', 'aditya', 'rohit', 'deepak', 'sunil', 'anil', 'raj', 'neha',
    'pooja', 'sneha', 'ananya', 'rahul', 'siddharth', 'karan', 'kabir', 'dev', 'aravind', 'ram',
    'david', 'james', 'robert', 'michael', 'william', 'thomas', 'richard', 'charles', 'joseph', 
    'patel', 'shah', 'gupta', 'mehta', 'sharma', 'verma', 'mishra', 'joshi', 'rao', 'reddy', 'nair',
    'baba', 'arjun', 'sharma', 'sandeep', 'anand', 'harish', 'manoj', 'vikram', 'suresh'
  ]);
  
  const isAllCommonNames = words.every(w => commonNames.has(w));
  const isValid = cleanTitle.length >= 3 && !(isAllCommonNames && words.length >= 2);

  if (!isValid) {
    return {
      success: false,
      errorType: 'invalid_tech',
      message: `Invenza AI classified "${title}" as a personal profile, name query, or non-technical biography. Auditing is strictly restricted to valid scientific, hardware, or software engineering concepts.`
    };
  }

  const comparisonText = (title + " " + desc + " " + (sector || "")).toLowerCase();
  const comparisonWords = new Set(comparisonText.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  
  let bestMatch = null;
  let maxSimilarity = 0;

  fallbackInnovations.forEach(item => {
    const itemText = (item.name + " " + item.sector + " " + item.failureBottlenecks.join(" ") + " " + item.aiEnhancementVector.join(" ")).toLowerCase();
    const itemWords = new Set(itemText.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
    
    // Jaccard similarity
    const intersection = new Set([...comparisonWords].filter(x => itemWords.has(x)));
    const union = new Set([...comparisonWords, ...itemWords]);
    const sim = union.size === 0 ? 0 : intersection.size / union.size;

    if (sim > maxSimilarity) {
      maxSimilarity = sim;
      bestMatch = item;
    }
  });

  const score = Math.round(maxSimilarity * 100);
  
  if (bestMatch && score >= 45) {
    return {
      success: true,
      isOverlapping: true,
      similarityScore: score,
      matchedOriginal: { id: bestMatch.id, name: bestMatch.name },
      report: {
        ...bestMatch,
        name: `Revived ${bestMatch.name} (Custom Variant)`,
        originalId: bestMatch.id,
        originalName: bestMatch.name,
        similarityScore: score
      }
    };
  }

  // Deterministic calculation based on title hash and description detail
  let nameHash = 0;
  const hashedTitle = title || "Custom Innovation";
  for (let i = 0; i < hashedTitle.length; i++) {
    nameHash += hashedTitle.charCodeAt(i);
  }
  
  let baseViability = 72 + (nameHash % 15); // 72% to 86%
  
  // Adjust based on sector
  const targetSector = sector || "General Tech";
  if (targetSector === "Biomedical Diagnostics" || targetSector === "Bio-Diagnostics") {
    baseViability -= 6;
  } else if (targetSector === "Digital Entertainment" || targetSector === "Digital Media & Gaming") {
    baseViability += 4;
  } else if (targetSector === "Augmented Reality" || targetSector === "Augmented Reality / Optics") {
    baseViability += 2;
  }
  
  const detailBonus = desc ? Math.min(10, Math.floor(desc.length / 20)) : 2;
  const rating = Math.min(96, baseViability + detailBonus);

  const customTitle = title || "Custom Innovation";

  const textQuery = comparisonText;
  let estimatedCost = "$250,000";
  let readinessLevel = 3;
  let bottlenecks = [];
  let enhancements = [];
  let strengths = [];
  let weaknesses = [];
  let opportunities = [];
  let threats = [];
  let resolvedSector = targetSector;

  // Determine target sector and populate specific parameters
  if (textQuery.includes("health") || textQuery.includes("medical") || textQuery.includes("blood") || textQuery.includes("theranos") || textQuery.includes("bio") || textQuery.includes("diagnostic") || textQuery.includes("clinical") || textQuery.includes("reagent")) {
    resolvedSector = "Bio-Diagnostics";
    estimatedCost = "$680,000";
    readinessLevel = 4;
    bottlenecks = [
      `Microfluidic flow constraints: Early versions of ${customTitle} faced inconsistent liquid sample routing across test arrays.`,
      `Calibration drift: The device suffered from drift in spectrophotometer sensor calibration curves.`,
      `Regulatory blockades: Meeting FDA class-III multi-analyte validation trials created extensive development delays.`
    ];
    enhancements = [
      `Edge AI spectroscopy calibration: Use machine learning models to adjust sensor readouts in real-time.`,
      `Decentralized chemical logs: Implement shared authentication ledgers to trace reagent purity metrics.`,
      `NPU cell tracking: Deploy computer vision models locally to automate microfluidic boundary audits.`
    ];
    strengths = [
      `Compact point-of-care design for local clinic deployments`,
      `Multi-analyte integration reduces sample volume requirements`
    ];
    weaknesses = [
      `High vulnerability to ambient light contamination during readings`,
      `Mechanical complexity in fabricating plastic capillary cartridges`
    ];
    opportunities = [
      `Connecting local testing arrays to global health monitoring networks`,
      `Integrating automated chemical calibration protocols via cloud APIs`
    ];
    threats = [
      `Varying and strict global FDA diagnostic compliance mandates`,
      `High entry barriers created by centralized laboratory monopolies`
    ];
  } else if (textQuery.includes("glass") || textQuery.includes("ar") || textQuery.includes("vr") || textQuery.includes("camera") || textQuery.includes("lytro") || textQuery.includes("optics") || textQuery.includes("lens") || textQuery.includes("projection") || textQuery.includes("waveguide") || textQuery.includes("display")) {
    resolvedSector = "Augmented Reality / Optics";
    estimatedCost = "$450,000";
    readinessLevel = 4;
    bottlenecks = [
      `Optical contrast limits: Display overlays in ${customTitle} were virtually unreadable under bright outdoor light.`,
      `Refractive aberrations: Waveguide prisms in ${customTitle} caused heavy visual distortion and eye fatigue.`,
      `Thermal constraints: Local video coordinate rendering overheated the compact head-mounted frame.`
    ];
    enhancements = [
      `Diffractive waveguide mapping: Use AI-designed optical gratings printed on sub-nanometer glass.`,
      `MicroLED display boost: Deploy high-density emitters boosting brightness past 10,000 nits.`,
      `NPU eye tracking: Integrate local foveated rendering algorithms to lower GPU load.`
    ];
    strengths = [
      `Hands-free visual overlay interface for real-time guidance`,
      `Direct line-of-sight visual feedback improves task efficiency`
    ];
    weaknesses = [
      `Conspicuous head-mounted frame causes social friction`,
      `Severely limited battery life under active video streaming`
    ];
    opportunities = [
      `Growing enterprise demand for remote assistance and logistics routing`,
      `Sub-nanometer lithography advances lowering glass prism fabrication costs`
    ];
    threats = [
      `Strict public privacy and camera recording compliance rules`,
      `Rapid development cycles from well-funded consumer electronics rivals`
    ];
  } else if (textQuery.includes("watch") || textQuery.includes("wearable") || textQuery.includes("pebble") || textQuery.includes("ara") || textQuery.includes("modular") || textQuery.includes("device") || textQuery.includes("phone") || textQuery.includes("obsolete") || textQuery.includes("hardware") || textQuery.includes("fitbit")) {
    resolvedSector = "Smart Wearables";
    estimatedCost = "$320,000";
    readinessLevel = 5;
    bottlenecks = [
      `Display panel latency: Early electrophoretic panels in ${customTitle} suffered from screen ghosting.`,
      `Bluetooth handshake drain: Persistent pairing requests exhausted the tiny battery of ${customTitle}.`,
      `Unrepairable structure: Adhered casings prevented modular battery or screen replacements.`
    ];
    enhancements = [
      `Electrophoretic refresh curves: Deploy NPU algorithms to pre-calculate and clear pixel ghosting.`,
      `BLE sleep schedules: Schedule handshake intervals dynamically based on user movement signals.`,
      `Modular right-to-repair chassis: Design snap-on magnetic casings to simplify parts swapping.`
    ];
    strengths = [
      `Distraction-free notifications visible under direct sunlight`,
      `Highly durable paper-like display layout`
    ];
    weaknesses = [
      `Very limited local memory space for third-party developer tools`,
      `Wear on mechanical side buttons causing water sealing failures`
    ];
    opportunities = [
      `Increasing consumer interest in right-to-repair smart electronics`,
      `Integration with healthcare biosensor logging frameworks`
    ];
    threats = [
      `Aggressive platform lock-in from major OS ecosystems`,
      `Market consolidation toward battery-heavy color OLED screen models`
    ];
  } else if (textQuery.includes("segway") || textQuery.includes("scooter") || textQuery.includes("car") || textQuery.includes("ev") || textQuery.includes("electric") || textQuery.includes("battery") || textQuery.includes("vehicle") || textQuery.includes("mobility") || textQuery.includes("transport") || textQuery.includes("motor")) {
    resolvedSector = "Micro-Mobility";
    estimatedCost = "$750,000";
    readinessLevel = 5;
    bottlenecks = [
      `Prohibitive pricing: The mechanical motor parts of ${customTitle} priced it out of consumer budgets.`,
      `Transit regulations: Sidewalk travel bans and legal disputes locked ${customTitle} out of city routes.`,
      `Stabilization drift: Gyroscopic sensor drift during long runs compromised passenger balance.`
    ];
    enhancements = [
      `Gyroscopic auto-calibration: Run localized edge NPU loops to correct sensor drift in real-time.`,
      `ADAS obstacle tracking: Integrate computer vision modules to trigger auto-braking.`,
      `LFP battery cell wrapper: Lower production costs by using high-stability iron-phosphate batteries.`
    ];
    strengths = [
      `Intuitive self-stabilizing drive mechanism responsive to body tilt`,
      `Zero-emission electric motor drivetrain reducing local carbon emissions`
    ];
    weaknesses = [
      `Excessive weight makes manual carrying difficult in pedestrian zones`,
      `Steep learning curves for riders unfamiliar with gyroscopic transit`
    ];
    opportunities = [
      `Growing last-mile transport requirements in highly congested smart cities`,
      `API integrations with municipal ride-share platforms`
    ];
    threats = [
      `Sudden municipal transit bans restricting scooter lanes`,
      `Inflow of cheap, unregulated clone imports failing basic safety checks`
    ];
  } else if (textQuery.includes("game") || textQuery.includes("console") || textQuery.includes("dreamcast") || textQuery.includes("stadia") || textQuery.includes("quibi") || textQuery.includes("streaming") || textQuery.includes("video") || textQuery.includes("play") || textQuery.includes("media") || textQuery.includes("social")) {
    resolvedSector = "Digital Media & Gaming";
    estimatedCost = "$280,000";
    readinessLevel = 6;
    bottlenecks = [
      `Bandwidth latency: Cloud frame encoding in ${customTitle} suffered from packet loss on standard connections.`,
      `Hosting costs: Provisioning server GPU hardware for ${customTitle} exceeded subscription revenue.`,
      `Content acquisition gaps: Lack of exclusive titles led to high early customer churn.`
    ];
    enhancements = [
      `WebRTC packet concealment: Deploy AI models to interpolate dropped video frames.`,
      `Decentralized GPU nodes: Reduce server overhead by leasing idle consumer GPU cores.`,
      `Dynamic resolution scaling: Adjust quality overlays dynamically based on network latency logs.`
    ];
    strengths = [
      `Zero-install instant gameplay access across low-spec hardware`,
      `Flexible cross-device play states synced to cloud storage`
    ];
    weaknesses = [
      `Extreme sensitivity to local network packet jitter`,
      `Lack of physical media ownership alienating collectors`
    ];
    opportunities = [
      `Spectator integration allowing livestream viewers to join active sessions`,
      `Advances in high-speed 5G network cell routing`
    ];
    threats = [
      `Traditional offline console preference among core target audiences`,
      `Data caps limiting monthly game streaming hours`
    ];
  } else if (textQuery.includes("water") || textQuery.includes("treatment") || textQuery.includes("filter") || textQuery.includes("purify") || textQuery.includes("filtration") || textQuery.includes("environmental") || textQuery.includes("waste") || textQuery.includes("solar") || textQuery.includes("eco")) {
    resolvedSector = "Environmental & Water Systems";
    estimatedCost = "$390,000";
    readinessLevel = 6;
    bottlenecks = [
      `Membrane degradation: Rapid accumulation of waste particles fouled the filtration mesh in ${customTitle}.`,
      `Power requirements: Continuous pumping in ${customTitle} required bulky, expensive solar arrays.`,
      `Maintenance overhead: Short lifespan of core cartridge parts raised long-term operational costs.`
    ];
    enhancements = [
      `Optical fouling detection: Deploy NPU sensor cameras to trigger cleaning backwash only when needed.`,
      `Solar direct-drive pumps: Calibrate motor speeds directly to photovoltaic panel outputs.`,
      `Catalytic oxidation units: Add eco-friendly electrochemical cells to neutralize chemical brine.`
    ];
    strengths = [
      `Decentralized off-grid filtration for remote disaster zones`,
      `Physical filtration layout avoids hazardous chemical additions`
    ];
    weaknesses = [
      `Low clean liquid volume output relative to physical footprint`,
      `High operational maintenance requirements in remote regions`
    ];
    opportunities = [
      `Increasing groundwater shortages driving local filtration demand`,
      `Ecosystem carbon offset integration rewarding zero-emission operations`
    ];
    threats = [
      `Varying local EPA chemical threshold levels and water criteria`,
      `Material cost fluctuations in high-strength metal housings`
    ];
  } else if (textQuery.includes("drone") || textQuery.includes("flight") || textQuery.includes("aerospace") || textQuery.includes("aviation") || textQuery.includes("aircraft") || textQuery.includes("wind") || textQuery.includes("satellite") || textQuery.includes("solar impulse")) {
    resolvedSector = "Aerospace & Flight Systems";
    estimatedCost = "$820,000";
    readinessLevel = 5;
    bottlenecks = [
      `Payload constraints: The structural weight of battery modules limited flight duration for ${customTitle}.`,
      `Aerodynamic turbulence: Light carbon frames in ${customTitle} were easily destabilized by sudden wind shear.`,
      `Autonomous flight limits: Low on-board computing limits blocked dynamic navigation around obstacles.`
    ];
    enhancements = [
      `AI structural optimization: Fabricate custom carbon-fiber wings designed via generative algorithm trials.`,
      `Adaptive flight NPUs: Install low-power edge processors to stabilize control surfaces in 30ms.`,
      `Weather routing APIs: Bind flight systems directly to satellite cloud telemetry loops.`
    ];
    strengths = [
      `Zero-emission long-endurance flight capability using solar harvesting`,
      `Rapid transit routes bypass standard roadway infrastructure limitations`
    ];
    weaknesses = [
      `Extremely large wing area requirements complicate hangar storage`,
      `Low rate of vertical climb increases takeoff distance constraints`
    ];
    opportunities = [
      `Growing demand for autonomous zero-emission delivery routes in remote regions`,
      `Atmospheric observation networks acting as low-cost satellite alternatives`
    ];
    threats = [
      `Strict airspace flight permissions and drone altitude flight boundaries`,
      `Rapid changes in local weather patterns compromising light craft`
    ];
  } else {
    resolvedSector = "General Tech & Software Platforms";
    estimatedCost = "$250,000";
    readinessLevel = 4;
    bottlenecks = [
      `Scalability bottlenecks: Database queries in early versions of ${customTitle} scaled poorly under concurrent requests.`,
      `Ecosystem gaps: The platform lacked external developer APIs, blocking third-party integration of ${customTitle}.`,
      `Infrastructure overhead: Server costs rose exponentially, forcing pricing models above market thresholds.`
    ];
    enhancements = [
      `Edge LLM caching: Deploy localized server caches to handle standard request parsing.`,
      `Modular developer APIs: Wrap core functionalities of ${customTitle} in lightweight developer endpoints.`,
      `Dynamic resource allocation: Implement auto-scaling triggers to adjust database instances.`
    ];
    strengths = [
      `Responsive modern user interface minimizing onboarding friction`,
      `Low local resource footprint across desktop and mobile screens`
    ];
    weaknesses = [
      `Continuous internet dependency restricts offline usage availability`,
      `High initial database sync requirements under high volumes`
    ];
    opportunities = [
      `Integrating with modern open-source tool libraries and plugins`,
      `Niche marketing strategies targeting developer groups`
    ];
    threats = [
      `Intense competition from open-source clone platforms`,
      `Changing local data compliance and security regulations`
    ];
  }

  return {
    success: true,
    isOverlapping: false,
    similarityScore: score,
    matchedOriginal: null,
    report: {
      id: "custom-revival-" + Date.now(),
      name: customTitle,
      inventor: "User Concept",
      patentId: "PENDING-DETECT-" + Math.floor(Math.random() * 90000 + 10000),
      yearFiled: new Date().getFullYear(),
      status: "Ideation Phase",
      sector: resolvedSector,
      commercialPotential: Math.round(rating * 0.9),
      marketGrowth: "CAGR 18.2%",
      revivalViability: rating,
      readinessLevel: readinessLevel,
      recommendationScore: Math.round(rating * 0.95),
      failureBottlenecks: bottlenecks,
      aiEnhancementVector: enhancements,
      marketTrend: [
        {"year": 2020, "value": 25},
        {"year": 2022, "value": 40},
        {"year": 2024, "value": 65},
        {"year": 2026, "value": rating}
      ],
      swot: { strengths, weaknesses, opportunities, threats },
      roadmap: [
        {"step": "Phase 1: Concept Wireframing", "desc": `Establish mock visual layers and outline operational endpoints for ${customTitle}.`},
        {"step": "Phase 2: MVP Development", "desc": `Connect standard APIs to simulate secondary features and validate functionality of ${customTitle}.`},
        {"step": "Phase 3: Beta Feedback", "desc": `Onboard early cohort test groups and iterate ${customTitle} designs based on active click logs.`},
        {"step": "Phase 4: Launch & Scaling", "desc": `Push open source ${customTitle} files to Github and pitch to early-stage micro VC incubators.`}
      ],
      financials: {
        estimatedCost: estimatedCost,
        requiredSkills: ["Product UX Design", "Frontend Coding", "API Integration", "Growth Hacking"],
        targetIndustries: [resolvedSector, "SaaS Systems"],
        potentialInvestors: ["Local Angels", "Y Combinator", "Incubators"]
      }
    }
  };
};

// Local chatbot dialogue
export const generateClientChat = (userQuery) => {
  const query = userQuery.toLowerCase();
  
  if (query.includes("lytro")) {
    return `### 📸 Reviving Lytro Light Field Cameras

Lytro had ground-breaking **volumetric optical data captures** but failed because processing light fields took minutes on CPU chips, and final exports were low resolution (1-2MP).

**How to fix it today:**
* **Physics engine acceleration**: Use NeRFs (Neural Radiance Fields) and 3D Gaussian Splatting to compile volumetric pictures in milliseconds on modern phone GPUs.
* **VR Content Ecosystem**: Target spatial headset displays (like Meta Quest or Apple Vision Pro) where 3D parallax is a killer feature.
* **Modern TRL**: Push it from TRL 7 to TRL 9 by coding open-source Unity API capture modules.`;
  }

  if (query.includes("pebble")) {
    return `### ⌚ Reviving Pebble Smartwatches

Pebble was loved for its **e-ink screens and 10-day battery**, but got squashed when Apple watchOS entered with rich colors, biological health rings, and massive dev capital.

**Revival ideas for a Hackathon:**
* **Color E-Paper**: Use Kaleido 3 color e-ink displaying static notifications without drawing high current.
* **Digital Detox Device**: Market it as a distraction-free screen that summaries phone notifications locally using tinyML profiles, keeping screen-time low.`;
  }

  if (query.includes("glass")) {
    return `### 🕶️ Reviving Google Glass

Google Glass pioneered **heads-up prism overlays** but suffered severe privacy backlashes (fear of constant video recordings), prism eye-strain under bright sunlight, and quick battery drain.

**The modern revival vector:**
* **Mechanical Shutter**: Install a mechanical shutter that slides over the camera lens to reassure surrounding crowds.
* **MicroLED Waveguide displays**: Use bright waveguides for outdoor transparency.
* **Voice LLM Copilots**: Connect Whisper and GPT-4o style vision models to provide contextual overlay help hands-free.`;
  }

  if (query.includes("hackathon") || query.includes("idea") || query.includes("suggest")) {
    return `### 💡 Hackathon Project Recommendations

Here are three high-potential ideas to revive forgotten innovations:
1. **Gaussian Optical Refocuser (Inspired by Lytro)**:
   * **Project**: A web dashboard turning standard mobile camera frames into volumetric splats.
   * **Stack**: React, Three.js, Gaussian Splatting APIs.
2. **Focus Wristwear (Inspired by Pebble)**:
   * **Project**: An e-ink smartband that runs localized notification filtering using micro-LLMs.
   * **Stack**: Arduino/Microcontrollers, Bluetooth BLE, custom React dashboard.
3. **Privacy-First AR Assistant (Inspired by Google Glass)**:
   * **Project**: Smart glasses interface running on-device Whisper models with a visible privacy shutter.
   * **Stack**: Python, OpenCV, React client.`;
  }

  return `### 👋 Hello from ReviveAI! (Offline Copilot Core)

The API server is running in local backup mode. I can still help you audit models, look up failed patents, or generate roadmaps!

**Ask me questions like:**
* 🔍 *"How do we revive the Lytro camera?"*
* 💡 *"Suggest a hackathon project idea."*
* 📊 *"Tell me about Google Glass bottlenecks."*`;
};
