import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching animation for message:", messageId);

    // First, get the message to get its creation time
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (messageError) {
      console.error("Error fetching message:", messageError);
      return NextResponse.json(
        { error: "Failed to fetch message" },
        { status: 500 }
      );
    }

    if (!message) {
      console.log("No message found with ID:", messageId);
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // Calculate time window (1 minute before and after message creation)
    const messageTime = new Date(message.created_at);
    const timeWindowStart = new Date(messageTime.getTime() - 60000); // 1 minute before
    const timeWindowEnd = new Date(messageTime.getTime() + 60000); // 1 minute after

    console.log("Time window:", {
      start: timeWindowStart.toISOString(),
      end: timeWindowEnd.toISOString(),
    });

    // Get the animation created within the time window
    const { data: animation, error: animationError } = await supabase
      .from("animations")
      .select("*")
      .eq("project_id", message.project_id)
      .gte("created_at", timeWindowStart.toISOString())
      .lte("created_at", timeWindowEnd.toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (animationError) {
      console.error("Error fetching animation:", animationError);
      return NextResponse.json(
        { error: "Failed to fetch animation" },
        { status: 500 }
      );
    }

    if (!animation) {
      console.log("No animation found for message:", messageId);
      return NextResponse.json(
        { error: "Animation not found" },
        { status: 404 }
      );
    }

    console.log("Found animation:", {
      id: animation.id,
      status: animation.status,
      created_at: animation.created_at,
    });

    return NextResponse.json(animation);
  } catch (error) {
    console.error("Unexpected error in by-message route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 