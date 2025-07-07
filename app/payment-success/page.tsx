export default function PaymentSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 text-white">
            <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg mb-8">You now have unlimited access to AnimateAI Pro.</p>
            <div className="text-6xl mb-4">🎉</div>
            <a href="/" className="text-blue-400 underline">Go to Dashboard</a>
        </div>
    );
} 