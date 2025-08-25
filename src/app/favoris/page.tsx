// src/app/favoris/page.tsx

'use client';


import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/woocommerce';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Heart,
    ShoppingBag,
    X,
    ArrowRight,
    Star,
    Sparkles
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function FavorisPage() {
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart, isInCart } = useCart();

    console.log('💖 FavorisPage render - wishlist:', wishlist);

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
        });
    };

    const handleRemoveFromWishlist = (id: number) => {
        removeFromWishlist(id);
    };

    if (!wishlist || wishlist.items.length === 0) {
        return (
            <div className="min-h-screen bg-white pt-20">
                <div className="max-w-[1400px] mx-auto px-6 py-16">
                    <div className="text-center space-y-8">
                        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                            <Heart className="w-16 h-16 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl font-light tracking-wide">Aucun favori pour le moment</h1>
                            <p className="text-gray-600 max-w-md mx-auto">
                                Découvrez notre collection et ajoutez vos melhfa préférées à vos favoris.
                            </p>
                            <div className="pt-6">
                                <Link href="/boutique">
                                    <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
                                        Découvrir la boutique
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="max-w-[1400px] mx-auto px-6 py-16">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-light tracking-wide flex items-center gap-3">
                            <Heart className="w-8 h-8 text-red-500 fill-current" />
                            Mes Favoris
                        </h1>
                        <p className="text-gray-600">
                            {wishlist.itemCount} produit{wishlist.itemCount > 1 ? 's' : ''} en favori{wishlist.itemCount > 1 ? 's' : ''}
                        </p>
                    </div>

                    {wishlist.itemCount > 0 && (
                        <Button
                            variant="outline"
                            onClick={clearWishlist}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                            Vider tous les favoris
                        </Button>
                    )}
                </div>

                {/* Grille des favoris */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.items.map((item) => (
                        <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-0">
                                {/* Image Container */}
                                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                                    <Link href={`/produit/${item.slug}`}>
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>

                                    {/* Bouton supprimer */}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                        className="absolute top-3 right-3 w-9 h-9 p-0 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>

                                    {/* Badge promo si applicable */}
                                    {item.sale_price && item.regular_price && (
                                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                                            -{Math.round(((parseFloat(item.regular_price) - parseFloat(item.sale_price)) / parseFloat(item.regular_price)) * 100)}%
                                        </Badge>
                                    )}
                                </div>

                                {/* Informations produit */}
                                <div className="p-4 space-y-3">
                                    <div className="space-y-1">
                                        <Link
                                            href={`/produit/${item.slug}`}
                                            className="hover:text-black transition-colors"
                                        >
                                            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-black">
                                                {item.name}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-2">
                                            {item.sale_price ? (
                                                <>
                                                    <span className="text-lg font-semibold text-red-600">
                                                        {formatPrice(parseFloat(item.sale_price))}
                                                    </span>
                                                    <span className="text-sm text-gray-500 line-through">
                                                        {formatPrice(parseFloat(item.regular_price || item.price))}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {formatPrice(parseFloat(item.price))}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date d'ajout */}
                                    <p className="text-xs text-gray-500">
                                        Ajouté le {new Date(item.dateAdded).toLocaleDateString('fr-FR')}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            onClick={() => handleAddToCart(item)}
                                            className={cn(
                                                "flex-1 transition-all duration-300",
                                                isInCart(item.id)
                                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                                    : "bg-black hover:bg-gray-800 text-white"
                                            )}
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            {isInCart(item.id) ? 'Dans le panier' : 'Ajouter'}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRemoveFromWishlist(item.id)}
                                            className="px-3 text-red-500 border-red-200 hover:bg-red-50"
                                        >
                                            <Heart className="w-4 h-4 fill-current" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Suggestions */}
                <div className="mt-16 text-center space-y-4">
                    <div className="flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <p className="text-gray-600">Continuez à découvrir nos collections</p>
                    </div>
                    <Link href="/boutique">
                        <Button variant="outline" className="px-8">
                            Voir plus de produits
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}