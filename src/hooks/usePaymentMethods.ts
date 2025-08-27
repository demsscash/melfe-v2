// src/hooks/usePaymentMethods.ts

import { useState, useEffect } from 'react';

export interface PaymentMethod {
    id: string;
    title: string;
    description: string;
    method_title: string;
    method_description: string;
    enabled: boolean;
    supports: string[];
    settings: {
        instructions: string;
        enable_for_methods: string[];
    };
}

interface UsePaymentMethodsReturn {
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function usePaymentMethods(): UsePaymentMethodsReturn {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/payment-methods');
            const data = await response.json();

            if (data.success) {
                setPaymentMethods(data.data);
                console.log('✅ Moyens de paiement chargés:', data.data);
            } else {
                throw new Error(data.message || 'Erreur lors du chargement');
            }
        } catch (err) {
            console.error('❌ Erreur usePaymentMethods:', err);
            setError(err instanceof Error ? err.message : 'Erreur inconnue');

            // Fallback avec les méthodes par défaut
            setPaymentMethods([
                {
                    id: 'cod',
                    title: 'Paiement à la livraison',
                    description: 'Paiement en espèces à la réception',
                    method_title: 'Cash on Delivery',
                    method_description: '',
                    enabled: true,
                    supports: ['products'],
                    settings: {
                        instructions: 'Paiement en espèces uniquement',
                        enable_for_methods: []
                    }
                }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return {
        paymentMethods,
        isLoading,
        error,
        refetch: fetchPaymentMethods
    };
}