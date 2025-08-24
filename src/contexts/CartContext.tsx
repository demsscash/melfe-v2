// src/contexts/CartContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

const CartContext = createContext<UseCartReturn | undefined>(undefined);

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
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
        const total = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        
        return { total, itemCount };
    }, []);

    // Ajouter un produit au panier
    const addToCart = useCallback((item: Omit<CartItem, 'quantity' | 'total'>, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.items.find(cartItem => cartItem.id === item.id);

            let newItems: CartItem[];

            if (existingItem) {
                // Mettre à jour la quantité si le produit existe déjà
                newItems = prevCart.items.map(cartItem => {
                    if (cartItem.id === item.id) {
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
                // Ajouter un nouveau produit
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

    const contextValue: UseCartReturn = {
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

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): UseCartReturn {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart doit être utilisé dans un CartProvider');
    }

    return context;
}