// src/components/ui/MelhfaLoader.tsx

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface MelhfaLoaderProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    text?: string;
    color?: 'blue' | 'purple' | 'pink' | 'gold' | 'emerald' | 'white';
}

const sizeClasses = {
    sm: 'w-16 h-12',
    md: 'w-24 h-18',
    lg: 'w-32 h-24',
    xl: 'w-48 h-36'
};

const colorClasses = {
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    pink: 'text-pink-500',
    gold: 'text-yellow-500',
    emerald: 'text-emerald-500',
    white: 'text-gray-100'
};

export function MelhfaLoader({
    size = 'md',
    className,
    text,
    color = 'purple'
}: MelhfaLoaderProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
            <div className={cn("relative", sizeClasses[size])}>
                {/* Melhfa Mauritanien Traditionnel */}
                <svg
                    className={cn("animate-pulse", colorClasses[color])}
                    viewBox="0 0 240 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {/* Dégradés pour l'effet de transparence et de tissu */}
                    <defs>
                        <linearGradient id="melhfaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
                            <stop offset="30%" stopColor="currentColor" stopOpacity="0.7" />
                            <stop offset="70%" stopColor="currentColor" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="melhfaGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>

                    {/* Corps principal du melhfa - forme fluide et élégante */}
                    <path
                        d="M20 40 Q60 20 120 25 Q180 20 220 40 Q210 80 200 120 Q190 140 180 160 Q140 170 120 165 Q80 170 60 160 Q40 140 30 120 Q20 80 20 40 Z"
                        fill="url(#melhfaGradient)"
                        className="animate-melhfa-float"
                    />

                    {/* Pli du voile - effet de profondeur */}
                    <path
                        d="M40 60 Q80 45 120 50 Q160 45 200 60 Q190 90 180 120 Q160 130 120 125 Q80 130 60 120 Q50 90 40 60 Z"
                        fill="url(#melhfaGradient2)"
                        className="animate-melhfa-fold"
                    />

                    {/* Bordure brodée traditionnelle */}
                    <path
                        d="M20 40 Q60 20 120 25 Q180 20 220 40"
                        stroke="url(#borderGradient)"
                        strokeWidth="2"
                        fill="none"
                        className="animate-melhfa-border"
                    />

                    {/* Motifs géométriques mauritaniens */}
                    <g className="animate-melhfa-patterns">
                        {/* Motif central */}
                        <circle cx="120" cy="80" r="3" fill="currentColor" opacity="0.6" />
                        <circle cx="120" cy="80" r="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />

                        {/* Motifs latéraux */}
                        <circle cx="80" cy="70" r="2" fill="currentColor" opacity="0.5" />
                        <circle cx="160" cy="70" r="2" fill="currentColor" opacity="0.5" />

                        {/* Petits motifs décoratifs */}
                        <rect x="100" y="100" width="40" height="1" fill="currentColor" opacity="0.4" />
                        <rect x="110" y="110" width="20" height="1" fill="currentColor" opacity="0.3" />
                    </g>

                    {/* Effet de brillance sur le tissu */}
                    <path
                        d="M60 50 Q100 40 140 50 Q130 70 120 90 Q100 85 80 90 Q70 70 60 50 Z"
                        fill="currentColor"
                        opacity="0.1"
                        className="animate-melhfa-shine"
                    />

                    {/* Franges du voile */}
                    <g className="animate-melhfa-fringe">
                        <line x1="25" y1="150" x2="25" y2="165" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                        <line x1="35" y1="155" x2="35" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        <line x1="45" y1="152" x2="45" y2="167" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                        <line x1="190" y1="150" x2="190" y2="165" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                        <line x1="200" y1="155" x2="200" y2="170" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                        <line x1="210" y1="152" x2="210" y2="167" stroke="currentColor" strokeWidth="1" opacity="0.6" />
                    </g>
                </svg>
            </div>

            {/* Texte de chargement */}
            {text && (
                <p className="text-sm text-gray-600 font-medium animate-pulse">
                    {text}
                </p>
            )}

            {/* Points de chargement */}
            <div className="flex space-x-1">
                <div className={cn("w-2 h-2 rounded-full animate-bounce", `bg-${color}-500`)} />
                <div className={cn("w-2 h-2 rounded-full animate-bounce", `bg-${color}-500`)} style={{ animationDelay: '0.1s' }} />
                <div className={cn("w-2 h-2 rounded-full animate-bounce", `bg-${color}-500`)} style={{ animationDelay: '0.2s' }} />
            </div>
        </div>
    );
}

// Loader en plein écran
export function MelhfaFullScreenLoader({
    text = "Chargement...",
    color = 'purple'
}: {
    text?: string;
    color?: MelhfaLoaderProps['color'];
}) {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <MelhfaLoader size="xl" text={text} color={color} />
            </div>
        </div>
    );
}

// Loader en ligne
export function MelhfaInlineLoader({
    text,
    size = 'sm',
    color = 'purple'
}: MelhfaLoaderProps) {
    return (
        <div className="flex items-center space-x-3">
            <MelhfaLoader size={size} color={color} />
            {text && (
                <span className="text-gray-600 text-sm">{text}</span>
            )}
        </div>
    );
}

// CSS à ajouter dans globals.css
export const melhfaLoaderStyles = `
@keyframes melhfa-float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  25% { 
    transform: translateY(-8px) rotate(1deg); 
  }
  50% { 
    transform: translateY(-4px) rotate(0deg); 
  }
  75% { 
    transform: translateY(-10px) rotate(-1deg); 
  }
}

@keyframes melhfa-fold {
  0%, 100% { 
    transform: translateY(0) scaleY(1); 
  }
  50% { 
    transform: translateY(-3px) scaleY(0.98); 
  }
}

@keyframes melhfa-border {
  0%, 100% { 
    stroke-dasharray: 0, 100; 
  }
  50% { 
    stroke-dasharray: 50, 50; 
  }
}

@keyframes melhfa-patterns {
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1); 
  }
  50% { 
    opacity: 0.9; 
    transform: scale(1.05); 
  }
}

@keyframes melhfa-shine {
  0%, 100% { 
    opacity: 0.05; 
    transform: translateX(0); 
  }
  50% { 
    opacity: 0.2; 
    transform: translateX(10px); 
  }
}

@keyframes melhfa-fringe {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  25% { 
    transform: translateY(2px) rotate(1deg); 
  }
  75% { 
    transform: translateY(-1px) rotate(-0.5deg); 
  }
}

.animate-melhfa-float {
  animation: melhfa-float 4s ease-in-out infinite;
}

.animate-melhfa-fold {
  animation: melhfa-fold 3s ease-in-out infinite 0.5s;
}

.animate-melhfa-border {
  animation: melhfa-border 2s ease-in-out infinite;
}

.animate-melhfa-patterns {
  animation: melhfa-patterns 3s ease-in-out infinite 1s;
}

.animate-melhfa-shine {
  animation: melhfa-shine 4s ease-in-out infinite 1.5s;
}

.animate-melhfa-fringe {
  animation: melhfa-fringe 2s ease-in-out infinite 0.8s;
}
`;