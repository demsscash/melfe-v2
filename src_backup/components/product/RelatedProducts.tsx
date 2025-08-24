// src/components/product/RelatedProducts.tsx

'use client';

import { WooCommerceProduct } from '@/types/woocommerce';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
    products: WooCommerceProduct[];
    title?: string;
    className?: string;
}

export default function RelatedProducts({
    products,
    title = "Produits similaires",
    className = ''
}: RelatedProductsProps): JSX.Element {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScrollButtons = (): void => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    const scrollLeft = (): void => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -320, // Largeur d'une carte + gap
                behavior: 'smooth'
            });
        }
    };

    const scrollRight = (): void => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 320, // Largeur d'une carte + gap
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) {
        return <></>;
    }

    return (
        <section className={cn('space-y-8', className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl md:text-3xl font-light tracking-wide">
                    {title}
                </h2>

                {/* Navigation Buttons - Desktop */}
                <div className="hidden md:flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                        className="p-2 h-9 w-9"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                        className="p-2 h-9 w-9"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Products Scroll Container */}
            <div className="relative">
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto hide-scrollbar pb-4"
                    onScroll={checkScrollButtons}
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className="flex-none w-72 md:w-80"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <ProductCard
                                product={product}
                                className="h-full animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: 'both'
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex justify-center gap-2 md:hidden">
                {products.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2 h-2 rounded-full transition-all duration-300",
                            index === 0 ? "bg-black" : "bg-gray-300" // En production, calculer l'index actuel
                        )}
                        onClick={() => {
                            if (scrollContainerRef.current) {
                                scrollContainerRef.current.scrollTo({
                                    left: index * 320,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                    />
                ))}
            </div>

            {/* Alternative: Grid Layout for smaller screens */}
            <div className="md:hidden">
                <div className="grid grid-cols-2 gap-4 mt-8">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            className="w-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}