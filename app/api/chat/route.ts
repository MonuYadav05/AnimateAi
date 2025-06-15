import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Mark this route as dynamic
export const dynamic = 'force-dynamic';

// Create Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
   - For NumberLine, do NOT use include_numbers=True - create numbers manually with Text()
   - For graphs, use ParametricFunction or FunctionGraph instead of MathTex

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
   - For graphs, use Create() with rate_func=linear for smooth drawing
   - NEVER use move_along_path or similar path-following methods
   - For moving objects along curves, use point_from_proportion and move_to

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
   - Axes(x_range, y_range)
   - FunctionGraph(lambda x: f(x), x_range)

6. GRAPH ANIMATION RULES:
   - Always create axes first with Axes()
   - Add axis labels using Text()
   - Create number labels manually using Text()
   - Use FunctionGraph for plotting functions
   - For moving points:
     * Calculate points using point_from_proportion
     * Use move_to with animate
     * Update labels using Transform
   - Keep animations simple and clear
   - Use appropriate x_range and y_range
   - Add clear labels and titles

RESPONSE FORMAT:
1. Start with a clear, concise description of what the animation will show and how it will help understand the concept.
2. Keep the description focused on the visual elements and learning outcomes.
3. Avoid technical details, implementation notes, or code explanations in the description.
4. The description should be engaging and easy to understand for non-technical users.

EXAMPLE RESPONSE:
"This animation will demonstrate the Pythagorean theorem through a visual and intuitive approach. You'll see two squares representing the shorter sides of a right triangle, which will then transform to show how their areas combine to form the square of the hypotenuse. The animation uses color-coding and smooth transitions to make the mathematical relationship clear and memorable."

Remember to generate the Manim code after the description, but keep it separate from the user-facing content.`;

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
    console.log(manimCode)
    // If Manim code was generated, create an animation record
    if (manimCode) {
      try {
        const { data, error } = await supabase.from('animations').insert({
          project_id: projectId,
          manim_code: manimCode,
          status: 'pending',
        }).select();

        if (error) {
          console.error('Error storing animation:', error);
          throw error;
        }

        console.log('Successfully stored animation:', data);
      } catch (error) {
        console.error('Failed to store animation:', error);
        // Continue with the response even if animation storage fails
      }
    }

    // Format the AI response to be more readable
    const formatResponse = (response: string) => {
      // Extract only the explanation part (before "Manim Code:")
      const explanation = response.split('**Manim Code:**')[0].trim();
      
      // Remove any markdown headers, bullet points, and clean up
      return explanation
        .replace(/^\d+\.\s+\*\*.*?\*\*:/gm, '') // Remove numbered headers
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/^\s*[\*\-]\s*/gm, '') // Remove bullet points
        .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered lists
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
        .trim();
    };

    return NextResponse.json({
      content: formatResponse(aiResponse),
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