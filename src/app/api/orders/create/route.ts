// src/app/api/orders/create/route.ts

import { NextRequest, NextResponse } from 'next/server';
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WC_API_URL || "",
    consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "",
    consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "",
    version: "wc/v3",
    queryStringAuth: true,
});

export async function POST(request: NextRequest) {
    try {
        const orderData = await request.json();
        console.log('Données de commande reçues:', orderData);

        // Préparer les données pour WooCommerce
        const wooOrderData = {
            // Informations client
            billing: {
                first_name: orderData.customerInfo.firstName,
                last_name: orderData.customerInfo.lastName,
                email: orderData.customerInfo.email,
                phone: orderData.customerInfo.phone,
                address_1: orderData.customerInfo.address,
                city: orderData.customerInfo.city,
                postcode: orderData.customerInfo.postalCode,
                country: orderData.customerInfo.country || 'MR',
            },

            shipping: {
                first_name: orderData.customerInfo.firstName,
                last_name: orderData.customerInfo.lastName,
                address_1: orderData.customerInfo.address,
                city: orderData.customerInfo.city,
                postcode: orderData.customerInfo.postalCode,
                country: orderData.customerInfo.country || 'MR',
            },

            // Produits
            line_items: orderData.items.map((item: any) => ({
                product_id: item.id,
                quantity: item.quantity,
                name: item.name,
                price: parseFloat(item.price),
                total: item.total.toString()
            })),

            // Méthode de paiement
            payment_method: orderData.paymentMethod === 'cash' ? 'cod' : orderData.paymentMethod,
            payment_method_title: orderData.paymentMethod === 'cash' ? 'Paiement à la livraison' : 'Carte bancaire',

            // Frais de livraison
            shipping_lines: orderData.shipping > 0 ? [{
                method_id: 'flat_rate',
                method_title: 'Livraison standard',
                total: orderData.shipping.toString()
            }] : [],

            // Statut
            status: 'processing',

            // Notes
            customer_note: orderData.customerInfo.notes || '',

            // Métadonnées
            meta_data: [
                {
                    key: '_created_via',
                    value: 'melhfa_frontend'
                },
                {
                    key: '_order_source',
                    value: 'nextjs_app'
                }
            ]
        };

        console.log('Données formatées pour WooCommerce:', wooOrderData);

        // Créer la commande dans WooCommerce
        const response = await api.post('orders', wooOrderData);

        if (response.data) {
            console.log('✅ Commande créée dans WooCommerce:', response.data.id);

            return NextResponse.json({
                success: true,
                order: {
                    id: response.data.id,
                    number: response.data.number,
                    status: response.data.status,
                    total: response.data.total,
                    date_created: response.data.date_created,
                    payment_method: response.data.payment_method_title,
                    billing: response.data.billing,
                    shipping: response.data.shipping,
                }
            });
        } else {
            throw new Error('Pas de données de commande retournées');
        }

    } catch (error: any) {
        console.error('❌ Erreur création commande:', error);

        let errorMessage = 'Erreur lors de la création de la commande';

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