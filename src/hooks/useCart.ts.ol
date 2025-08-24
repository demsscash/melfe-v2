// src/hooks/useCart.ts

'use client';

import { useState, useEffect, useCallback } from 'react';

// Types du panier
export interface CartItem {
    id: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
    total: number;
}

export interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

const CART_STORAGE_KEY = 'melhfa_cart';

const initialCartState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

// Hook principal
export function useCart() {
    const [cart, setCart] = useState<CartState>(initialCartState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Calculer totaux
    const calculateTotals = useCallback((items: CartItem[]) => {
        const total = items.reduce((sum, item) => sum + item.total, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        console.log('🧮 Calcul totaux:', { items: items.length, total, itemCount }); // DEBUG
        return { total, itemCount };
    }, []);

    // Charger depuis localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(CART_STORAGE_KEY);
                if (saved) {
                    const parsed = JSON.parse(saved);
                    console.log('📱 Panier chargé depuis localStorage:', parsed); // DEBUG
                    setCart(parsed);
                } else {
                    console.log('📱 Aucun panier en localStorage'); // DEBUG
                }
            } catch (error) {
                console.error('❌ Erreur chargement panier:', error);
            } finally {
                setIsHydrated(true);
                console.log('✅ useCart hydraté'); // DEBUG
            }
        }
    }, []);

    // Sauvegarder
    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
                console.log('💾 Panier sauvegardé:', cart); // DEBUG
                window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));
                console.log('📢 Événement cartUpdated déclenché avec:', cart); // DEBUG
            } catch (error) {
                console.error('❌ Erreur sauvegarde panier:', error);
            }
        }
    }, [cart, isHydrated]);

    // Ajouter au panier
    const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'total'>, quantity = 1) => {
        console.log('🛒 addToCart appelé avec:', { item, quantity }); // DEBUG
        
        setCart(prevCart => {
            console.log('🛒 Panier actuel:', prevCart); // DEBUG
            
            const existingIndex = prevCart.items.findIndex(cartItem => cartItem.id === item.id);
            let newItems: CartItem[];

            if (existingIndex >= 0) {
                console.log('🔄 Produit existant trouvé à l\'index:', existingIndex); // DEBUG
                newItems = prevCart.items.map((cartItem, index) => {
                    if (index === existingIndex) {
                        const newQuantity = cartItem.quantity + quantity;
                        return {
                            ...cartItem,
                            quantity: newQuantity,
                            total: parseFloat(cartItem.price) * newQuantity,
                        };
                    }
                    return cartItem;
                });
            } else {
                console.log('🆕 Nouveau produit ajouté'); // DEBUG
                const newItem: CartItem = {
                    ...item,
                    quantity,
                    total: parseFloat(item.price) * quantity,
                };
                newItems = [...prevCart.items, newItem];
            }

            const { total, itemCount } = calculateTotals(newItems);
            const newCart = { items: newItems, total, itemCount };
            
            console.log('🛒 Nouveau panier calculé:', newCart); // DEBUG
            
            return newCart;
        });
    }, [calculateTotals]);

    // Supprimer du panier
    const removeFromCart = useCallback((id: number) => {
        console.log('🗑️ removeFromCart appelé pour ID:', id); // DEBUG
        
        setCart(prevCart => {
            const newItems = prevCart.items.filter(item => item.id !== id);
            const { total, itemCount } = calculateTotals(newItems);
            const newCart = { items: newItems, total, itemCount };
            
            console.log('🗑️ Panier après suppression:', newCart); // DEBUG
            
            return newCart;
        });
    }, [calculateTotals]);

    // Mettre à jour quantité
    const updateQuantity = useCallback((id: number, quantity: number) => {
        console.log('🔢 updateQuantity appelé:', { id, quantity }); // DEBUG
        
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }

        setCart(prevCart => {
            const newItems = prevCart.items.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        quantity,
                        total: parseFloat(item.price) * quantity,
                    };
                }
                return item;
            });

            const { total, itemCount } = calculateTotals(newItems);
            const newCart = { items: newItems, total, itemCount };
            
            console.log('🔢 Panier après mise à jour quantité:', newCart); // DEBUG
            
            return newCart;
        });
    }, [calculateTotals, removeFromCart]);

    // Vider panier
    const clearCart = useCallback(() => {
        console.log('🧹 clearCart appelé'); // DEBUG
        setCart(initialCartState);
    }, []);

    // Utilitaires
    const getItemQuantity = useCallback((id: number) => {
        const item = cart.items.find(item => item.id === id);
        const quantity = item ? item.quantity : 0;
        console.log('📊 getItemQuantity pour ID', id, ':', quantity); // DEBUG
        return quantity;
    }, [cart.items]);

    const isInCart = useCallback((id: number) => {
        const inCart = cart.items.some(item => item.id === id);
        console.log('🔍 isInCart pour ID', id, ':', inCart); // DEBUG
        return inCart;
    }, [cart.items]);

    const getTotalPrice = useCallback(() => {
        console.log('💰 getTotalPrice:', cart.total); // DEBUG
        return cart.total;
    }, [cart.total]);
    
    const getItemCount = useCallback(() => {
        console.log('🔢 getItemCount:', cart.itemCount); // DEBUG
        return cart.itemCount;
    }, [cart.itemCount]);

    // Log de l'état actuel du hook
    console.log('🎯 useCart state actuel:', { 
        isHydrated, 
        cartItemCount: cart.itemCount, 
        cartTotal: cart.total,
        itemsLength: cart.items.length 
    }); // DEBUG

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
        getTotalPrice,
        getItemCount,
    };
}

// Export par défaut pour compatibilité
export default useCart;