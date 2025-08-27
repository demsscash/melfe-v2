// src/types/payment.ts

export interface PaymentGatewaySettings {
    title?: {
        id: string;
        label: string;
        description: string;
        type: string;
        value: string;
        default: string;
        tip: string;
        placeholder: string;
    };
    instructions?: {
        id: string;
        label: string;
        description: string;
        type: string;
        value: string;
        default: string;
        tip: string;
        placeholder: string;
    };
    enable_for_methods?: {
        id: string;
        label: string;
        description: string;
        type: string;
        value: string[];
        default: string[];
        tip: string;
        placeholder: string;
    };
}

export interface WooCommercePaymentGateway {
    id: string;
    title: string;
    description: string;
    order: number;
    enabled: boolean;
    method_title: string;
    method_description: string;
    method_supports: string[];
    settings: PaymentGatewaySettings;
    supports: string[];
}

export interface ProcessedPaymentMethod {
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
    // Propriétés supplémentaires pour l'UI
    icon?: string;
    color?: string;
    isRecommended?: boolean;
}

export interface PaymentMethodsResponse {
    success: boolean;
    data?: ProcessedPaymentMethod[];
    message?: string;
    error?: string;
}

// Types pour les commandes avec moyens de paiement
export interface OrderPaymentData {
    method_id: string;
    method_title: string;
    method_description?: string;
    paid: boolean;
    transaction_id?: string;
}

export interface CreateOrderData {
    customerInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        notes?: string;
    };
    items: Array<{
        id: number;
        name: string;
        price: number;
        quantity: number;
        total: number;
    }>;
    paymentMethod: string;
    paymentMethodTitle: string;
    shipping: number;
    total: number;
}