// src/app/checkout/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartActions } from '@/hooks/useCartSync';
import { useHydration } from '@/hooks/useHydration';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import PaymentMethods from '@/components/checkout/PaymentMethods';

import {
    Lock,
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    User,
    Package,
    Truck,
    Calculator
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MelhfaLoader } from '@/components/ui/MelhfaLoader';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { cart, clearCart } = useCart();
    const isHydrated = useHydration();
    const { paymentMethods, isLoading: isLoadingPayments } = usePaymentMethods();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'MR',
        notes: '',
        paymentMethod: '' // Sera défini automatiquement
    });

    // Mise à jour automatique du moyen de paiement par défaut
    useEffect(() => {
        if (paymentMethods.length > 0 && !formData.paymentMethod) {
            setFormData(prev => ({
                ...prev,
                paymentMethod: paymentMethods[0].id
            }));
        }
    }, [paymentMethods, formData.paymentMethod]);

    // Redirection si panier vide - SEULEMENT après hydratation
    useEffect(() => {
        if (isHydrated && cart.items.length === 0) {
            console.log('Panier vide après hydratation, redirection...');
            router.push('/panier');
        }
    }, [cart.items.length, router, isHydrated]);

    // Afficher un loader pendant l'hydratation
    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <MelhfaLoader size="lg" text="Chargement du checkout..." color="purple" />
            </div>
        );
    }

    // Vérifier si le panier est vide après hydratation
    if (cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold mb-4">Panier vide</h2>
                    <p className="mb-4 text-gray-600">Votre panier est vide. Ajoutez des produits pour continuer.</p>
                    <Button asChild>
                        <Link href="/boutique">Voir nos produits</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Calculs
    const subtotal = cart.total || 0;
    const shippingCost = subtotal >= 50000 ? 0 : 5000; // Livraison gratuite > 50k MRU
    const total = subtotal + shippingCost;

    const calculateTotal = () => total;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isLoading) return;

        // Validation des champs obligatoires
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

        if (missingFields.length > 0) {
            alert(`Veuillez remplir tous les champs obligatoires: ${missingFields.join(', ')}`);
            return;
        }

        if (!formData.paymentMethod) {
            alert('Veuillez sélectionner un moyen de paiement');
            return;
        }

        setIsLoading(true);

        try {
            console.log('🛒 Création de la commande...');

            // Récupérer le nom du moyen de paiement sélectionné
            const selectedPaymentMethod = paymentMethods.find(pm => pm.id === formData.paymentMethod);

            // Préparer les données de commande
            const orderData = {
                customerInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    country: formData.country,
                    notes: formData.notes
                },
                items: cart.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total
                })),
                paymentMethod: formData.paymentMethod,
                paymentMethodTitle: selectedPaymentMethod?.title || 'Méthode inconnue',
                subtotal: subtotal,
                shipping: shippingCost,
                total: total
            };

            console.log('📦 Données de commande envoyées:', orderData);

            // Appeler l'API pour créer la commande
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            console.log('📋 Réponse API:', result);

            if (result.success) {
                console.log('✅ Commande créée avec succès:', result.order);

                // Sauvegarder les détails de la commande pour la page de succès
                if (typeof window !== 'undefined') {
                    localStorage.setItem('lastOrder', JSON.stringify(result.order));
                }

                // Vider le panier
                clearCart();

                // Rediriger vers la page de succès
                router.push('/checkout/success');
            } else {
                throw new Error(result.message || 'Erreur lors de la création de la commande');
            }

        } catch (error: any) {
            console.error('❌ Erreur lors de la commande:', error);
            alert(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MR', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' MRU';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4">
                        <Link href="/panier">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour au panier
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">Finaliser la commande</h1>
                    <p className="text-gray-600">
                        {cart.items.length} article{cart.items.length > 1 ? 's' : ''} dans votre panier
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Colonne de gauche - Formulaire */}
                    <div className="space-y-6">

                        {/* Informations personnelles */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Informations personnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">Prénom *</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            placeholder="Mohamed"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Nom *</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            placeholder="Fall"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="mohamed@example.com"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone">Téléphone *</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="+222 36 12 34 56"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Adresse de livraison */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Adresse de livraison
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="address">Adresse *</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="123 Rue de la République"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">Ville *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Nouakchott"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode">Code postal</Label>
                                        <Input
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            placeholder="10000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="notes">Notes de livraison (optionnel)</Label>
                                    <Textarea
                                        id="notes"
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        placeholder="Instructions spéciales pour la livraison..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Moyens de paiement - Nouveau composant dynamique */}
                        <PaymentMethods
                            selectedMethod={formData.paymentMethod}
                            onMethodChange={(methodId) => handleInputChange('paymentMethod', methodId)}
                        />
                    </div>

                    {/* Colonne de droite - Résumé */}
                    <div className="space-y-6">

                        {/* Résumé de la commande */}
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle>Résumé de la commande</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {/* Produits */}
                                <div className="space-y-3">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3 py-2">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={item.image || '/placeholder-product.jpg'}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-sm">{item.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {formatPrice(item.price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div className="font-medium">
                                                {formatPrice(item.total)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator />

                                {/* Totaux */}
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Sous-total</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <Truck className="w-4 h-4 text-gray-400" />
                                            <span>Livraison</span>
                                        </div>
                                        <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                                            {shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}
                                        </span>
                                    </div>

                                    {subtotal < 50000 && (
                                        <div className="text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                                            💡 Ajoutez {formatPrice(50000 - subtotal)} pour bénéficier de la livraison gratuite
                                        </div>
                                    )}

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-amber-600">{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Bouton de commande */}
                                <Button
                                    type="submit"
                                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg font-medium disabled:opacity-50 mt-6"
                                    disabled={isLoading || isLoadingPayments || paymentMethods.length === 0}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin mr-2">⏳</span>
                                            Traitement en cours...
                                        </>
                                    ) : isLoadingPayments ? (
                                        <>
                                            <span className="animate-pulse mr-2">🔄</span>
                                            Chargement des moyens de paiement...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5 mr-2" />
                                            Finaliser la commande • {formatPrice(total)}
                                        </>
                                    )}
                                </Button>

                                {/* Sécurité */}
                                <div className="text-center text-sm text-gray-500 mt-4">
                                    <Lock className="w-4 h-4 mx-auto mb-1" />
                                    Paiement 100% sécurisé
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
}