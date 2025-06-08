import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();

    // Get the latest animation for this project
    const { data: animation, error } = await supabase
      .from('animations')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !animation) {
      return NextResponse.json(
        { error: 'No animation found for this project' },
        { status: 404 }
      );
    }

    // Update status to rendering
    await supabase
      .from('animations')
      .update({ status: 'rendering' })
      .eq('id', animation.id);

    // In a real implementation, you would:
    // 1. Queue the animation for rendering in your backend pipeline
    // 2. The pipeline would:
    //    - Execute the Manim code in a secure environment
    //    - Generate the video file
    //    - Upload the video to storage (e.g., Supabase Storage, S3)
    //    - Update the animation record with the video URL and status

    // For demo purposes, simulate the rendering process
    setTimeout(async () => {
      const supabase = createServerSupabaseClient();
      
      // Simulate success or error
      const success = Math.random() > 0.2; // 80% success rate for demo
      
      if (success) {
        // In reality, this would be the actual video URL from your storage
        const demoVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        
        await supabase
          .from('animations')
          .update({
            status: 'completed',
            video_url: demoVideoUrl,
          })
          .eq('id', animation.id);
      } else {
        await supabase
          .from('animations')
          .update({
            status: 'error',
            error_message: 'Failed to render animation. Please check your Manim code.',
          })
          .eq('id', animation.id);
      }
    }, 5000); // Simulate 5 second rendering time

    return NextResponse.json({
      message: 'Rendering started',
      animationId: animation.id,
    });

  } catch (error) {
    console.error('Render API error:', error);
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}