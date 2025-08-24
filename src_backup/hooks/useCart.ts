// src/hooks/useCart.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { CartItem, CartState } from '@/types/woocommerce';

const CART_STORAGE_KEY = 'melhfa_cart';

export interface UseCartReturn {
    cart: CartState;
    addToCart: (item: Omit<CartItem, 'quantity' | 'total'>, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (id: number) => number;
    isInCart: (id: number) => boolean;
    getTotalPrice: () => number;
    getItemCount: () => number;
}

const initialCartState: CartState = {
    items: [],
    total: 0,
    itemCount: 0,
};

export const useCart = (): UseCartReturn => {
    const [cart, setCart] = useState<CartState>(initialCartState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Charger le panier depuis localStorage au montage du composant
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY);
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart) as CartState;
                setCart(parsedCart);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du panier:', error);
        } finally {
            setIsHydrated(true);
        }
    }, []);

    // Sauvegarder le panier dans localStorage à chaque modification
    useEffect(() => {
        if (isHydrated) {
            try {
                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
            } catch (error) {
                console.error('Erreur lors de la sauvegarde du panier:', error);
            }
        }
    }, [cart, isHydrated]);

    // Calculer les totaux
    const calculateTotals = useCallback((items: CartItem[]): { total: number; itemCount: number } => {
        const total = items.reduce((sum, item) => sum + item.total, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        return { total, itemCount };
    }, []);

    // Ajouter un produit au panier
    const addToCart = useCallback((
        item: Omit<CartItem, 'quantity' | 'total'>,
        quantity: number = 1
    ) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.items.findIndex(cartItem => cartItem.id === item.id);
            let newItems: CartItem[];

            if (existingItemIndex >= 0) {
                // Le produit existe déjà, on augmente la quantité
                newItems = prevCart.items.map((cartItem, index) => {
                    if (index === existingItemIndex) {
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
                // Nouveau produit
                const newItem: CartItem = {
                    ...item,
                    quantity,
                    total: parseFloat(item.price) * quantity,
                };
                newItems = [...prevCart.items, newItem];
            }

            const { total, itemCount } = calculateTotals(newItems);

            return {
                items: newItems,
                total,
                itemCount,
            };
        });
    }, [calculateTotals]);

    // Supprimer un produit du panier
    const removeFromCart = useCallback((id: number) => {
        setCart(prevCart => {
            const newItems = prevCart.items.filter(item => item.id !== id);
            const { total, itemCount } = calculateTotals(newItems);

            return {
                items: newItems,
                total,
                itemCount,
            };
        });
    }, [calculateTotals]);

    // Mettre à jour la quantité d'un produit
    const updateQuantity = useCallback((id: number, quantity: number) => {
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

            return {
                items: newItems,
                total,
                itemCount,
            };
        });
    }, [calculateTotals, removeFromCart]);

    // Vider le panier
    const clearCart = useCallback(() => {
        setCart(initialCartState);
    }, []);

    // Obtenir la quantité d'un produit dans le panier
    const getItemQuantity = useCallback((id: number): number => {
        const item = cart.items.find(item => item.id === id);
        return item ? item.quantity : 0;
    }, [cart.items]);

    // Vérifier si un produit est dans le panier
    const isInCart = useCallback((id: number): boolean => {
        return cart.items.some(item => item.id === id);
    }, [cart.items]);

    // Obtenir le prix total du panier
    const getTotalPrice = useCallback((): number => {
        return cart.total;
    }, [cart.total]);

    // Obtenir le nombre total d'articles
    const getItemCount = useCallback((): number => {
        return cart.itemCount;
    }, [cart.itemCount]);

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
};