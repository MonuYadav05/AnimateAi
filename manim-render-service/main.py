import time, os
from dotenv import load_dotenv
from supabase_client import supabase
from render_job import render_video

load_dotenv()

def get_public_url(filename):
    # Get the public URL for the video
    response = supabase.storage.from_("videos").get_public_url(f"videos/{filename}")
    return response

while True:
    print("🔍 Checking for new jobs...")
    jobs = supabase.table("animations").select("*").eq("status", "pending").limit(1).execute()

    if jobs.data:
        job = jobs.data[0]
        print("🎬 Processing:", job["id"])
        try:
            video_path = render_video(job["manim_code"], job["id"])
            filename = os.path.basename(video_path)

            with open(video_path, "rb") as f:
                supabase.storage.from_("videos").upload(f"videos/{filename}", f.read(), {"content-type": "video/mp4"})

            supabase.table("animations").update({
                "status": "completed",
                "video_url": f"videos/{filename}"
            }).eq("id", job["id"]).execute()

        except Exception as e:
            supabase.table("animations").update({
                "status": "error",
                "error_message": str(e)
            }).eq("id", job["id"]).execute()
    else:
        print("😴 No jobs. Sleeping...")
    time.sleep(int(os.getenv("POLL_INTERVAL", 10)))
