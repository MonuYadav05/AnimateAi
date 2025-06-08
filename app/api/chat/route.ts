import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
      console.log("from here")

    const { projectId, messages } = await request.json();

    if (!projectId || !messages) {
      console.log("from here")
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the latest user message
      console.log("from here 2")

    const userMessage = messages[messages.length - 1];
    if (!userMessage || userMessage.role !== 'user') {
      return NextResponse.json(
        { error: 'Invalid message format' },
        { status: 400 }
      );
    }

    // Build conversation context
    const conversationHistory = messages
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n');

    // System prompt for Manim code generation
    const systemPrompt = `You are an AI assistant specialized in creating mathematical animations using Manim (Mathematical Animation Engine). 

Your role is to:
1. Generate clean, well-commented Manim Python code
2. Provide clear explanations of the animation
3. Include setup instructions and requirements
4. Format code blocks properly with \`\`\`python markers

Guidelines for Manim code:
- Always import necessary modules (from manim import *)
- Use clear, descriptive variable names
- Include comments explaining each step
- Follow Manim best practices
- Focus on educational and visually appealing animations
- Include setup instructions and requirements
- Format code blocks with proper \`\`\`python markers

Previous conversation:
${conversationHistory}

User's latest request: ${userMessage.content}

Please respond with:
1. A brief explanation of what the animation will show
2. Setup instructions and requirements
3. The complete Manim code wrapped in \`\`\`python code blocks
4. Instructions for running the code`;

    // Initialize Gemini API
    const geminiApiKey = process.env.GOOGLE_API_KEY;
    console.log(geminiApiKey)
    if (!geminiApiKey) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage.content);
    const response = await result.response;
    console.log(response);
    const aiResponse = response.text();

    if (!aiResponse) {
      throw new Error('No response from LLM');
    }

    // Extract Manim code if present
    const codeMatch = aiResponse.match(/```python\n([\s\S]*?)\n```/);
    const manimCode = codeMatch ? codeMatch[1] : null;

    // If Manim code was generated, create an animation record
    if (manimCode) {
      const supabase = createServerSupabaseClient();
      
      await supabase.from('animations').insert({
        project_id: projectId,
        manim_code: manimCode,
        status: 'pending',
      });

      // In a real implementation, you would trigger your rendering pipeline here
      // For example: await triggerRenderingPipeline(projectId, manimCode);
    }

    return NextResponse.json({
      content: aiResponse,
      hasCode: !!manimCode,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}