import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

interface PricingPlan {
    name: string;
    price: string;
    period?: string;
    description: string;
    features: string[];
    popular: boolean;
}

const plans: PricingPlan[] = [
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

const handleProPayment = async (userId: string, router: any) => {
    const amount = 1900 * 100; // INR 1900 in paise
    // 1. Create order on backend
    const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, plan: 'pro', amount }),
    });
    const data = await res.json();
    if (!data.order_id) {
        alert('Failed to create order');
        return;
    }

    // 2. Open Razorpay Checkout
    const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: 'AnimateAI Pro',
        description: 'Unlimited access to chat',
        order_id: data.order_id,
        handler: async function (response: any) {
            // 3. Verify payment on backend
            console.log(response)
            const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    userId,
                }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
                router.push('/payment-success'); // or show a modal, etc.
            } else {
                alert(verifyData.error);
            }
        },
        prefill: {
            email: '', // Optionally fill from user profile
        },
        theme: { color: '#6366f1' },
    };

    // @ts-ignore
    const rzp = new window.Razorpay(options);
    rzp.open();
};

interface PricingPlansProps {
    closeModal?: () => void;
}

const PricingPlans = ({ closeModal }: PricingPlansProps) => {
    const { user } = useAuth();
    const router = useRouter();
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
                <Card key={index} className={`glass-effect border-white/20 shadow-glow hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in relative ${plan.popular ? 'ring-2 ring-blue-400/50' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}>
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
                            {plan.features.map((feature: string, featureIndex: number) => (
                                <li key={featureIndex} className="flex items-center text-slate-300">
                                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Button className={`w-full font-semibold py-3 transition-all duration-200 transform hover:scale-105 ${plan.popular
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-glow'
                            : 'bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30'
                            }`}
                            onClick={() => {
                                if (plan.name === 'Pro' && user) {
                                    if (closeModal) closeModal();
                                    handleProPayment(user.id, router);
                                }
                            }}>
                            {plan.name === 'Enterprise' ? 'Contact Sales' : 'Select Plan'}
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default PricingPlans; 