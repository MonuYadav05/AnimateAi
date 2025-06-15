'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { VideoPlayer } from '@/components/video/video-player';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

export function MainApp() {
    return (
        <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
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

                    <ResizableHandle withHandle className="bg-white/10 hover:bg-white/20 transition-colors duration-200" />

                    {/* Video Player */}
                    <ResizablePanel defaultSize={40} minSize={30}>
                        <VideoPlayer />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    );
}