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
import { Sparkles, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-50"></div>
        <div className="relative z-10 text-center max-w-lg">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="relative">
              <Sparkles className="h-16 w-16 text-blue-400 animate-float" />
              <div className="absolute inset-0 h-16 w-16 text-blue-400 animate-ping opacity-20">
                <Sparkles className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl font-montserrat font-bold gradient-text">
              AnimateAI
            </h1>
          </div>
          <h2 className="text-3xl font-montserrat font-semibold text-white mb-6">
            Create Stunning Math Animations with AI
          </h2>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            Transform your mathematical concepts into beautiful, engaging animations using natural language commands. No coding required.
          </p>
          <div className="flex items-center justify-center gap-8 text-slate-400">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">10K+</div>
              <div className="text-sm">Animations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">500+</div>
              <div className="text-sm">Educators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 opacity-20">
          <div className="w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-float"></div>
        </div>
        <div className="absolute bottom-20 right-20 opacity-20">
          <div className="w-24 h-24 bg-purple-500 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-blue-400 animate-pulse-glow" />
                <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-ping opacity-20">
                  <Sparkles className="h-8 w-8" />
                </div>
              </div>
              <span className="text-3xl font-montserrat font-bold gradient-text">
                AnimateAI
              </span>
            </div>
            <p className="text-slate-300">Create stunning animations with AI</p>
          </div>

          <Card className="glass-effect border-white/20 shadow-glow-lg">
            <CardHeader className="text-center space-y-4 pb-8">
              <CardTitle className="text-2xl font-montserrat font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                Sign in to your account or create a new one to get started
              </CardDescription>
            </CardHeader>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2  mb-6 bg-white/5 border border-white/10">
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
                  <CardFooter className="flex flex-col space-y-4">
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
                        <>
                          Sign In
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <div className="text-center">
                      <Link href="/landing" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                        ← Back to landing page
                      </Link>
                    </div>
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
                  <CardFooter className="flex flex-col space-y-4">
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
                        <>
                          Create Account
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <div className="text-center">
                      <Link href="/landing" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                        ← Back to landing page
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}