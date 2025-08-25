// src/app/checkout/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartActions } from '@/hooks/useCartSync'; import { formatPrice } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
    CreditCard,
    Lock,
    Truck,
    MapPin,
    Phone,
    Mail,
    User,
    ShoppingBag,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CheckoutFormData {
    // Informations personnelles
    firstName: string;
    lastName: string;
    email: string;
    phone: string;

    // Adresse de livraison
    address: string;
    city: string;
    postalCode: string;
    country: string;

    // Options
    notes: string;
    createAccount: boolean;
    newsletterOptIn: boolean;

    // Paiement
    paymentMethod: 'card' | 'cash' | 'transfer';
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<CheckoutFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'MR',
        notes: '',
        createAccount: false,
        newsletterOptIn: false,
        paymentMethod: 'card',
    });

    // Redirection si le panier est vide
    useEffect(() => {
        if (cart.items.length === 0) {
            router.push('/panier');
        }
    }, [cart.items.length, router]);

    const subtotal = cart.total;
    const shipping = subtotal >= 50000 ? 0 : 5000;
    const tax = 0; // Pas de TVA en Mauritanie pour la démo
    const total = subtotal + shipping + tax;

    const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean): void => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Effacer l'erreur si elle existe
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validation des champs obligatoires
        if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
        if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
        if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
        if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
        if (!formData.city.trim()) newErrors.city = 'La ville est requise';

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        // Validation du téléphone mauritanien
        const phoneRegex = /^(\+222|222)?[0-9]{8}$/;
        if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Format de téléphone invalide (ex: +222 XX XX XX XX)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Simuler l'appel API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Simuler le succès
            clearCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error('Erreur lors de la commande:', error);
            // Gérer l'erreur
        } finally {
            setIsLoading(false);
        }
    };

    if (cart.items.length === 0) {
        return null; // Le useEffect redirigera
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-light tracking-wide text-black mb-2">
                        Finaliser votre commande
                    </h1>
                    <p className="text-gray-600">
                        Complétez vos informations pour finaliser votre achat
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Informations personnelles */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Informations personnelles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">Prénom *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                placeholder="Votre prénom"
                                                className={errors.firstName ? 'border-red-500' : ''}
                                            />
                                            {errors.firstName && (
                                                <p className="text-sm text-red-500">{errors.firstName}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Nom *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                placeholder="Votre nom"
                                                className={errors.lastName ? 'border-red-500' : ''}
                                            />
                                            {errors.lastName && (
                                                <p className="text-sm text-red-500">{errors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="votre@email.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Téléphone *</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                                placeholder="+222 XX XX XX XX"
                                                className={errors.phone ? 'border-red-500' : ''}
                                            />
                                            {errors.phone && (
                                                <p className="text-sm text-red-500">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Adresse de livraison */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Adresse de livraison
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Adresse *</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Rue, quartier..."
                                            className={errors.address ? 'border-red-500' : ''}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Ville *</Label>
                                            <Select
                                                value={formData.city}
                                                onValueChange={(value) => handleInputChange('city', value)}
                                            >
                                                <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Choisir une ville" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="nouakchott">Nouakchott</SelectItem>
                                                    <SelectItem value="nouadhibou">Nouadhibou</SelectItem>
                                                    <SelectItem value="rosso">Rosso</SelectItem>
                                                    <SelectItem value="kaedi">Kaédi</SelectItem>
                                                    <SelectItem value="zouerate">Zouérate</SelectItem>
                                                    <SelectItem value="atar">Atar</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.city && (
                                                <p className="text-sm text-red-500">{errors.city}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode">Code postal</Label>
                                            <Input
                                                id="postalCode"
                                                value={formData.postalCode}
                                                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                                                placeholder="Code postal"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="country">Pays</Label>
                                            <Select
                                                value={formData.country}
                                                onValueChange={(value) => handleInputChange('country', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="MR">Mauritanie</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="notes">Instructions de livraison (optionnel)</Label>
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

                            {/* Méthode de paiement */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5" />
                                        Méthode de paiement
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card"
                                                checked={formData.paymentMethod === 'card'}
                                                onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'card')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4" />
                                                    <span className="font-medium">Carte bancaire</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Visa, MasterCard</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cash"
                                                checked={formData.paymentMethod === 'cash'}
                                                onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'cash')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-medium">Paiement à la livraison</span>
                                                </div>
                                                <p className="text-sm text-gray-600">Espèces uniquement</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="transfer"
                                                checked={formData.paymentMethod === 'transfer'}
                                                onChange={(e) => handleInputChange('paymentMethod', e.target.value as 'transfer')}
                                                className="w-4 h-4"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="font-medium">Virement bancaire</span>
                                                </div>
                                                <p className="text-sm text-gray-600">BIM, BMCI, GBM</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Options */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="createAccount"
                                            checked={formData.createAccount}
                                            onCheckedChange={(checked) => handleInputChange('createAccount', checked as boolean)}
                                        />
                                        <Label htmlFor="createAccount" className="text-sm">
                                            Créer un compte pour suivre mes commandes
                                        </Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="newsletter"
                                            checked={formData.newsletterOptIn}
                                            onCheckedChange={(checked) => handleInputChange('newsletterOptIn', checked as boolean)}
                                        />
                                        <Label htmlFor="newsletter" className="text-sm">
                                            Recevoir les offres et nouveautés par email
                                        </Label>
                                    </div>
                                </CardContent>
                            </Card>
                        </form>
                    </div>

                    {/* Résumé de commande */}
                    <div className="space-y-6">
                        {/* Articles */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Votre commande ({cart.itemCount} articles)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="relative w-16 h-16 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                            <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
                                            <p className="font-medium">{formatPrice(item.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Résumé des prix */}
                        <Card>
                            <CardContent className="pt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Livraison</span>
                                    <span>{shipping === 0 ? 'Gratuite' : formatPrice(shipping)}</span>
                                </div>

                                {tax > 0 && (
                                    <div className="flex justify-between">
                                        <span>TVA</span>
                                        <span>{formatPrice(tax)}</span>
                                    </div>
                                )}

                                <Separator />

                                <div className="flex justify-between text-lg font-medium">
                                    <span>Total</span>
                                    <span>{formatPrice(total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bouton de commande */}
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            size="lg"
                            className="w-full bg-black text-white hover:bg-gray-800 py-4"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Traitement en cours...
                                </div>
                            ) : (
                                <>
                                    <Lock className="w-5 h-5 mr-2" />
                                    Confirmer la commande
                                </>
                            )}
                        </Button>

                        {/* Sécurité */}
                        <div className="text-center space-y-2">
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <Lock className="w-4 h-4" />
                                <span>Paiement 100% sécurisé</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Vos données sont protégées par cryptage SSL
                            </p>
                        </div>


                        {/* Retour au panier */}
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/panier">
                                Retour au panier
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}