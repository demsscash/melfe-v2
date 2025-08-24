// src/components/cart/CartPreview.tsx

'use client';

import { useCart } from '@/contexts/CartContext'; // Import depuis le Context - CORRIGÉ
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowRight, X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/lib/woocommerce';

interface CartPreviewProps {
    isOpen: boolean;
    onClose: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export function CartPreview({ isOpen, onClose, onMouseEnter, onMouseLeave }: CartPreviewProps) {
    const { cart, removeFromCart, updateQuantity } = useCart();

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    if (!isOpen) return null;

    if (!cart || cart.items.length === 0) {
        return (
            <div 
                className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-lg z-[60]"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className="p-6 text-center">
                    <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-light mb-2">Votre panier est vide</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Ajoutez des produits pour commencer vos achats
                    </p>
                    <Link href="/boutique" onClick={onClose}>
                        <Button className="w-full bg-black text-white hover:bg-gray-800">
                            Découvrir la boutique
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = cart.total || 0;
    const shipping = subtotal >= 50000 ? 0 : 5000;
    const total = subtotal + shipping;

    console.log('🔍 CartPreview render - cart:', cart, 'itemCount:', cart.itemCount);

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 shadow-xl rounded-lg z-[60]"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="font-light text-lg">
                    Panier ({cart.itemCount} article{cart.itemCount > 1 ? 's' : ''})
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Items avec contrôles */}
            <div className="max-h-80 overflow-y-auto">
                {cart.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="p-4 border-b border-gray-50 hover:bg-gray-25">
                        <div className="flex gap-3 mb-3">
                            {/* Image */}
                            <div className="relative w-16 h-16 flex-shrink-0">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                    sizes="64px"
                                />
                            </div>

                            {/* Détails */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-light text-black truncate mb-1">
                                    {item.name}
                                </h4>
                                <div className="text-sm font-medium">
                                    {formatPrice(item.total)}
                                </div>
                            </div>

                            {/* Bouton supprimer */}
                            <button
                                onClick={() => {
                                    console.log('🗑️ CartPreview - Suppression item:', item.id);
                                    removeFromCart(item.id);
                                }}
                                className="p-1 hover:bg-gray-100 rounded text-red-500 hover:text-red-700"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Contrôles de quantité */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="h-7 w-7 p-0"
                            >
                                <Minus className="w-3 h-3" />
                            </Button>
                            
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium min-w-[2rem] text-center">
                                {item.quantity}
                            </span>
                            
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="h-7 w-7 p-0"
                            >
                                <Plus className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Plus d'articles... */}
                {cart.items.length > 4 && (
                    <div className="p-3 text-center text-sm text-gray-500">
                        +{cart.items.length - 4} autre{cart.items.length - 4 > 1 ? 's' : ''} article{cart.items.length - 4 > 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Totaux */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                
                {shipping > 0 && (
                    <div className="flex justify-between text-sm">
                        <span>Livraison</span>
                        <span>{formatPrice(shipping)}</span>
                    </div>
                )}
                
                {shipping === 0 && subtotal > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Livraison</span>
                        <span>Gratuite</span>
                    </div>
                )}

                <div className="border-t border-gray-100 pt-2">
                    <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                </div>

                {shipping > 0 && (
                    <div className="text-xs text-gray-500 text-center">
                        Livraison gratuite à partir de {formatPrice(50000)}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="p-4 space-y-2">
                <Link href="/panier" onClick={onClose}>
                    <Button variant="outline" className="w-full">
                        Voir le panier complet
                    </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                    <Button className="w-full bg-black text-white hover:bg-gray-800">
                        Commander maintenant
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}