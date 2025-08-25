// src/app/checkout/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCartActions } from '@/hooks/useCartSync'; import { useHydration } from '@/hooks/useHydration';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';

import {
    CreditCard,
    Lock,
    ArrowLeft,
    MapPin,
    Phone,
    Mail,
    User,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MelhfaLoader } from '@/components/ui/MelhfaLoader';

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { cart, clearCart } = useCart();
    const isHydrated = useHydration(); // Attendre l'hydratation
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        paymentMethod: 'cash'
    });

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
                    <h2 className="text-2xl font-bold mb-4">Panier vide</h2>
                    <p className="mb-4">Votre panier est vide. Ajoutez des produits pour continuer.</p>
                    <Button asChild>
                        <Link href="/boutique">Voir nos produits</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const subtotal = cart.total || 0;
    const shipping = subtotal >= 50000 ? 0 : 5000; // Livraison gratuite > 50k MRU
    const total = subtotal + shipping;

    const handleSubmit = async () => {
        setIsLoading(true);

        try {
            console.log('🛒 Création de la commande...');

            // Vérifier que les champs obligatoires sont remplis
            if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city) {
                alert('Veuillez remplir tous les champs obligatoires');
                setIsLoading(false);
                return;
            }

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
                    country: 'MR',
                    notes: '' // On peut ajouter un champ notes plus tard
                },
                items: cart.items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.total
                })),
                paymentMethod: formData.paymentMethod,
                subtotal: subtotal,
                shipping: shipping,
                total: total
            };

            console.log('📦 Données de commande:', orderData);

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
                console.log('✅ Commande créée avec succès!', result.order);

                // Sauvegarder les détails de la commande pour la page de succès
                if (typeof window !== 'undefined') {
                    localStorage.setItem('lastOrder', JSON.stringify(result.order));
                }

                // Vider le panier
                clearCart();

                // Rediriger vers la page de succès
                router.push('/checkout/success');

            } else {
                console.error('❌ Erreur:', result.message);
                alert(`Erreur lors de la création de la commande: ${result.message}`);
            }

        } catch (error) {
            console.error('💥 Erreur complète:', error);
            alert('Erreur de connexion. Veuillez réessayer.');
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
            style: 'currency',
            currency: 'MRU',
            minimumFractionDigits: 0,
        }).format(price);
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

                <div className="grid lg:grid-cols-2 gap-8">

                    {/* Formulaire */}
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
                                        <Label htmlFor="firstName">Prénom</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            placeholder="Votre prénom"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Nom</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        placeholder="+222 XX XX XX XX"
                                    />
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
                                    <Label htmlFor="address">Adresse</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        placeholder="Votre adresse complète"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">Ville</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            placeholder="Nouakchott"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode">Code postal</Label>
                                        <Input
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                            placeholder="Code postal"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Méthode de paiement */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="w-5 h-5" />
                                    Méthode de paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={formData.paymentMethod === 'cash'}
                                            onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                                        />
                                        <div>
                                            <div className="font-medium">Paiement à la livraison</div>
                                            <div className="text-sm text-gray-600">Espèces uniquement</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 p-4 border rounded-lg opacity-50">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            disabled
                                        />
                                        <div>
                                            <div className="font-medium">Carte bancaire</div>
                                            <div className="text-sm text-gray-600">Bientôt disponible</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Résumé de commande */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Résumé de la commande</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">

                                {/* Produits */}
                                <div className="space-y-3">
                                    {cart.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                                                {item.image && (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-medium">
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
                                    <div className="flex justify-between">
                                        <span>Livraison</span>
                                        <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-medium">
                                        <span>Total</span>
                                        <span>{formatPrice(total)}</span>
                                    </div>
                                </div>

                                {/* Bouton de commande */}
                                <Button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Traitement...
                                        </div>
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Confirmer la commande
                                        </>
                                    )}
                                </Button>

                                {/* Sécurité */}
                                <div className="text-center text-sm text-gray-600 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" />
                                    Paiement 100% sécurisé
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}