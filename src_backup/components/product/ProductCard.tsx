// src/components/product/ProductCard.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCartActions } from '@/hooks/useCartSync'; import { formatPrice, isOnSale, getDiscountPercentage } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingBag, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
    product: WooCommerceProduct;
    className?: string;
    showQuickView?: boolean;
}

interface ColorOption {
    name: string;
    hex: string;
}

export default function ProductCard({
    product,
    className = '',
    showQuickView = true
}: ProductCardProps) {
    const { addToCart, isInCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const primaryImage = product.images?.[0]?.src || '/placeholder-product.jpg';
    const secondaryImage = product.images?.[1]?.src || primaryImage;
    const discountPercentage = getDiscountPercentage(product);

    // Extraire les couleurs des attributs du produit
    const colorAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase().includes('couleur') ||
        attr.name.toLowerCase().includes('color')
    );

    const colorOptions: ColorOption[] = colorAttribute?.options.map(color => ({
        name: color,
        hex: getColorHex(color), // Fonction helper pour obtenir le hex
    })) || [];

    const handleAddToCart = async (): Promise<void> => {
        if (isAddingToCart) return;

        setIsAddingToCart(true);

        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.regular_price,
                image: primaryImage,
            });

            // Simulation d'une petite attente pour l'UX
            await new Promise(resolve => setTimeout(resolve, 300));
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div
            className={cn(
                "group relative bg-white transition-all duration-300 hover:shadow-lg",
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <Link href={`/produit/${product.slug}`}>
                    <Image
                        src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isOnSale(product) && (
                        <Badge className="bg-red-500 text-white text-xs px-2 py-1">
                            -{discountPercentage}%
                        </Badge>
                    )}
                    {product.featured && (
                        <Badge className="bg-black text-white text-xs px-2 py-1">
                            Nouvelle Collection
                        </Badge>
                    )}
                </div>

                {/* Quick Actions Overlay */}
                {showQuickView && (
                    <div
                        className={cn(
                            "absolute inset-0 bg-black/10 flex items-center justify-center transition-opacity duration-300",
                            isHovered ? "opacity-100" : "opacity-0"
                        )}
                    >
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white hover:bg-gray-100 shadow-md"
                                asChild
                            >
                                <Link href={`/produit/${product.slug}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Aperçu rapide
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "absolute top-4 right-4 w-8 h-8 p-0 bg-white/80 hover:bg-white transition-all duration-300",
                        isHovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
                    )}
                >
                    <Heart className="w-4 h-4" />
                </Button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
                <div>
                    <Link
                        href={`/produit/${product.slug}`}
                        className="group"
                    >
                        <h3 className="text-sm font-medium text-black group-hover:opacity-70 transition-opacity tracking-wide uppercase">
                            {product.name}
                        </h3>
                    </Link>

                    {/* Prix */}
                    <div className="flex items-center gap-2 mt-1">
                        {isOnSale(product) ? (
                            <>
                                <span className="text-base font-medium text-black">
                                    {formatPrice(product.sale_price)}
                                </span>
                                <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.regular_price)}
                                </span>
                            </>
                        ) : (
                            <span className="text-base font-medium text-black">
                                {formatPrice(product.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Couleurs disponibles */}
                {colorOptions.length > 0 && (
                    <div className="flex items-center gap-2">
                        {colorOptions.slice(0, 4).map((color, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedColor(color.name)}
                                className={cn(
                                    "w-4 h-4 rounded-full border-2 transition-all duration-200 hover:scale-110",
                                    selectedColor === color.name
                                        ? "border-black shadow-md"
                                        : "border-gray-200"
                                )}
                                style={{ backgroundColor: color.hex }}
                                title={color.name}
                            />
                        ))}
                        {colorOptions.length > 4 && (
                            <span className="text-xs text-gray-500 ml-1">
                                +{colorOptions.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.purchasable}
                    className={cn(
                        "w-full bg-black text-white hover:bg-gray-800 text-xs uppercase tracking-wide transition-all duration-300",
                        isInCart(product.id) && "bg-green-600 hover:bg-green-700"
                    )}
                >
                    {isAddingToCart ? (
                        "Ajout..."
                    ) : isInCart(product.id) ? (
                        <>
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Dans le panier
                        </>
                    ) : (
                        "Ajouter au panier"
                    )}
                </Button>
            </div>
        </div>
    );
}

// Fonction helper pour obtenir la couleur hex à partir du nom
function getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
        'noir': '#000000',
        'black': '#000000',
        'blanc': '#ffffff',
        'white': '#ffffff',
        'rouge': '#e74c3c',
        'red': '#e74c3c',
        'bleu': '#3498db',
        'blue': '#3498db',
        'vert': '#27ae60',
        'green': '#27ae60',
        'jaune': '#f1c40f',
        'yellow': '#f1c40f',
        'orange': '#e67e22',
        'violet': '#8e44ad',
        'purple': '#8e44ad',
        'rose': '#e91e63',
        'pink': '#e91e63',
        'gris': '#95a5a6',
        'gray': '#95a5a6',
        'grey': '#95a5a6',
        'marron': '#8B4513',
        'brown': '#8B4513',
        'beige': '#F5F5DC',
        'doré': '#FFD700',
        'gold': '#FFD700',
        'argenté': '#C0C0C0',
        'silver': '#C0C0C0',
    };

    const normalizedName = colorName.toLowerCase().trim();
    return colorMap[normalizedName] || '#9CA3AF'; // Couleur par défaut
}