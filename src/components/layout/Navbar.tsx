// src/components/layout/Navbar.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext'; // Import depuis le Context
import { useHydration } from '@/hooks/useHydration';
import { Button } from '@/components/ui/button';
import {
    Menu,
    X,
    User,
    ShoppingBag,
    Search,
    LogOut,
    Settings,
    Package,
    Heart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CartPreview } from '@/components/cart/CartPreview';

interface NavigationItem {
    name: string;
    href: string;
    children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
    {
        name: 'FEMMES',
        href: '/femmes',
        children: [
            { name: 'NOUVELLES ARRIVÉES', href: '/femmes/nouvelles-arrivees' },
            { name: 'VOILES TRADITIONNELLES', href: '/femmes/voiles-traditionnelles' },
            { name: 'COLLECTION MODERNE', href: '/femmes/collection-moderne' },
            { name: 'OCCASIONS SPÉCIALES', href: '/femmes/occasions-speciales' },
        ]
    },
    {
        name: 'HOMMES',
        href: '/hommes',
        children: [
            { name: 'NOUVEAUTÉS', href: '/hommes/nouveautes' },
            { name: 'BOUBOUS', href: '/hommes/boubous' },
            { name: 'ACCESSOIRES', href: '/hommes/accessoires' },
        ]
    },
    {
        name: 'ENFANTS',
        href: '/enfants',
        children: [
            { name: 'FILLES', href: '/enfants/filles' },
            { name: 'GARÇONS', href: '/enfants/garcons' },
            { name: 'NOUVEAUTÉS ENFANTS', href: '/enfants/nouveautes' },
        ]
    },
    {
        name: 'MAISON',
        href: '/maison',
        children: [
            { name: 'DÉCORATION', href: '/maison/decoration' },
            { name: 'TEXTILES', href: '/maison/textiles' },
            { name: 'ARTISANAT', href: '/maison/artisanat' },
        ]
    },
    {
        name: 'COLLECTIONS',
        href: '/collections',
        children: [
            { name: 'NOUVELLE COLLECTION', href: '/collections/nouvelle' },
            { name: 'HÉRITAGE MAURITANIEN', href: '/collections/heritage' },
            { name: 'ÉDITION LIMITÉE', href: '/collections/edition-limitee' },
        ]
    }
];

const secondaryLinks = [
    { name: 'MEILLEURES VENTES', href: '/meilleures-ventes' },
    { name: 'PRIX SPÉCIAUX', href: '/promotions' },
    { name: 'ARTISANS', href: '/artisans' },
    { name: 'À PROPOS', href: '/a-propos' }
];

