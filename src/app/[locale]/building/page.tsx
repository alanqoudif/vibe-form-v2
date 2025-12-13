"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Sparkles, Bot, Layout, Loader2, CheckCircle2 } from 'lucide-react';

function BuildingPageContent() {
    const searchParams = useSearchParams();
    const prompt = searchParams.get('prompt');
    const router = useRouter();
    const t = useTranslations('building');

    const [step, setStep] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    const steps = [
        { message: t('analyzing') || 'Analyzing your request...', icon: Bot, color: 'text-blue-500' },
        { message: t('structuring') || 'Designing form structure...', icon: Layout, color: 'text-purple-500' },
        { message: t('generating') || 'Generating intelligent questions...', icon: Sparkles, color: 'text-amber-500' },
        { message: t('finalizing') || 'Finalizing your form...', icon: CheckCircle2, color: 'text-green-500' },
    ];

    useEffect(() => {
        if (!prompt) {
            router.push('/');
            return;
        }

        const createForm = async () => {
            try {
                // Simulate steps for better UX
                const interval = setInterval(() => {
                    setStep(s => Math.min(s + 1, steps.length - 1));
                }, 1500);

                const response = await fetch('/api/ai/generate-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt }),
                });

                clearInterval(interval);

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to generate form');
                }

                const { formId } = await response.json();

                // Final success step
                setStep(steps.length - 1);
                setTimeout(() => {
                    router.push(`/forms/${formId}/builder`);
                }, 1000);

            } catch (error) {
                console.error('Error generating form:', error);
                toast.error('Failed to generate form. Please try again.');
                setTimeout(() => router.push('/'), 2000);
            }
        };

        createForm();
    }, [prompt, router]);

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-md w-full relative z-10 glass rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col items-center text-center space-y-8">

                    {/* Animated Icon */}
                    <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 animate-bounce-slow">
                            <Bot className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-zinc-800 rounded-lg flex items-center justify-center shadow-md animate-pulse">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            {t('title') || 'AI Builder at Work'}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {t('subtitle') || 'Transforming your ideas into a powerful form'}
                        </p>
                    </div>

                    {/* Steps Progress */}
                    <div className="w-full space-y-4">
                        {steps.map((s, index) => {
                            const isActive = index === step;
                            const isCompleted = index < step;
                            const isPending = index > step;

                            return (
                                <div
                                    key={index}
                                    className={`flex items-center gap-4 transition-all duration-500 ${isActive ? 'scale-105 opacity-100' :
                                            isCompleted ? 'opacity-50' : 'opacity-30'
                                        }`}
                                >
                                    <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                    ${isActive || isCompleted ? 'border-primary bg-primary/10' : 'border-muted bg-muted/50'}
                  `}>
                                        {isActive ? (
                                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                        ) : isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                                        )}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                                        {s.message}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default function BuildingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full relative z-10 glass rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                            <Bot className="w-10 h-10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Loading...
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <BuildingPageContent />
        </Suspense>
    );
}
