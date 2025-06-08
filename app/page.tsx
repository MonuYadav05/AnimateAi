'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { VideoPlayer } from '@/components/video/video-player';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="h-screen flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Chat Interface */}
            <ResizablePanel defaultSize={60} minSize={40}>
              <ChatInterface />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Video Player */}
            <ResizablePanel defaultSize={40} minSize={30}>
              <VideoPlayer />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ProtectedRoute>
  );
}