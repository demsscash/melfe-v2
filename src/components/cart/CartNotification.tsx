// src/components/cart/CartNotification.tsx

'use client';

import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { X, CheckCircle, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface CartNotificationProps {
    isVisible: boolean;
    onClose: () => void;
    item?: {
        name: string;
        price: string;
        image: string;
        quantity: number;
    };
}

export function CartNotification({ isVisible, onClose, item }: CartNotificationProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
            // Auto-fermeture après 4 secondes
            const timer = setTimeout(() => {
                onClose();
            }, 4000);

            return () => clearTimeout(timer);
        } else {
            setIsAnimating(false);
        }
    }, [isVisible, onClose]);

    if (!isVisible || !item) return null;

    return (
        <div className="fixed top-20 right-4 z-[70] max-w-sm">
            <div
                className={cn(
                    "bg-white border border-gray-200 rounded-lg shadow-lg p-4 transition-all duration-300",
                    isAnimating
                        ? "transform translate-x-0 opacity-100"
                        : "transform translate-x-full opacity-0"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium text-sm">Ajouté au panier</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                </div>

                {/* Product */}
                <div className="flex gap-3 mb-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                            sizes="64px"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                            {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                            Quantité: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                            {formatPrice(parseFloat(item.price) * item.quantity)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Continuer
                    </Button>
                    <Link href="/panier" className="flex-1">
                        <Button size="sm" className="w-full bg-black text-white hover:bg-gray-800">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Voir panier
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Hook pour gérer les notifications
export function useCartNotification() {
    const [notification, setNotification] = useState<{
        isVisible: boolean;
        item?: {
            name: string;
            price: string;
            image: string;
            quantity: number;
        };
    }>({ isVisible: false });

    const showNotification = (item: {
        name: string;
        price: string;
        image: string;
        quantity: number;
    }) => {
        console.log('📢 Affichage notification pour:', item.name);
        setNotification({ isVisible: true, item });
    };

    const hideNotification = () => {
        console.log('❌ Fermeture notification');
        setNotification({ isVisible: false });
    };

    return {
        notification,
        showNotification,
        hideNotification
    };
}