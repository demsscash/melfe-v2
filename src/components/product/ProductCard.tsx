// src/components/product/ProductCard.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, isOnSale, getDiscountPercentage, getColorHex } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ShoppingBag, Heart, Plus, Minus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ✅ INTERFACE CORRIGÉE avec support de style
interface ProductCardProps {
    product: WooCommerceProduct;
    className?: string;
    showQuickView?: boolean;
    style?: React.CSSProperties; // ✅ AJOUT de la propriété style
}

interface ColorOption {
    name: string;
    hex: string;
}

export default function ProductCard({
    product,
    className = '',
    showQuickView = true,
    style // ✅ AJOUT du paramètre style
}: ProductCardProps) {
    const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const primaryImage = product.images?.[0]?.src || '/placeholder-product.jpg';
    const secondaryImage = product.images?.[1]?.src || primaryImage;
    const discountPercentage = getDiscountPercentage(product);

    const productInCart = isInCart(product.id);
    const currentQuantity = getItemQuantity(product.id);

    // Extraire les couleurs des attributs du produit
    const colorAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase().includes('couleur') ||
        attr.name.toLowerCase().includes('color')
    );

    const colorOptions: ColorOption[] = colorAttribute?.options.map(color => ({
        name: color,
        hex: getColorHex(color),
    })) || [];

    const handleAddToCart = async (): Promise<void> => {
        if (isAddingToCart) return;

        setIsAddingToCart(true);
        console.log('🛒 ProductCard - Tentative d\'ajout:', product.name);

        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.regular_price,
                image: primaryImage,
            });

            console.log('✅ ProductCard - Produit ajouté avec succès');
            await new Promise(resolve => setTimeout(resolve, 300));
        } catch (error) {
            console.error('❌ ProductCard - Erreur ajout:', error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product.id);
    };

    return (
        <div
            className={cn(
                "group relative bg-white transition-all duration-300 hover:shadow-lg",
                className
            )}
            style={style} // ✅ APPLICATION du style au conteneur principal
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
                        isHovered ? "opacity-100" : "opacity-0"
                    )}
                >
                    <Heart className="w-4 h-4" />
                </Button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
                {/* Colors */}
                {colorOptions.length > 0 && (
                    <div className="flex gap-2">
                        {colorOptions.slice(0, 4).map((color, index) => (
                            <button
                                key={index}
                                className={cn(
                                    "w-4 h-4 rounded-full border transition-all duration-200 hover:scale-110",
                                    selectedColor === color.name ? "ring-2 ring-black ring-offset-1" : "border-gray-300"
                                )}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => setSelectedColor(color.name)}
                                title={color.name}
                            />
                        ))}
                        {colorOptions.length > 4 && (
                            <span className="text-xs text-gray-500 self-center">
                                +{colorOptions.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Product Name */}
                <Link href={`/produit/${product.slug}`}>
                    <h3 className="font-medium text-sm text-gray-900 hover:text-black transition-colors leading-tight line-clamp-2">
                        {product.name}
                    </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2">
                    {isOnSale(product) ? (
                        <>
                            <span className="text-red-600 font-semibold text-lg">
                                {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-gray-400 text-sm line-through">
                                {formatPrice(product.regular_price)}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-900 font-semibold text-lg">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                {/* Add to Cart Section */}
                <div className="pt-2">
                    {productInCart ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => handleQuantityChange(currentQuantity - 1)}
                                >
                                    {currentQuantity === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                </Button>
                                <span className="text-sm font-medium min-w-[2rem] text-center">
                                    {currentQuantity}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 p-0"
                                    onClick={() => handleQuantityChange(currentQuantity + 1)}
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-sm hover:bg-black hover:text-white transition-colors"
                            onClick={handleAddToCart}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? (
                                "Ajout..."
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Ajouter au panier
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}