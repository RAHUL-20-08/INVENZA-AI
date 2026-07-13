export const getPaperLinks = (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: 'Paper ID is required.' });
  }

  // Real-world official scientific explanation page links
  const links = {
    'paper-01': {
      name: 'Stanford Light Field Camera Project',
      url: 'http://graphics.stanford.edu/papers/lfcamera/'
    },
    'paper-02': {
      name: 'EPDiy ESP32 E-Paper Controller Docs',
      url: 'https://vroland.de/'
    },
    'paper-03': {
      name: 'Google Glass Developer Portal',
      url: 'https://developers.google.com/glass'
    },
    'paper-04': {
      name: 'B-ROBOT Coaxial Stabilization Explainer',
      url: 'http://jjrobots.com/b-robot-evo-2-much-more-than-a-self-balancing-robot/'
    }
  };

  const matched = links[id];

  if (!matched) {
    return res.status(404).json({
      success: false,
      message: `Project link for "${id}" not found.`
    });
  }

  res.json({
    success: true,
    id,
    ...matched
  });
};
