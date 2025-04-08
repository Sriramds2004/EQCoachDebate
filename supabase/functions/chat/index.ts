import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a chat context that guides the AI to act as an emotional intelligence and debate coach
    const context = `You are an expert emotional intelligence and debate coach. Your role is to help users:
    1. Understand and manage their emotions
    2. Develop better communication skills
    3. Master the art of persuasive argumentation
    4. Build empathy and social awareness
    
    Analyze the user's message and provide constructive feedback and guidance.`;

    const prompt = `${context}\n\nUser message: ${message}`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});