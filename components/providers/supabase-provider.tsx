'use client';

import { useAuth } from '@/hooks/use-auth';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  useAuth(); // Initialize auth state
  
  return <>{children}</>;
}