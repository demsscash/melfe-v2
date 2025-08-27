// src/components/checkout/PaymentMethods.tsx

'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { usePaymentMethods, PaymentMethod } from '@/hooks/usePaymentMethods';

interface PaymentMethodsProps {
    selectedMethod: string;
    onMethodChange: (methodId: string) => void;
}

// Icônes pour les différents types de paiement
const getPaymentIcon = (methodId: string) => {
    switch (methodId) {
        case 'cod':
            return <Banknote className="w-5 h-5 text-green-600" />;
        case 'stripe':
        case 'paypal':
        case 'square':
            return <CreditCard className="w-5 h-5 text-blue-600" />;
        case 'bacs':
            return <Wallet className="w-5 h-5 text-purple-600" />;
        case 'mpesa':
        case 'orange_money':
            return <Smartphone className="w-5 h-5 text-orange-600" />;
        default:
            return <CreditCard className="w-5 h-5 text-gray-600" />;
    }
};

// Couleurs pour les bordures selon le type
const getMethodStyles = (methodId: string, isSelected: boolean) => {
    const baseStyles = "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all";

    if (isSelected) {
        switch (methodId) {
            case 'cod':
                return `${baseStyles} border-green-500 bg-green-50`;
            case 'stripe':
            case 'paypal':
                return `${baseStyles} border-blue-500 bg-blue-50`;
            default:
                return `${baseStyles} border-blue-500 bg-blue-50`;
        }
    }

    return `${baseStyles} border-gray-200 hover:border-gray-300`;
};

export default function PaymentMethods({ selectedMethod, onMethodChange }: PaymentMethodsProps) {
    const { paymentMethods, isLoading, error } = usePaymentMethods();

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Méthode de paiement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-3">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <CreditCard className="w-5 h-5" />
                        Erreur de chargement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-red-600 text-sm">{error}</p>
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={selectedMethod === 'cod'}
                                onChange={(e) => onMethodChange(e.target.value)}
                            />
                            <Banknote className="w-5 h-5 text-green-600" />
                            <div>
                                <div className="font-medium">Paiement à la livraison</div>
                                <div className="text-sm text-gray-600">Paiement en espèces uniquement</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Méthode de paiement ({paymentMethods.length} disponible{paymentMethods.length > 1 ? 's' : ''})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {paymentMethods.map((method: PaymentMethod) => (
                        <div
                            key={method.id}
                            className={getMethodStyles(method.id, selectedMethod === method.id)}
                            onClick={() => onMethodChange(method.id)}
                        >
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method.id}
                                checked={selectedMethod === method.id}
                                onChange={() => { }} // Géré par le onClick du div
                                className="w-4 h-4"
                            />

                            {getPaymentIcon(method.id)}

                            <div className="flex-1">
                                <div className="font-medium">{method.title}</div>
                                {method.description && (
                                    <div className="text-sm text-gray-600 mt-1">
                                        {method.description}
                                    </div>
                                )}
                                {method.settings.instructions && (
                                    <div className="text-xs text-gray-500 mt-1">
                                        {method.settings.instructions}
                                    </div>
                                )}
                            </div>

                            {/* Badge pour les méthodes supportées */}
                            {method.supports.includes('refunds') && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Remboursable
                                </span>
                            )}
                        </div>
                    ))}
                </div>


            </CardContent>
        </Card>
    );
}