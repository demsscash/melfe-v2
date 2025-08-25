// src/components/product/ProductGrid.tsx

'use client';

import { WooCommerceProduct } from '@/types/woocommerce';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
    products: WooCommerceProduct[];
    currentPage?: number;
    hasMore?: boolean;
    className?: string;
    viewMode?: 'grid' | 'list';
}

export default function ProductGrid({
    products,
    currentPage = 1,
    hasMore = false,
    className = '',
    viewMode = 'grid'
}: ProductGridProps) {

    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="max-w-md mx-auto space-y-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600">
                        Aucun produit ne correspond à vos critères de recherche.
                        Essayez de modifier vos filtres.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('space-y-8', className)}>
            {/* Grid de produits */}
            <div
                className={cn(
                    'grid gap-6',
                    viewMode === 'grid'
                        ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                        : 'grid-cols-1 md:grid-cols-2 gap-8'
                )}
            >
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className="animate-fade-in-up"
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both'
                        }}
                    >
                        <ProductCard
                            product={product}
                            className={cn(
                                viewMode === 'list' && 'flex-row h-48'
                            )}
                        />
                    </div>
                ))}
            </div>

            {/* Informations de pagination */}
            {currentPage > 1 && (
                <div className="text-center text-sm text-gray-600">
                    Page {currentPage} • {products.length} produits affichés
                </div>
            )}
        </div>
    );
}