// src/components/layout/SiteLoader.tsx

'use client';

import { useState, useEffect } from 'react';
import { MelhfaLoader } from '@/components/ui/MelhfaLoader';

interface SiteLoaderProps {
    children: React.ReactNode;
    minLoadingTime?: number; // durée minimale en ms
}

export function SiteLoader({
    children,
    minLoadingTime = 2000
}: SiteLoaderProps) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, minLoadingTime);

        return () => clearTimeout(timer);
    }, [minLoadingTime]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <div className="flex flex-col items-center space-y-8">
                    {/* Logo simple */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-wider">
                        MELHFA
                    </h1>

                    {/* Loader voile uniquement */}
                    <MelhfaLoader size="xl" color="purple" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

// Version encore plus minimaliste - juste le voile
export function MinimalLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <MelhfaLoader size="xl" color="purple" />
            </div>
        );
    }

    return <>{children}</>;
}

// Version avec juste le logo et le voile, arrière-plan épuré
export function CleanLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center z-50">
                <div className="text-center space-y-6">
                    <div className="text-3xl font-light text-gray-700 tracking-[0.3em]">
                        MELHFA
                    </div>
                    <MelhfaLoader size="lg" color="purple" />
                </div>
            </div>
        );
    }

    return <>{children}</>;
}