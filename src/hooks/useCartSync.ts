// src/hooks/useCartSync.ts

'use client';

import { useEffect, useState } from 'react';
import { useCart } from './useCart';

// Hook pour forcer la synchronisation du panier
export function useCartSync() {
    const cart = useCart();
    const [, forceUpdate] = useState({});

    // Forcer une mise à jour des composants
    const forceSyncUpdate = () => {
        forceUpdate({});
    };

    // Écouter les changements de localStorage pour synchroniser entre onglets
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'melhfa_cart') {
                forceSyncUpdate();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return {
        ...cart,
        forceSyncUpdate
    };
}

// Hook amélioré pour les composants qui ajoutent au panier
export function useCartActions() {
    const { addToCart: originalAddToCart, ...cart } = useCart();
    const [, forceUpdate] = useState({});

    const addToCart = async (item: Parameters<typeof originalAddToCart>[0], quantity?: number) => {
        try {
            // Ajouter au panier
            originalAddToCart(item, quantity);
            
            // Forcer une mise à jour après un petit délai
            setTimeout(() => {
                forceUpdate({});
                // Déclencher un événement personnalisé pour informer les autres composants
                window.dispatchEvent(new CustomEvent('cartUpdated', { 
                    detail: { action: 'add', item, quantity } 
                }));
            }, 100);
            
            return { success: true };
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier:', error);
            return { success: false, error };
        }
    };

    // Écouter les événements de mise à jour du panier
    useEffect(() => {
        const handleCartUpdate = () => {
            forceUpdate({});
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    return {
        ...cart,
        addToCart
    };
}