// src/app/account/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthService } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    User,
    ShoppingBag,
    MapPin,
    CreditCard,
    Settings,
    LogOut,
    Package
} from 'lucide-react';
import { useRequireAuth } from '@/hooks/useAuth';
import { MelhfaFullScreenLoader, MelhfaLoader } from '@/components/ui/MelhfaLoader';

export default function AccountPage() {
    const { user, logout, updateUser, isLoading } = useAuth();
    const { isAuthenticated } = useRequireAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (user) {
            loadUserOrders();
        }
    }, [user]);

    const loadUserOrders = async () => {
        if (!user) return;

        try {
            setLoadingOrders(true);
            const userOrders = await AuthService.getUserOrders(user.id);
            setOrders(userOrders);
        } catch (error) {
            console.error('Erreur lors du chargement des commandes:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    if (isLoading || !isAuthenticated) {
        return <MelhfaFullScreenLoader text="Connexion en cours..." color="purple" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Bonjour, {user?.firstName || user?.displayName} !
                                </h1>
                                <p className="text-gray-600">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={logout} className="flex items-center space-x-2">
                            <LogOut className="h-4 w-4" />
                            <span>Déconnexion</span>
                        </Button>
                    </div>
                </div>

                {/* Contenu principal */}
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile" className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Commandes</span>
                        </TabsTrigger>
                        <TabsTrigger value="addresses" className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>Adresses</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center space-x-2">
                            <Settings className="h-4 w-4" />
                            <span>Paramètres</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Onglet Profil */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations personnelles</CardTitle>
                                <CardDescription>
                                    Gérez vos informations de profil
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Prénom</Label>
                                        <Input
                                            id="firstName"
                                            defaultValue={user?.firstName || ''}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Nom</Label>
                                        <Input
                                            id="lastName"
                                            defaultValue={user?.lastName || ''}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                    />
                                </div>
                                <Button>Mettre à jour le profil</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet Commandes */}
                    <TabsContent value="orders" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Mes commandes</CardTitle>
                                <CardDescription>
                                    Historique de vos commandes
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingOrders ? (
                                    <div className="flex justify-center py-8">
                                        <MelhfaLoader size="lg" text="Chargement des commandes..." color="blue" />
                                    </div>
                                ) : orders.length > 0 ? (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div key={order.id} className="border rounded-lg p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold">Commande #{order.number}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {new Date(order.date_created).toLocaleDateString('fr-FR')}
                                                        </p>
                                                        <p className="text-sm">
                                                            Status: <span className="font-medium">{order.status}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{order.total} {order.currency}</p>
                                                        <Button variant="outline" size="sm" className="mt-2">
                                                            Voir détails
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">Aucune commande pour le moment</p>
                                        <Button className="mt-4">
                                            Découvrir nos produits
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet Adresses */}
                    <TabsContent value="addresses" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Adresse de facturation</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="billing_address">Adresse</Label>
                                        <Input
                                            id="billing_address"
                                            defaultValue={user?.billing?.address_1 || ''}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="billing_city">Ville</Label>
                                            <Input
                                                id="billing_city"
                                                defaultValue={user?.billing?.city || ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="billing_postcode">Code postal</Label>
                                            <Input
                                                id="billing_postcode"
                                                defaultValue={user?.billing?.postcode || ''}
                                            />
                                        </div>
                                    </div>
                                    <Button>Mettre à jour</Button>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Adresse de livraison</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="shipping_address">Adresse</Label>
                                        <Input
                                            id="shipping_address"
                                            defaultValue={user?.shipping?.address_1 || ''}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_city">Ville</Label>
                                            <Input
                                                id="shipping_city"
                                                defaultValue={user?.shipping?.city || ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="shipping_postcode">Code postal</Label>
                                            <Input
                                                id="shipping_postcode"
                                                defaultValue={user?.shipping?.postcode || ''}
                                            />
                                        </div>
                                    </div>
                                    <Button>Mettre à jour</Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Onglet Paramètres */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sécurité du compte</CardTitle>
                                <CardDescription>
                                    Gérez la sécurité de votre compte
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline">
                                    Changer le mot de passe
                                </Button>
                                <Separator />
                                <div className="pt-4">
                                    <h3 className="font-semibold text-red-600 mb-2">Zone de danger</h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        La suppression de votre compte est irréversible.
                                    </p>
                                    <Button variant="destructive">
                                        Supprimer le compte
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}