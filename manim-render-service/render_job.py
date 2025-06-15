import os
import subprocess
import uuid
import re
import glob

def render_video(code: str, render_id: str) -> str:
    os.makedirs("renders", exist_ok=True)
    filename = f"renders/{uuid.uuid4().hex}.py"

    # Replace MathTex with Text and handle mathematical expressions
    code = code.replace('MathTex("a")', 'Text("a")')
    code = code.replace('MathTex("b")', 'Text("b")')
    code = code.replace('MathTex("c")', 'Text("c")')
    code = code.replace('MathTex("a^2 + b^2 = c^2")', 'Text("a² + b² = c²")')

    # Extract scene name from the code
    scene_match = re.search(r'class\s+(\w+)\(Scene\)', code)
    if not scene_match:
        raise ValueError("No Scene class found in the code")
    scene_name = scene_match.group(1)

    with open(filename, "w", encoding='utf-8') as f:
        f.write(code)

    try:
        subprocess.run(["manim", filename, scene_name, "-o", f"{render_id}.mp4", "-qh"], check=True)
        
        # Find the rendered video file
        video_pattern = os.path.join("media", "videos", "**", "1080p60", f"{render_id}.mp4")
        video_files = glob.glob(video_pattern, recursive=True)
        
        if not video_files:
            raise FileNotFoundError(f"Could not find rendered video file for {render_id}")
            
        # Return the full path of the video file
        return video_files[0]
        
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Manim render failed: {str(e)}")