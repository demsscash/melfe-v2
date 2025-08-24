// src/components/sections/PromoSection.tsx

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function PromoSection(): JSX.Element {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background avec dégradé */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800" />

            {/* Motifs décoratifs */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full" />
                <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full" />
                <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full" />
                <div className="absolute bottom-32 right-1/3 w-24 h-24 border-2 border-white rounded-full" />
            </div>

            <div className="relative max-w-[1400px] mx-auto px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-wide">
                            SOLDES D&apos;ÉTÉ
                        </h2>
                        <p className="text-xl md:text-2xl text-white/90 font-light">
                            Jusqu&apos;à -40% sur une sélection de voiles premium
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                        Profitez de nos offres exceptionnelles sur les plus belles créations de nos artisans.
                        Une occasion unique de découvrir l&apos;élégance mauritanienne à prix réduit.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            size="lg"
                            className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-sm uppercase tracking-[2px] transition-all duration-300 hover:scale-105"
                            asChild
                        >
                            <Link href="/boutique?filter=sale">
                                Voir les offres
                            </Link>
                        </Button>

                        <Button
                            variant="ghost"
                            size="lg"
                            className="text-white border border-white/30 hover:bg-white/10 px-8 py-4 text-sm uppercase tracking-[2px] backdrop-blur-sm"
                            asChild
                        >
                            <Link href="/collections">
                                Toutes les collections
                            </Link>
                        </Button>
                    </div>

                    {/* Informations complémentaires */}
                    <div className="pt-8 space-y-2">
                        <p className="text-sm text-white/70 uppercase tracking-wide">
                            Offre valable jusqu&apos;au 31 août 2024
                        </p>
                        <div className="flex justify-center space-x-8 text-xs text-white/60">
                            <span>• Livraison gratuite</span>
                            <span>• Retour sous 30 jours</span>
                            <span>• Paiement sécurisé</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Particules flottantes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s' }} />
                <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-ping" style={{ animationDelay: '3s' }} />
            </div>
        </section>
    );
}