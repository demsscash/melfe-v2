// src/app/panier/page.tsx

'use client';

import { useCartActions } from '@/hooks/useCartSync'; import { formatPrice } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    ShoppingBag,
    Trash2,
    Plus,
    Minus,
    ArrowRight,
    Truck,
    Shield,
    Tag
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const [promoCode, setPromoCode] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    const subtotal = cart.total;
    const shipping = subtotal >= 50000 ? 0 : 5000; // Livraison gratuite à partir de 50.000 MRU
    const discount = isPromoApplied ? promoDiscount : 0;
    const total = subtotal + shipping - discount;

    const handleQuantityChange = (productId: number, newQuantity: number): void => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const applyPromoCode = (): void => {
        // Codes promo factices pour la démo
        const promoCodes: { [key: string]: number } = {
            'WELCOME10': 0.1,
            'SUMMER20': 0.2,
            'FIRST5': 0.05,
        };

        const discountPercent = promoCodes[promoCode.toUpperCase()];
        if (discountPercent) {
            setIsPromoApplied(true);
            setPromoDiscount(subtotal * discountPercent);
        }
    };

    const removePromoCode = (): void => {
        setIsPromoApplied(false);
        setPromoDiscount(0);
        setPromoCode('');
    };

    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-20">
                <div className="max-w-[1400px] mx-auto px-6 py-16">
                    <div className="text-center space-y-8">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-16 h-16 text-gray-400" />
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-light tracking-wide">Votre panier est vide</h1>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Découvrez notre collection de melhfa exceptionnelles et commencez votre shopping.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                                <Link href="/boutique">
                                    Découvrir la boutique
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/">Retour à l'accueil</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-light tracking-wide text-black mb-2">
                        Panier ({cart.itemCount} article{cart.itemCount > 1 ? 's' : ''})
                    </h1>
                    <p className="text-gray-600">Vérifiez vos articles avant de procéder au paiement</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Clear Cart Button */}
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {cart.items.length} produit{cart.items.length > 1 ? 's' : ''} dans votre panier
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCart}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Vider le panier
                            </Button>
                        </div>

                        {/* Cart Items List */}
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            {/* Product Image */}
                                            <div className="relative w-full md:w-32 h-48 md:h-32 flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="(max-width: 768px) 100vw, 128px"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-lg">{item.name}</h3>
                                                        <p className="text-gray-600 text-sm">Prix unitaire: {formatPrice(item.price)}</p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                            className="px-3 h-10 hover:bg-gray-100"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </Button>
                                                        <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                            className="px-3 h-10 hover:bg-gray-100"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Item Total */}
                                                    <div className="text-right">
                                                        <p className="font-medium text-lg">{formatPrice(item.total)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Cart Summary */}
                    <div className="space-y-6">
                        {/* Promo Code */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-medium flex items-center gap-2">
                                    <Tag className="w-5 h-5" />
                                    Code promo
                                </h3>

                                {!isPromoApplied ? (
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Entrez votre code"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button
                                            onClick={applyPromoCode}
                                            disabled={!promoCode.trim()}
                                            variant="outline"
                                        >
                                            Appliquer
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-green-500">✓</Badge>
                                            <span className="text-sm font-medium">Code appliqué: {promoCode}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={removePromoCode}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>Codes de démonstration disponibles:</p>
                                    <p>• WELCOME10 (10% de réduction)</p>
                                    <p>• SUMMER20 (20% de réduction)</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-medium text-lg">Résumé de la commande</h3>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span>Sous-total ({cart.itemCount} articles)</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="flex items-center gap-1">
                                            Livraison
                                            {shipping === 0 && <Badge variant="secondary" className="text-xs">Gratuite</Badge>}
                                        </span>
                                        <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between text-lg font-medium">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    size="lg"
                                    className="w-full bg-black text-white hover:bg-gray-800 py-4"
                                >
                                    <Link href="/checkout">
                                        Procéder au paiement
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Link>
                                </Button>

                                {/* Trust Indicators */}
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Truck className="w-4 h-4" />
                                        <span>Livraison gratuite à partir de 50.000 MRU</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Shield className="w-4 h-4" />
                                        <span>Paiement 100% sécurisé</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Continue Shopping */}
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/boutique">
                                Continuer mes achats
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}