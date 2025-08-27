// src/app/api/payment-methods/route.ts

import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WC_API_URL || "",
    consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "",
    consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "",
    version: "wc/v3",
    queryStringAuth: true,
});

export async function GET() {
    try {
        console.log('🔍 Récupération des moyens de paiement...');

        // Récupérer les moyens de paiement via l'API WooCommerce
        const response = await api.get('payment_gateways');

        if (response.data) {
            // Filtrer seulement les moyens de paiement activés
            const enabledGateways = response.data.filter((gateway: any) => gateway.enabled === true);

            console.log(`✅ ${enabledGateways.length} moyens de paiement activés trouvés`);

            // Formater les données pour le frontend
            const formattedGateways = enabledGateways.map((gateway: any) => ({
                id: gateway.id,
                title: gateway.title,
                description: gateway.description,
                method_title: gateway.method_title,
                method_description: gateway.method_description,
                enabled: gateway.enabled,
                supports: gateway.supports || [],
                settings: {
                    instructions: gateway.settings?.instructions?.value || '',
                    enable_for_methods: gateway.settings?.enable_for_methods?.value || [],
                }
            }));

            return NextResponse.json({
                success: true,
                data: formattedGateways
            });
        } else {
            throw new Error('Aucune donnée de moyens de paiement retournée');
        }

    } catch (error: any) {
        console.error('❌ Erreur récupération moyens de paiement:', error);

        let errorMessage = 'Erreur lors de la récupération des moyens de paiement';

        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            {
                success: false,
                message: errorMessage,
                details: error.response?.data || error.message
            },
            { status: 500 }
        );
    }
}