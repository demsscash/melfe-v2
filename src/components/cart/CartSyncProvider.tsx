// src/components/cart/CartSyncProvider.tsx

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useCartActions } from '@/hooks/useCartSync';
import { useCart } from '@/contexts/CartContext';
interface CartSyncContextType {
    lastUpdate: number;
    forceSync: () => void;
}

const CartSyncContext = createContext<CartSyncContextType | undefined>(undefined);

interface CartSyncProviderProps {
    children: ReactNode;
}

export function CartSyncProvider({ children }: CartSyncProviderProps) {
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const { cart } = useCart();

    // Forcer une synchronisation
    const forceSync = () => {
        setLastUpdate(Date.now());
        // Déclencher un événement global
        window.dispatchEvent(new CustomEvent('forceCartSync', {
            detail: { timestamp: Date.now() }
        }));
    };

    // Écouter les changements du panier
    useEffect(() => {
        const handleCartChange = () => {
            setLastUpdate(Date.now());
        };

        // Écouter les événements personnalisés
        window.addEventListener('cartUpdated', handleCartChange);
        window.addEventListener('forceCartSync', handleCartChange);

        // Écouter les changements de localStorage (synchronisation entre onglets)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'melhfa_cart') {
                handleCartChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('cartUpdated', handleCartChange);
            window.removeEventListener('forceCartSync', handleCartChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Déclencher une synchronisation quand le panier change
    useEffect(() => {
        forceSync();
    }, [cart.itemCount, cart.total]);

    return (
        <CartSyncContext.Provider value={{ lastUpdate, forceSync }}>
            {children}
        </CartSyncContext.Provider>
    );
}

export function useCartSyncContext() {
    const context = useContext(CartSyncContext);
    if (context === undefined) {
        throw new Error('useCartSyncContext must be used within a CartSyncProvider');
    }
    return context;
}