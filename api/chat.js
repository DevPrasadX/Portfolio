export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
    const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct';

    if (!HUGGINGFACE_API_KEY) {
      return res.status(500).json({ error: 'Hugging Face API key is not configured' });
    }

    const HUGGINGFACE_API_URL = `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`;

    const response = await fetch(HUGGINGFACE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Hugging Face API error: ${response.status}`,
        details: errorText 
      });
    }

    const data = await response.json();

    // Handle different response formats from Hugging Face
    let generatedText = '';
    
    if (Array.isArray(data) && data.length > 0) {
      // Some models return an array with generated_text
      if (data[0].generated_text) {
        generatedText = data[0].generated_text.trim();
      }
    } else if (data.generated_text) {
      // Some models return generated_text directly
      generatedText = data.generated_text.trim();
    } else if (typeof data === 'string') {
      // Some models return a string directly
      generatedText = data.trim();
    } else {
      return res.status(500).json({ 
        error: 'Invalid response format from Hugging Face API',
        data: data 
      });
    }

    return res.status(200).json({ response: generatedText });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

