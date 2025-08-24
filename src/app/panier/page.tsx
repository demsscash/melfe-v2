// src/app/panier/page.tsx

'use client';

import { useCart } from '@/contexts/CartContext'; // Import depuis le Context
import { formatPrice } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

export default function CartPage() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart(); // Utilise le Context
    const [promoCode, setPromoCode] = useState('');
    const [isPromoApplied, setIsPromoApplied] = useState(false);
    const [promoDiscount, setPromoDiscount] = useState(0);

    const subtotal = cart?.total || 0;
    const shipping = subtotal >= 50000 ? 0 : 5000;
    const discount = isPromoApplied ? promoDiscount : 0;
    const total = subtotal + shipping - discount;

    console.log('🛒 CartPage render - cart:', cart);

    const handleQuantityChange = (productId: number, newQuantity: number) => {
        console.log('🔢 CartPage - Changement quantité:', { productId, newQuantity });
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            updateQuantity(productId, newQuantity);
        }
    };

    const applyPromoCode = () => {
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

    const removePromoCode = () => {
        setIsPromoApplied(false);
        setPromoDiscount(0);
        setPromoCode('');
    };

    if (!cart || cart.items.length === 0) {
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
                                Découvrez notre collection de melhfa exceptionnelles.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-800">
                                <Link href="/boutique">
                                    Découvrir la boutique
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Link>
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
                    {/* Articles */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {cart.items.length} produit{cart.items.length > 1 ? 's' : ''}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    console.log('🧹 CartPage - Vider le panier');
                                    clearCart();
                                }}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Vider le panier
                            </Button>
                        </div>

                        {/* Liste des articles */}
                        <div className="space-y-4">
                            {cart.items.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="p-6">
                                        <div className="flex gap-4">
                                            <div className="relative w-24 h-24 flex-shrink-0">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="96px"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-black mb-2">{item.name}</h3>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium">{formatPrice(item.total)}</div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                console.log('🗑️ CartPage - Suppression item:', item.id);
                                                                removeFromCart(item.id);
                                                            }}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Supprimer
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Résumé */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="text-lg font-medium">Résumé de la commande</h3>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Sous-total</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Livraison</span>
                                        <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Réduction</span>
                                            <span>-{formatPrice(discount)}</span>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                <div className="flex justify-between text-lg font-medium">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>

                                <Button asChild className="w-full bg-black text-white hover:bg-gray-800">
                                    <Link href="/checkout">
                                        Passer commande
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}