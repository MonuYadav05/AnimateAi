'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Sparkles,
    Play,
    Code,
    Zap,
    Users,
    Star,
    ArrowRight,
    CheckCircle,
    Brain,
    Palette,
    Rocket,
    Globe,
    Shield,
    Clock,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const features = [
        {
            icon: Brain,
            title: "AI-Powered Generation",
            description: "Transform natural language into stunning mathematical animations using advanced AI technology."
        },
        {
            icon: Code,
            title: "Manim Integration",
            description: "Leverage the power of Manim, the industry-standard mathematical animation engine."
        },
        {
            icon: Palette,
            title: "Visual Excellence",
            description: "Create professional-quality animations with beautiful visuals and smooth transitions."
        },
        {
            icon: Rocket,
            title: "Instant Rendering",
            description: "Watch your ideas come to life with our fast, cloud-based rendering pipeline."
        },
        {
            icon: Globe,
            title: "Collaborative",
            description: "Share projects, collaborate with teams, and build amazing animations together."
        },
        {
            icon: Shield,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with 99.9% uptime guarantee for your projects."
        }
    ];

    const testimonials = [
        {
            name: "Dr. Sarah Chen",
            role: "Mathematics Professor",
            avatar: "SC",
            content: "AnimateAI has revolutionized how I create educational content. My students are more engaged than ever!"
        },
        {
            name: "Marcus Rodriguez",
            role: "Content Creator",
            avatar: "MR",
            content: "The quality of animations I can create now is incredible. It's like having a professional animator at my fingertips."
        },
        {
            name: "Emily Watson",
            role: "Research Scientist",
            avatar: "EW",
            content: "Perfect for visualizing complex mathematical concepts. The AI understands exactly what I need."
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Free",
            description: "Perfect for getting started",
            features: [
                "5 animations per month",
                "Basic templates",
                "Community support",
                "720p rendering"
            ],
            popular: false
        },
        {
            name: "Pro",
            price: "$19",
            period: "/month",
            description: "For serious creators",
            features: [
                "Unlimited animations",
                "Premium templates",
                "Priority support",
                "4K rendering",
                "Advanced AI features",
                "Team collaboration"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations",
            features: [
                "Everything in Pro",
                "Custom integrations",
                "Dedicated support",
                "SLA guarantee",
                "Advanced analytics",
                "White-label options"
            ],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white overflow-x-hidden">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'glass-effect border-b border-white/10' : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Sparkles className="h-8 w-8 text-blue-400 animate-float" />
                                <div className="absolute inset-0 h-8 w-8 text-blue-400 animate-ping opacity-20">
                                    <Sparkles className="h-8 w-8" />
                                </div>
                            </div>
                            <span className="font-montserrat font-bold text-2xl gradient-text">
                                AnimateAI
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-slate-300 hover:text-white transition-colors duration-200">Features</a>
                            <a href="#testimonials" className="text-slate-300 hover:text-white transition-colors duration-200">Testimonials</a>
                            <a href="#pricing" className="text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
                            <Link href="/">
                                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-glow">
                                    Get Started
                                </Button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden glass-effect border-t border-white/10">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <a href="#features" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200">Features</a>
                            <a href="#testimonials" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200">Testimonials</a>
                            <a href="#pricing" className="block px-3 py-2 text-slate-300 hover:text-white transition-colors duration-200">Pricing</a>
                            <Link href="/" className="block px-3 py-2">
                                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="animate-fade-in">
                        <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2 text-sm font-medium">
                            <Zap className="h-4 w-4 mr-2" />
                            Powered by Advanced AI
                        </Badge>

                        <h1 className="text-5xl md:text-7xl font-montserrat font-bold mb-8 leading-tight">
                            Create Stunning
                            <span className="block gradient-text text-glow">
                                Math Animations
                            </span>
                            with AI
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                            Transform your mathematical concepts into beautiful, engaging animations using natural language.
                            No coding required – just describe what you want to see.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <Link href="/">
                                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-200 transform hover:scale-105 shadow-glow">
                                    Start Creating Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-4 text-lg transition-all duration-200">
                                <Play className="mr-2 h-5 w-5" />
                                Watch Demo
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">10K+</div>
                                <div className="text-slate-400">Animations Created</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">500+</div>
                                <div className="text-slate-400">Happy Educators</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">99.9%</div>
                                <div className="text-slate-400">Uptime</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
                                <div className="text-slate-400">Support</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 opacity-20">
                    <div className="w-20 h-20 bg-blue-500 rounded-full blur-xl animate-float"></div>
                </div>
                <div className="absolute top-40 right-10 opacity-20">
                    <div className="w-16 h-16 bg-purple-500 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 gradient-text">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Everything you need to create professional mathematical animations with the power of AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="glass-effect border-white/20 shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-8 text-center">
                                    <div className="relative mb-6">
                                        <feature.icon className="h-12 w-12 mx-auto text-blue-400 animate-float" />
                                        <div className="absolute inset-0 h-12 w-12 mx-auto text-blue-400 animate-ping opacity-20">
                                            <feature.icon className="h-12 w-12" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 gradient-text">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Create stunning animations in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-glow">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Describe Your Idea</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Simply type what you want to animate in natural language. "Show a sine wave transforming into a cosine wave"
                            </p>
                        </div>

                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-glow">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">AI Generates Code</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Our advanced AI understands your request and generates professional Manim Python code automatically
                            </p>
                        </div>

                        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <div className="relative mb-8">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto shadow-glow">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-white">Watch & Share</h3>
                            <p className="text-slate-300 leading-relaxed">
                                Your animation is rendered in high quality and ready to download, share, or embed anywhere
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 gradient-text">
                            Loved by Creators
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            See what educators, researchers, and content creators are saying about AnimateAI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="glass-effect border-white/20 shadow-glow hover:shadow-glow-lg transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                <CardContent className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{testimonial.name}</div>
                                            <div className="text-sm text-slate-400">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed mb-4">"{testimonial.content}"</p>
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 gradient-text">
                            Simple Pricing
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Choose the perfect plan for your animation needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`glass-effect border-white/20 shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in relative ${plan.popular ? 'ring-2 ring-blue-400/50' : ''
                                }`} style={{ animationDelay: `${index * 0.1}s` }}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}
                                <CardContent className="p-8 text-center">
                                    <h3 className="text-2xl font-semibold mb-4 text-white">{plan.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                                        {plan.period && <span className="text-slate-400">{plan.period}</span>}
                                    </div>
                                    <p className="text-slate-300 mb-8">{plan.description}</p>
                                    <ul className="space-y-3 mb-8">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center text-slate-300">
                                                <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className={`w-full font-semibold py-3 transition-all duration-200 transform hover:scale-105 ${plan.popular
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-glow'
                                        : 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                                        }`}>
                                        {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-montserrat font-bold mb-6 gradient-text">
                        Ready to Create Amazing Animations?
                    </h2>
                    <p className="text-xl text-slate-300 mb-12 leading-relaxed">
                        Join thousands of educators, researchers, and creators who are already using AnimateAI to bring their mathematical concepts to life.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/">
                            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-200 transform hover:scale-105 shadow-glow">
                                Start Creating Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8 py-4 text-lg transition-all duration-200">
                            <Clock className="mr-2 h-5 w-5" />
                            Schedule Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 glass-effect">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="h-8 w-8 text-blue-400" />
                                <span className="font-montserrat font-bold text-2xl gradient-text">
                                    AnimateAI
                                </span>
                            </div>
                            <p className="text-slate-300 mb-6 max-w-md">
                                Create stunning mathematical animations with the power of AI. Transform your ideas into beautiful visualizations effortlessly.
                            </p>
                            <div className="flex space-x-4">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                    <Globe className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                    <Users className="h-5 w-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                    <Star className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-slate-300">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Features</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Pricing</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Documentation</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-4">Support</h4>
                            <ul className="space-y-2 text-slate-300">
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Help Center</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-12 pt-8 text-center text-slate-400">
                        <p>&copy; 2024 AnimateAI. All rights reserved. Built with ❤️ for creators worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}