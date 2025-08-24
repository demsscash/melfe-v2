// src/app/checkout/success/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    CheckCircle,
    Package,
    Truck,
    Home,
    ShoppingBag
} from 'lucide-react';

interface OrderDetails {
    id: number;
    number: string;
    status: string;
    total: string;
    date_created: string;
    payment_method: string;
    billing: {
        first_name: string;
        last_name: string;
        email: string;
    };
}

export default function CheckoutSuccessPage() {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Récupérer les détails de la commande depuis localStorage
        try {
            const savedOrder = localStorage.getItem('lastOrder');
            if (savedOrder) {
                const order = JSON.parse(savedOrder);
                setOrderDetails(order);

                // Nettoyer localStorage après récupération
                localStorage.removeItem('lastOrder');
            } else {
                // Pas de commande trouvée, générer des données par défaut
                setOrderDetails({
                    id: 0,
                    number: `MELHFA-${Date.now().toString().slice(-6)}`,
                    status: 'processing',
                    total: '0 MRU',
                    date_created: new Date().toISOString(),
                    payment_method: 'Paiement à la livraison',
                    billing: {
                        first_name: '',
                        last_name: '',
                        email: ''
                    }
                });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des détails de commande:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string | number) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return new Intl.NumberFormat('fr-MR', {
            style: 'currency',
            currency: 'MRU',
            minimumFractionDigits: 0,
        }).format(numPrice);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-600">Chargement des détails de commande...</p>
                </div>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Aucune commande trouvée</h2>
                    <Button asChild>
                        <Link href="/boutique">Retour à la boutique</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-16">
            <div className="max-w-2xl mx-auto px-4 text-center">

                {/* Icône de succès */}
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>

                {/* Message principal */}
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Commande confirmée !
                </h1>

                <p className="text-xl text-gray-600 mb-2">
                    Merci {orderDetails.billing.first_name} pour votre achat
                </p>

                <p className="text-gray-600 mb-8">
                    Votre commande de melhfa authentiques a été enregistrée
                </p>

                {/* Détails de la commande */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-lg">
                                <Package className="w-5 h-5" />
                                <span>
                                    Commande n° <strong>
                                        {orderDetails.number || `#${orderDetails.id}`}
                                    </strong>
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Total:</strong> {formatPrice(orderDetails.total)}
                                </div>
                                <div>
                                    <strong>Paiement:</strong> {orderDetails.payment_method}
                                </div>
                                <div>
                                    <strong>Date:</strong> {formatDate(orderDetails.date_created)}
                                </div>
                                <div>
                                    <strong>Statut:</strong> En traitement
                                </div>
                            </div>

                            <div className="text-gray-600 pt-4 border-t">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Truck className="w-4 h-4" />
                                    <span>Livraison estimée : 2-3 jours ouvrables</span>
                                </div>
                                <p className="text-sm">
                                    Vous recevrez un SMS de confirmation avec les détails de livraison
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="space-y-4">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Retour à l'accueil
                        </Link>
                    </Button>

                    <div>
                        <Button variant="outline" asChild className="w-full sm:w-auto">
                            <Link href="/boutique">
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Continuer mes achats
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Informations supplémentaires */}
                <div className="mt-12 p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">
                        Prochaines étapes
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Votre commande est maintenant dans WooCommerce</li>
                        <li>• Vous recevrez un SMS de confirmation</li>
                        <li>• Notre équipe préparera votre commande</li>
                        <li>• Livraison sous 2-3 jours ouvrables</li>
                        <li>• Paiement à la réception</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}