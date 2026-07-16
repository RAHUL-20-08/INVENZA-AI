import 'dotenv/config';

export const fetchCerebrasSearch = async (query) => {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) {
    console.warn("CEREBRAS_API_KEY is not defined.");
    return null;
  }

  const systemPrompt = `You are INVENZA AI, an advanced research search engine assistant. 
Your task is to analyze the user's query and generate a structured JSON object representing the closest matching entity from the following domains: Research Papers, Patents, Startups, or Failed Startups. 
Return ONLY valid JSON. Do not return markdown blocks or conversational text.

The JSON schema must exactly match this structure:
{
  "title": "String (Name of startup, patent, or paper)",
  "inventor": "String (Founder, author, or inventor)",
  "year": Number (Year of founding, filing, or publishing),
  "classifications": "String (Sector or tech category)",
  "claims": ["String", "String", "String"] (3 key technical claims, features, or product capabilities),
  "description": "String (A comprehensive abstract or summary of the entity)"
}`;

  try {
    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3.3-70b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      console.error(`Cerebras API Error: ${response.status} ${response.statusText}`);
      const errText = await response.text();
      console.error("Cerebras response:", errText);
      return null;
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error("Failed to parse JSON from Cerebras:", content);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Network error calling Cerebras API:", error);
    return null;
  }
};
