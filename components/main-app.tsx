'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { ChatInterface } from '@/components/chat/chat-interface';
import { VideoPlayer } from '@/components/video/video-player';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useState, useEffect } from 'react';
import PricingPlans from './payments/PricingPlans';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function MainApp() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user } = useAuth();
    const [hasPremium, setHasPremium] = useState(false);
    const [lastPayment, setLastPayment] = useState<{ amount: number | null, created_at: string, payment_id: string } | null>(null);

    useEffect(() => {
        const checkPremium = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('users')
                .select('id, plan, has_unlimited_access')
                .eq('auth_user_id', user.id)
                .single();
            setHasPremium(data?.plan === 'pro' || data?.has_unlimited_access);

            if (data?.id) {
                const { data: payment } = await supabase
                    .from('payments')
                    .select('created_at, payment_id')
                    .eq('user_id', data.id)
                    .eq('status', 'success')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                if (payment) {
                    let amount = 0;
                    if (payment.payment_id) {
                        try {
                            const res = await fetch('/api/payments/get-amount', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ payment_id: payment.payment_id }),
                            });
                            const data = await res.json();
                            amount = data.amount;
                        } catch { }
                    }
                    setLastPayment({ amount, created_at: payment.created_at, payment_id: payment.payment_id });
                } else {
                    setLastPayment(null);
                }
            }
        };
        checkPremium();
    }, [user]);

    return (
        <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            {/* Sidebar */}
            <Sidebar onSettingsClick={() => setSettingsOpen(true)} />

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

            {/* Settings Modal */}
            <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogContent className="max-w-7xl">
                    <DialogHeader>
                        <DialogTitle>Plans & Billing</DialogTitle>
                    </DialogHeader>
                    {hasPremium ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <h2 className="text-3xl font-bold mb-4 text-green-400">You have AnimateAI Pro!</h2>
                            <p className="text-lg text-white/80 mb-4">Enjoy unlimited access to all features.</p>
                            {lastPayment && lastPayment.amount != null && (
                                <div className="text-white/80 text-center">
                                    <div>
                                        <span className="font-semibold">Amount Paid:</span> ₹{(lastPayment.amount / 100).toFixed(2)}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Date:</span> {new Date(lastPayment.created_at).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <PricingPlans closeModal={() => setSettingsOpen(false)} />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}