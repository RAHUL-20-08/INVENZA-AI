export const getKnowledgeGraph = (req, res) => {
  const nodes = [
    // Sectors
    { id: "s-photo", label: "Computational Photo", type: "sector", group: 1 },
    { id: "s-wear", label: "Wearables", type: "sector", group: 1 },
    { id: "s-ar", label: "Augmented Reality", type: "sector", group: 1 },
    { id: "s-micro", label: "Micro-Mobility", type: "sector", group: 1 },
    { id: "s-bio", label: "Bio-Diagnostics", type: "sector", group: 1 },

    // Historical Innovations (Failed)
    { id: "i-lytro", label: "Lytro Camera", type: "failed", group: 2 },
    { id: "i-pebble", label: "Pebble Watch", type: "failed", group: 2 },
    { id: "i-glass", label: "Google Glass", type: "failed", group: 2 },
    { id: "i-segway", label: "Segway PT", type: "failed", group: 2 },
    { id: "i-theranos", label: "Theranos Lab", type: "failed", group: 2 },
    { id: "i-ara", label: "Project Ara", type: "failed", group: 2 },

    // Historic Bottlenecks
    { id: "b-sensor", label: "Expensive Micro-Lens", type: "bottleneck", group: 3 },
    { id: "b-mono", label: "Monochrome screen", type: "bottleneck", group: 3 },
    { id: "b-prism", label: "Prism optical strain", type: "bottleneck", group: 3 },
    { id: "b-gyro", label: "Heavy Gyroscopes", type: "bottleneck", group: 3 },
    { id: "b-science", label: "Fabricated Data", type: "bottleneck", group: 3 },
    { id: "b-unipro", label: "Slow UniPro Bus", type: "bottleneck", group: 3 },

    // Modern Enablers (Solutions)
    { id: "sol-nerf", label: "3D Gaussian Splatting", type: "solution", group: 4 },
    { id: "sol-kaleido", label: "Kaleido 3 Color E-Ink", type: "solution", group: 4 },
    { id: "sol-waveguide", label: "MicroLED Waveguide", type: "solution", group: 4 },
    { id: "sol-adas", label: "ADAS & AI Geofencing", type: "solution", group: 4 },
    { id: "sol-spectro", label: "Laser Spectroscopy", type: "solution", group: 4 },
    { id: "sol-pcie", label: "PCIe Gen 4 bus", type: "solution", group: 4 }
  ];

  const links = [
    // Connect innovations to their sectors
    { source: "i-lytro", target: "s-photo" },
    { source: "i-pebble", target: "s-wear" },
    { source: "i-glass", target: "s-ar" },
    { source: "i-segway", target: "s-micro" },
    { source: "i-theranos", target: "s-bio" },
    { source: "i-ara", target: "s-wear" },

    // Connect innovations to their core failure bottlenecks
    { source: "i-lytro", target: "b-sensor" },
    { source: "i-pebble", target: "b-mono" },
    { source: "i-glass", target: "b-prism" },
    { source: "i-segway", target: "b-gyro" },
    { source: "i-theranos", target: "b-science" },
    { source: "i-ara", target: "b-unipro" },

    // Connect failure bottlenecks to modern solutions that resolve them
    { source: "b-sensor", target: "sol-nerf" },
    { source: "b-mono", target: "sol-kaleido" },
    { source: "b-prism", target: "sol-waveguide" },
    { source: "b-gyro", target: "sol-adas" },
    { source: "b-science", target: "sol-spectro" },
    { source: "b-unipro", target: "sol-pcie" },

    // Connect solutions back to sector opportunity
    { source: "sol-nerf", target: "s-photo" },
    { source: "sol-kaleido", target: "s-wear" },
    { source: "sol-waveguide", target: "s-ar" },
    { source: "sol-adas", target: "s-micro" },
    { source: "sol-spectro", target: "s-bio" }
  ];

  res.json({ success: true, nodes, links });
};
