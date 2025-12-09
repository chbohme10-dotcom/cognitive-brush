import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// All available morph targets that can be generated
const morphTargets = {
  face: [
    'faceWidth', 'faceHeight', 'jawWidth', 'jawHeight', 'chinLength', 'chinWidth',
    'cheekbones', 'cheekFullness', 'foreheadHeight', 'foreheadWidth',
    'eyeSize', 'eyeSpacing', 'eyeHeight', 'eyeAngle', 'eyeDepth',
    'browHeight', 'browThickness', 'browAngle',
    'noseSize', 'noseWidth', 'noseHeight', 'noseBridge', 'noseTip', 'nostrilSize',
    'lipSize', 'lipWidth', 'upperLipThickness', 'lowerLipThickness', 'mouthWidth',
    'earSize', 'earAngle'
  ],
  body: [
    'height', 'weight', 'muscle', 'bodyFat',
    'shoulders', 'chest', 'torso', 'waist',
    'arms', 'armMuscle', 'forearms',
    'hips', 'legs', 'thighs', 'calves',
    'hands', 'feet'
  ],
  demographics: [
    'age', 'gender', 'ethnicity1', 'ethnicity2', 'ethnicity3'
  ],
  expressions: [
    'smile', 'anger', 'sadness', 'surprise', 'fear', 'disgust',
    'browUp', 'browDown', 'eyesClosed', 'mouthOpen'
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating character morphs from description:', description);

    const systemPrompt = `You are an expert 3D character artist. Given a text description of a character, generate precise morph target values (0-100) for a parametric 3D character model.

Available morph targets:
Face: ${morphTargets.face.join(', ')}
Body: ${morphTargets.body.join(', ')}
Demographics: ${morphTargets.demographics.join(', ')}

Guidelines:
- 50 is the neutral/default value for most morphs
- age: 0=child, 25=young adult, 50=middle-aged, 75=elderly, 100=very old
- gender: 0=feminine, 50=androgynous, 100=masculine
- ethnicity1=Asian, ethnicity2=African, ethnicity3=Caucasian (should sum to ~100)
- For body morphs: 0=minimal, 50=average, 100=maximum
- Be precise and consider how features interact realistically`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate morph values for this character: "${description}"` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "set_character_morphs",
              description: "Set the morph target values for the 3D character",
              parameters: {
                type: "object",
                properties: {
                  morphs: {
                    type: "object",
                    description: "Object containing morph target names and their values (0-100)",
                    additionalProperties: { type: "number" }
                  },
                  reasoning: {
                    type: "string",
                    description: "Brief explanation of the character interpretation"
                  }
                },
                required: ["morphs", "reasoning"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "set_character_morphs" } }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits to your workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data, null, 2));

    // Extract the function call result
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error('No tool call in response');
    }

    const result = JSON.parse(toolCall.function.arguments);
    
    console.log('Generated morphs:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-character-morphs function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
