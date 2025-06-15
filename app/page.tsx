'use client';

import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth/auth-form';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MainApp } from '@/components/main-app';
export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <MainApp />;
}