// src/components/product/ProductInfo.tsx

'use client';

import { useState } from 'react';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCartActions } from '@/hooks/useCartSync'; import { formatPrice, isOnSale, getDiscountPercentage } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    Star,
    Plus,
    Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
    product: WooCommerceProduct;
}

interface ColorOption {
    name: string;
    value: string;
    hex: string;
}

interface SizeOption {
    name: string;
    value: string;
    available: boolean;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart, isInCart, getItemQuantity } = useCart();
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const discountPercentage = getDiscountPercentage(product);
    const productInCart = isInCart(product.id);
    const cartQuantity = getItemQuantity(product.id);

    // Extraire les couleurs des attributs du produit
    const colorAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase().includes('couleur') ||
        attr.name.toLowerCase().includes('color')
    );

    const sizeAttribute = product.attributes?.find(attr =>
        attr.name.toLowerCase().includes('taille') ||
        attr.name.toLowerCase().includes('size')
    );

    const colorOptions: ColorOption[] = colorAttribute?.options.map(color => ({
        name: color,
        value: color.toLowerCase(),
        hex: getColorHex(color),
    })) || [];

    const sizeOptions: SizeOption[] = sizeAttribute?.options.map(size => ({
        name: size,
        value: size.toLowerCase(),
        available: true, // Vous pouvez ajouter la logique de disponibilité ici
    })) || [];

    const handleAddToCart = async (): Promise<void> => {
        if (isAddingToCart) return;

        setIsAddingToCart(true);

        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.regular_price,
                image: product.images[0]?.src || '/placeholder-product.jpg',
            }, quantity);

            // Simulation d'une petite attente pour l'UX
            await new Promise(resolve => setTimeout(resolve, 500));
        } finally {
            setIsAddingToCart(false);
        }
    };

    const increaseQuantity = (): void => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = (): void => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const toggleWishlist = (): void => {
        setIsWishlisted(!isWishlisted);
    };

    const shareProduct = (): void => {
        if (navigator.share) {
            navigator.share({
                title: product.name,
                text: product.short_description,
                url: window.location.href,
            });
        } else {
            // Fallback: copier l'URL dans le presse-papiers
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
                {/* Categories */}
                {product.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {product.categories.map((category) => (
                            <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-light tracking-wide text-black">
                    {product.name}
                </h1>

                {/* Ratings */}
                {product.rating_count > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "w-4 h-4",
                                        i < Math.floor(parseFloat(product.average_rating))
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    )}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-gray-600">
                            {product.average_rating} ({product.rating_count} avis)
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-center gap-4">
                    {isOnSale(product) ? (
                        <>
                            <span className="text-3xl font-medium text-black">
                                {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-xl text-gray-500 line-through">
                                {formatPrice(product.regular_price)}
                            </span>
                            {discountPercentage > 0 && (
                                <Badge className="bg-red-500 text-white">
                                    -{discountPercentage}%
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="text-3xl font-medium text-black">
                            {formatPrice(product.price)}
                        </span>
                    )}
                </div>

                {/* Short Description */}
                {product.short_description && (
                    <div
                        className="text-gray-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.short_description }}
                    />
                )}
            </div>

            <Separator />

            {/* Product Options */}
            <div className="space-y-6">
                {/* Colors */}
                {colorOptions.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">
                            Couleur: {selectedColor && <span className="font-normal">{selectedColor}</span>}
                        </Label>
                        <div className="flex flex-wrap gap-3">
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110",
                                        selectedColor === color.name
                                            ? "border-black shadow-md scale-110"
                                            : "border-gray-200"
                                    )}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Sizes */}
                {sizeOptions.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Taille</Label>
                        <Select value={selectedSize} onValueChange={setSelectedSize}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choisir une taille" />
                            </SelectTrigger>
                            <SelectContent>
                                {sizeOptions.map((size) => (
                                    <SelectItem
                                        key={size.value}
                                        value={size.value}
                                        disabled={!size.available}
                                    >
                                        {size.name} {!size.available && '(Rupture de stock)'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Quantity */}
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Quantité</Label>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={decreaseQuantity}
                                disabled={quantity <= 1}
                                className="px-3 h-10 hover:bg-gray-100"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={increaseQuantity}
                                className="px-3 h-10 hover:bg-gray-100"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {cartQuantity > 0 && (
                            <span className="text-sm text-gray-600">
                                {cartQuantity} déjà dans le panier
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="space-y-4">
                <Button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.purchasable || product.stock_status === 'outofstock'}
                    className="w-full bg-black text-white hover:bg-gray-800 py-4 text-base uppercase tracking-wide transition-all duration-300"
                    size="lg"
                >
                    {isAddingToCart ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Ajout en cours...
                        </div>
                    ) : product.stock_status === 'outofstock' ? (
                        'Rupture de stock'
                    ) : productInCart ? (
                        <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Ajouter encore ({cartQuantity} dans le panier)
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Ajouter au panier
                        </>
                    )}
                </Button>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={toggleWishlist}
                        className={cn(
                            "flex-1 transition-all duration-300",
                            isWishlisted && "border-red-500 text-red-500 hover:bg-red-50"
                        )}
                    >
                        <Heart className={cn("w-5 h-5 mr-2", isWishlisted && "fill-current")} />
                        {isWishlisted ? 'Retiré des favoris' : 'Ajouter aux favoris'}
                    </Button>

                    <Button variant="outline" onClick={shareProduct}>
                        <Share2 className="w-5 h-5 mr-2" />
                        Partager
                    </Button>
                </div>
            </div>

            <Separator />

            {/* Product Features */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span>Livraison gratuite à partir de 50.000 MRU</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span>Garantie qualité - Retour sous 30 jours</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <RotateCcw className="w-5 h-5 text-gray-600" />
                    <span>Échange gratuit en magasin</span>
                </div>
            </div>
        </div>
    );
}

// Helper function pour les couleurs
function getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
        'noir': '#000000',
        'blanc': '#ffffff',
        'rouge': '#dc2626',
        'bleu': '#2563eb',
        'vert': '#059669',
        'jaune': '#d97706',
        'violet': '#7c3aed',
        'rose': '#ec4899',
        'gris': '#6b7280',
        'marron': '#92400e',
        'beige': '#d6d3d1',
        'doré': '#f59e0b',
        'argenté': '#9ca3af',
    };

    return colorMap[colorName.toLowerCase()] || '#9ca3af';
}

function Label({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <label className={cn('block text-sm font-medium text-gray-900', className)}>
            {children}
        </label>
    );
}