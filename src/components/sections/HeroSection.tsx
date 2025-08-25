// src/components/sections/HeroSection.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export default function HeroSection(): JSX.Element {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center bg-gray-50 mt-16">
            <div className="max-w-[1400px] mx-auto px-6 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div className={`space-y-8 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight leading-none tracking-tight text-black">
                                MELHFA
                                <br />
                                <span className="font-light">ÉLÉGANTE</span>
                            </h1>

                            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-lg">
                                Découvrez l&apos;art mauritanien à travers nos voiles d&apos;exception,
                                alliant tradition ancestrale et élégance contemporaine.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <Button
                                size="lg"
                                className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-sm uppercase tracking-[2px] transition-all duration-300 hover:scale-105"
                                asChild
                            >
                                <Link href="/boutique">
                                    Découvrir
                                </Link>
                            </Button>

                            <Button
                                variant="link"
                                className="text-black hover:opacity-60 text-sm uppercase tracking-[2px] p-0 h-auto border-b border-black pb-1"
                                asChild
                            >
                                <Link href="/collections">
                                    Collections
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className={`relative ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} lg:order-2`}>
                        <div className="relative">
                            {/* Image principale */}
                            <div className="relative h-[600px] lg:h-[700px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/melf2.jpg"
                                    alt="Melhfa Élégante"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />

                                {/* Badge sur l'image */}
                                <div className="absolute top-6 right-6">
                                    <Badge className="bg-black/80 text-white px-4 py-2 text-xs uppercase tracking-wide">
                                        Nouvelle Collection
                                    </Badge>
                                </div>
                            </div>

                            {/* Carte flottante */}
                            <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-xl p-6 rounded-xl shadow-xl max-w-[200px] border border-white/20">
                                <div className="space-y-4">
                                    <div className="relative h-24 w-full rounded-lg overflow-hidden">
                                        <Image
                                            src="/images/melf2.jpg"
                                            alt="Melhfa Premium"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-xs font-medium uppercase tracking-wide text-black">
                                            Melhfa Premium
                                        </h3>
                                        <p className="text-sm text-gray-600 font-light">
                                            À partir de 28.000 MRU
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Éléments décoratifs */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-60 -z-10" />
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-tl from-gray-100 to-gray-200 rounded-full opacity-40 -z-10" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block">
                <div className="animate-bounce">
                    <div className="w-1 h-12 bg-gray-400 rounded-full" />
                </div>
            </div>
        </section>
    );
}