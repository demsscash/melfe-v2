// src/components/product/RelatedProducts.tsx

'use client';

import { WooCommerceProduct } from '@/types/woocommerce';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface RelatedProductsProps {
    products: WooCommerceProduct[];
    currentProductId: number;
    title?: string;
}

export default function RelatedProducts({
    products,
    currentProductId,
    title = "Produits similaires"
}: RelatedProductsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // Filtrer les produits pour exclure le produit actuel
    const filteredProducts = products.filter(product => product.id !== currentProductId);

    // Vérifier les possibilités de scroll
    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        const handleResize = () => checkScroll();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [filteredProducts]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320; // largeur d'une carte + gap
            const currentScroll = scrollRef.current.scrollLeft;
            const newScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });

            // Mettre à jour les boutons après l'animation
            setTimeout(checkScroll, 300);
        }
    };

    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <section className="space-y-6">
            {/* Header avec navigation */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light tracking-wide">
                    {title}
                </h2>

                {/* Boutons de navigation - cachés sur mobile */}
                <div className="hidden md:flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className="h-9 w-9 p-0"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Container scrollable */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                    onScroll={checkScroll}
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex-shrink-0 w-72 md:w-80"
                        >
                            <ProductCard
                                product={product}
                                showQuickView={false}
                                className="h-full"
                            />
                        </div>
                    ))}
                </div>

                {/* Indicateurs de scroll pour mobile */}
                {filteredProducts.length > 1 && (
                    <div className="md:hidden flex justify-center gap-2 mt-4">
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(filteredProducts.length / 2) }).map((_, index) => (
                                <div
                                    key={index}
                                    className="w-2 h-2 rounded-full bg-gray-300"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Gradients de fade pour indiquer le scroll */}
                {canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
                )}
                {canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
                )}
            </div>

            {/* Message si peu de produits */}
            {filteredProducts.length < 3 && (
                <div className="text-center py-8">
                    <p className="text-gray-600">
                        Découvrez plus de produits dans notre{' '}
                        <a
                            href="/boutique"
                            className="text-black hover:underline font-medium"
                        >
                            boutique complète
                        </a>
                    </p>
                </div>
            )}
        </section>
    );
}