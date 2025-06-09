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
      <div className="h-screen w-full flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header />

          <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
            {/* Chat Interface */}
            <ResizablePanel defaultSize={60} minSize={40} className="overflow-hidden">
              <div className="h-full overflow-auto">
                <ChatInterface />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Video Player */}
            <ResizablePanel defaultSize={40} minSize={30} className="overflow-hidden">
              <div className="h-full overflow-auto">
                <VideoPlayer />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ProtectedRoute>
  );
}