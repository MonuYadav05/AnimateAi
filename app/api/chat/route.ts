import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { projectId, messages } = await request.json();

    if (!projectId || !messages) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get the latest user message
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
    const systemPrompt = `You are an expert at creating educational animations using Manim. Your role is to create clean, educational, and visually appealing animations that work perfectly with our renderer.

IMPORTANT RULES FOR MANIM CODE GENERATION:

1. NEVER use LaTeX or MathTex:
   - Use Text() with Unicode characters for mathematical expressions
   - Example: Text("a² + b² = c²") instead of MathTex("a^2 + b^2 = c^2")

2. POSITIONING RULES:
   - Use ONLY these positioning methods:
     * move_to(point) - for absolute positioning
     * next_to(mobject, direction, buff=0.2) - for relative positioning
     * shift(vector) - for small adjustments
   - NEVER use get_bottom_left(), get_top_right(), etc.
   - For relative positioning, use:
     * LEFT, RIGHT, UP, DOWN
     * ORIGIN, UP, DOWN, LEFT, RIGHT
     * Vector arithmetic (e.g., point + RIGHT * 2)

3. ANIMATION RULES:
   - Use ONLY these animation methods:
     * Create(mobject)
     * Write(mobject)
     * FadeIn(mobject)
     * FadeOut(mobject)
     * Transform(mobject1, mobject2)
   - For movement animations:
     * mobject.animate.move_to(point)
     * mobject.animate.shift(vector)
     * mobject.animate.next_to(mobject, direction)
   - Always specify run_time for complex animations

4. CODE STRUCTURE:
   - Single Scene class
   - construct(self) method
   - Clear variable names
   - Helpful comments
   - Proper spacing and organization

5. COMMON SHAPES AND OBJECTS:
   - Square(side_length=2)
   - Circle(radius=1)
   - Triangle()
   - Line(start, end)
   - Text("text")
   - Dot(point)

EXAMPLE FORMAT:
\`\`\`python
from manim import *

class MyScene(Scene):
    def construct(self):
        # Create objects
        square = Square(side_length=2)
        circle = Circle(radius=1)
        
        # Position objects
        circle.next_to(square, RIGHT, buff=0.5)
        
        # Animate
        self.play(Create(square))
        self.play(Create(circle))
        
        # Move objects
        self.play(
            square.animate.move_to(ORIGIN),
            circle.animate.next_to(square, UP, buff=0.2),
            run_time=2
        )
        self.wait(1)
\`\`\`

RESPONSE FORMAT:
1. Brief explanation of the animation
2. Complete Manim code
3. Any important notes about the animation

Remember: Keep animations simple, clean, and educational. Focus on clarity and proper positioning.`;

    // Initialize Gemini API
    const geminiApiKey = process.env.GOOGLE_API_KEY;
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