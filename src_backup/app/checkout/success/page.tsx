// src/app/checkout/success/page.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    Package,
    Truck,
    Mail,
    Phone,
    Download,
    Home,
    ShoppingBag
} from 'lucide-react';

interface OrderDetails {
    orderNumber: string;
    date: string;
    total: string;
    paymentMethod: string;
    estimatedDelivery: string;
    trackingNumber?: string; // Optionnel
}

export default function CheckoutSuccessPage() {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simuler la récupération des détails de commande
        const timer = setTimeout(() => {
            setOrderDetails({
                orderNumber: `MELHFA-${Date.now().toString().slice(-6)}`,
                date: new Date().toLocaleDateString('fr-FR'),
                total: '85.000 MRU',
                paymentMethod: 'Carte bancaire',
                estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
                // trackingNumber sera undefined - pas de problème avec l'interface
            });
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-gray-600">Traitement de votre commande...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    <h1 className="text-4xl font-light tracking-wide text-black mb-4">
                        Commande confirmée !
                    </h1>

                    <p className="text-xl text-gray-600 mb-2">
                        Merci pour votre achat
                    </p>

                    {orderDetails && (
                        <p className="text-gray-600">
                            Commande n° <span className="font-medium">{orderDetails.orderNumber}</span>
                        </p>
                    )}
                </div>

                {/* Order Details */}
                {orderDetails && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Order Summary */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    Détails de la commande
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Numéro de commande</span>
                                        <span className="font-medium">{orderDetails.orderNumber}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date</span>
                                        <span className="font-medium">{orderDetails.date}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total</span>
                                        <span className="font-medium text-lg">{orderDetails.total}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Paiement</span>
                                        <Badge variant="secondary">{orderDetails.paymentMethod}</Badge>
                                    </div>

                                    <div className="border-t pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Statut</span>
                                            <Badge className="bg-green-100 text-green-800">
                                                Confirmée
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Info */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
                                    <Truck className="w-5 h-5" />
                                    Informations de livraison
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Livraison estimée</span>
                                        <span className="font-medium">{orderDetails.estimatedDelivery}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Méthode</span>
                                        <span className="font-medium">Livraison standard</span>
                                    </div>

                                    {orderDetails.trackingNumber ? (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Suivi</span>
                                            <Button variant="link" className="p-0 h-auto text-blue-600">
                                                {orderDetails.trackingNumber}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <strong>Suivi de commande :</strong> Vous recevrez un numéro de suivi par email dès que votre commande sera expédiée.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Next Steps */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <h2 className="text-lg font-medium mb-6">Prochaines étapes</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-medium mb-2">Confirmation par email</h3>
                                <p className="text-sm text-gray-600">
                                    Vous allez recevoir un email de confirmation avec tous les détails de votre commande.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Package className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="font-medium mb-2">Préparation</h3>
                                <p className="text-sm text-gray-600">
                                    Votre commande est en cours de préparation dans nos ateliers.
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Truck className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-medium mb-2">Livraison</h3>
                                <p className="text-sm text-gray-600">
                                    Livraison estimée le {orderDetails?.estimatedDelivery} à votre adresse.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-black text-white hover:bg-gray-800" asChild>
                        <Link href="/boutique">
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            Continuer mes achats
                        </Link>
                    </Button>

                    <Button variant="outline" size="lg" asChild>
                        <Link href="/">
                            <Home className="w-5 h-5 mr-2" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}