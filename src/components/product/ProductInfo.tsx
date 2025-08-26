// src/components/product/ProductInfo.tsx

'use client';

import { useState } from 'react';
import { WooCommerceProduct } from '@/types/woocommerce';
import { useCart } from '@/contexts/CartContext';
import { formatPrice, isOnSale, getDiscountPercentage, getColorHex } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Star,
    Plus,
    Minus,
    ShoppingBag,
    Heart,
    Share2,
    Truck,
    Shield,
    RotateCcw,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductInfoProps {
    product: WooCommerceProduct;
}

interface ColorOption {
    name: string;
    hex: string;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { addToCart, isInCart, getItemQuantity, updateQuantity, removeFromCart } = useCart();
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

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

    const handleAddToCart = async () => {
        if (isAddingToCart) return;

        setIsAddingToCart(true);
        console.log('🛒 ProductInfo - Tentative d\'ajout:', product.name);

        try {
            addToCart({
                id: product.id,
                name: product.name,
                price: product.sale_price || product.regular_price,
                image: product.images?.[0]?.src || '/placeholder-product.jpg',
            }, selectedQuantity);

            console.log('✅ ProductInfo - Produit ajouté avec succès');

            // Reset quantity après ajout
            setSelectedQuantity(1);

        } catch (error) {
            console.error('❌ ProductInfo - Erreur ajout:', error);
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

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        // TODO: Implémenter la logique de wishlist
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.short_description,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Partage annulé');
            }
        } else {
            // Fallback: copier l'URL
            try {
                await navigator.clipboard.writeText(window.location.href);
                // TODO: Afficher une notification de succès
            } catch (error) {
                console.error('Erreur lors de la copie:', error);
            }
        }
    };

    return (
        <div className="space-y-6">
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
            <div className="space-y-2">
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
            </div>

            {/* Price */}
            <div className="space-y-2">
                <div className="flex items-center gap-4">
                    {isOnSale(product) ? (
                        <>
                            <span className="text-3xl font-light text-red-600">
                                {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-xl text-gray-400 line-through">
                                {formatPrice(product.regular_price)}
                            </span>
                            {getDiscountPercentage(product) && (
                                <Badge variant="destructive" className="ml-2">
                                    -{getDiscountPercentage(product)}%
                                </Badge>
                            )}
                        </>
                    ) : (
                        <span className="text-3xl font-light text-black">
                            {formatPrice(product.regular_price)}
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600">Prix TTC, livraison non comprise</p>
            </div>

            {/* Short description */}
            {product.short_description && (
                <div
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                />
            )}

            <Separator />

            {/* Color selection */}
            {colorOptions.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">
                        Couleur {selectedColor && `- ${selectedColor}`}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                            <button
                                key={color.name}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 transition-all",
                                    selectedColor === color.name
                                        ? "border-black shadow-md scale-110"
                                        : "border-gray-300 hover:border-gray-400"
                                )}
                                style={{ backgroundColor: color.hex }}
                                onClick={() => setSelectedColor(color.name)}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Stock status */}
            <div className="space-y-2">
                {product.stock_status === 'instock' ? (
                    <div className="flex items-center gap-2 text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">En stock</span>
                        {product.manage_stock && product.stock_quantity && (
                            <span className="text-xs text-gray-500">
                                ({product.stock_quantity} disponibles)
                            </span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm font-medium">Rupture de stock</span>
                    </div>
                )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock_status === 'instock' && (
                <div className="space-y-4">
                    {!productInCart ? (
                        <div className="flex gap-4">
                            {/* Quantity selector */}
                            <div className="flex items-center border rounded-lg">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedQuantity(Math.max(1, selectedQuantity - 1))}
                                    disabled={selectedQuantity <= 1}
                                    className="h-12 w-12 p-0"
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                                <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                    {selectedQuantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                                    className="h-12 w-12 p-0"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Add to cart button */}
                            <Button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="flex-1 h-12 text-base"
                                size="lg"
                            >
                                {isAddingToCart ? (
                                    "Ajout en cours..."
                                ) : (
                                    <>
                                        <ShoppingBag className="w-5 h-5 mr-2" />
                                        Ajouter au panier
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 text-sm font-medium mb-2">
                                    ✓ Produit dans votre panier ({currentQuantity})
                                </p>
                                <div className="flex gap-2">
                                    <div className="flex items-center border rounded-lg bg-white">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleQuantityChange(currentQuantity - 1)}
                                            disabled={currentQuantity <= 1}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                            {currentQuantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleQuantityChange(currentQuantity + 1)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeFromCart(product.id)}
                                        className="h-8"
                                    >
                                        Retirer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlist}
                    className={cn(
                        "flex-1",
                        isWishlisted && "border-red-300 bg-red-50 text-red-700"
                    )}
                >
                    <Heart className={cn("w-5 h-5 mr-2", isWishlisted && "fill-current")} />
                    {isWishlisted ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="flex-1"
                >
                    <Share2 className="w-5 h-5 mr-2" />
                    Partager
                </Button>
            </div>

            <Separator />

            {/* Delivery & Services */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Services</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Livraison gratuite</p>
                            <p className="text-gray-600">À partir de 50€ d'achat</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <RotateCcw className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Retours gratuits</p>
                            <p className="text-gray-600">30 jours pour changer d'avis</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium">Paiement sécurisé</p>
                            <p className="text-gray-600">Carte bancaire et PayPal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}