export function Navbar() {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const { cart, getItemCount } = useCart(); // Utilise le Context maintenant
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isCartPreviewOpen, setIsCartPreviewOpen] = useState(false);
    const isHydrated = useHydration();

    // Le compteur vient directement du Context partagé
    const cartCount = cart?.itemCount || 0;

    console.log('🏠 Navbar Context - cartCount:', cartCount, 'cart:', cart);

    // Délai pour fermer l'aperçu panier
    const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnterCart = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
        setIsCartPreviewOpen(true);
    };

    const handleMouseLeaveCart = () => {
        const timeout = setTimeout(() => {
            setIsCartPreviewOpen(false);
        }, 200); // Délai de 200ms pour permettre le passage vers l'aperçu
        setCloseTimeout(timeout);
    };

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Nettoyer le timeout au démontage
    useEffect(() => {
        return () => {
            if (closeTimeout) {
                clearTimeout(closeTimeout);
            }
        };
    }, [closeTimeout]);

    // Bloquer le scroll quand le menu est ouvert
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-white/95 backdrop-blur-md shadow-sm'
                        : 'bg-white/90 backdrop-blur-sm'
                }`}
            >
                <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Menu Burger - À gauche comme Zara */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2 hover:bg-transparent hover:opacity-60"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>

                        {/* Logo Central */}
                        <Link
                            href="/"
                            className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-light tracking-[4px] text-black hover:opacity-70 transition-opacity"
                        >
                            MELHFA
                        </Link>

                        {/* Actions à droite */}
                        <div className="flex items-center space-x-2 md:space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-transparent hover:opacity-60"
                            >
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* Compte utilisateur */}
                            {isHydrated && !isLoading && (
                                <>
                                    {isAuthenticated && user ? (
                                        <Link href="/account">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-2 hover:bg-transparent hover:opacity-60"
                                            >
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Link href="/connexion">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-2 hover:bg-transparent hover:opacity-60"
                                            >
                                                <User className="w-5 h-5" />
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}

                            {/* Panier avec hover amélioré */}
                            <div 
                                className="relative"
                                onMouseEnter={handleMouseEnterCart}
                                onMouseLeave={handleMouseLeaveCart}
                            >
                                <Link href="/panier">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 hover:bg-transparent hover:opacity-60 relative"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        {cartCount > 0 && (
                                            <Badge
                                                variant="default"
                                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-black text-white rounded-full"
                                            >
                                                {cartCount}
                                            </Badge>
                                        )}
                                    </Button>
                                </Link>
                                
                                <CartPreview 
                                    isOpen={isCartPreviewOpen} 
                                    onClose={() => setIsCartPreviewOpen(false)}
                                    onMouseEnter={handleMouseEnterCart}
                                    onMouseLeave={handleMouseLeaveCart}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Menu Overlay - Style Zara */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-white">
                    {/* Header du menu - Position exacte comme la navbar */}
                    <div className="max-w-[1400px] mx-auto px-4 md:px-6">
                        <div className="flex items-center justify-between h-16">
                            {/* Bouton X à la même position que le burger */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-2 hover:bg-transparent hover:opacity-60"
                            >
                                <X className="w-5 h-5" />
                            </Button>

                            {/* Logo Central - même position */}
                            <Link
                                href="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="absolute left-1/2 transform -translate-x-1/2 text-2xl md:text-3xl font-light tracking-[4px] text-black"
                            >
                                MELHFA
                            </Link>

                            {/* Spacer pour équilibrer */}
                            <div className="w-8" />
                        </div>
                    </div>
                    
                    {/* Ligne de séparation */}
                    <div className="border-b border-gray-100"></div>

                    {/* Contenu du menu */}
                    <div className="flex h-[calc(100vh-64px)]">
                        {/* Navigation principale - Gauche */}
                        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                            <nav className="space-y-8">
                                {/* Catégories principales */}
                                <div className="space-y-6">
                                    {navigation.map((category) => (
                                        <div key={category.name} className="space-y-3">
                                            <Link
                                                href={category.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-lg md:text-xl font-light tracking-wide text-black hover:opacity-60 transition-opacity"
                                            >
                                                {category.name}
                                            </Link>
                                            
                                            {/* Sous-catégories */}
                                            {category.children && (
                                                <div className="space-y-2 ml-4">
                                                    {category.children.map((subItem) => (
                                                        <Link
                                                            key={subItem.name}
                                                            href={subItem.href}
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="block text-sm font-light tracking-wide text-gray-600 hover:text-black transition-colors uppercase"
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Séparateur */}
                                <div className="border-t border-gray-200 pt-6">
                                    <div className="space-y-4">
                                        {secondaryLinks.map((link) => (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                            >
                                                {link.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions utilisateur */}
                                <div className="border-t border-gray-200 pt-6 space-y-4">
                                    {isHydrated && !isLoading && (
                                        <>
                                            {isAuthenticated && user ? (
                                                <>
                                                    <Link
                                                        href="/account"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center space-x-3 text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        <span>MON COMPTE</span>
                                                    </Link>
                                                    
                                                    <Link
                                                        href="/account?tab=orders"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center space-x-3 text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                                    >
                                                        <Package className="w-4 h-4" />
                                                        <span>MES COMMANDES</span>
                                                    </Link>

                                                    <Link
                                                        href="/wishlist"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="flex items-center space-x-3 text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                                    >
                                                        <Heart className="w-4 h-4" />
                                                        <span>LISTE DE SOUHAITS</span>
                                                    </Link>

                                                    <button
                                                        onClick={() => {
                                                            logout();
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                        className="flex items-center space-x-3 text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        <span>SE DÉCONNECTER</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <Link
                                                    href="/connexion"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center space-x-3 text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                                >
                                                    <User className="w-4 h-4" />
                                                    <span>SE CONNECTER</span>
                                                </Link>
                                            )}
                                        </>
                                    )}
                                    
                                    <Link
                                        href="/aide"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-sm font-light tracking-wide text-black hover:opacity-60 transition-opacity uppercase"
                                    >
                                        AIDE
                                    </Link>
                                </div>
                            </nav>
                        </div>

                        {/* Image ou contenu à droite - optionnel comme Zara */}
                        <div className="hidden lg:block w-1/2 bg-gray-50">
                            <div className="h-full flex items-center justify-center p-8">
                                <div className="text-center space-y-4">
                                    <h3 className="text-2xl font-light tracking-wide text-black">
                                        NOUVELLE COLLECTION
                                    </h3>
                                    <p className="text-sm text-gray-600 max-w-xs">
                                        Découvrez notre dernière collection de voiles mauritaniennes traditionnelles et modernes.
                                    </p>
                                    <Link
                                        href="/boutique"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="inline-block border border-black px-6 py-2 text-sm font-light tracking-wide hover:bg-black hover:text-white transition-colors"
                                    >
                                        DÉCOUVRIR
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}