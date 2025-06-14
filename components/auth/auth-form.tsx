'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Sparkles, Loader2, Mail, Lock } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData, isSignUp: boolean) => {
    setIsLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(data.email, data.password)
        : await signIn(data.email, data.password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        reset();
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-mesh">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="glass-effect border-white/20 shadow-glow-lg">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-blue-400 animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-ping opacity-20">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-3xl font-montserrat font-bold gradient-text">
                AnimateAI
              </CardTitle>
            </div>
            <CardDescription className="text-slate-300 text-base leading-relaxed">
              Create stunning animations with AI-powered natural language commands
            </CardDescription>
          </CardHeader>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mx-6 mb-6 bg-white/5 border border-white/10">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 transition-all duration-200"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-300 transition-all duration-200"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="animate-slide-up">
              <form onSubmit={handleSubmit((data) => onSubmit(data, false))}>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signin-email" className="text-slate-200 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400 animate-fade-in">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signin-password" className="text-slate-200 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 animate-fade-in">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="animate-slide-up">
              <form onSubmit={handleSubmit((data) => onSubmit(data, true))}>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="signup-email" className="text-slate-200 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                        {...register('email')}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400 animate-fade-in">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="signup-password" className="text-slate-200 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                        {...register('password')}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 animate-fade-in">{errors.password.message}</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02] shadow-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}