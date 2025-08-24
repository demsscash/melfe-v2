// src/components/layout/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartActions } from '@/hooks/useCartSync';import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';

interface NavigationItem {
    name: string;
    href: string;
}

const navigation: NavigationItem[] = [
    { name: 'Nouvelles Arrivées', href: '/boutique?filter=new' },
    { name: 'Collections', href: '/collections' },
    { name: 'Promotions', href: '/boutique?filter=sale' },
    { name: 'Accessoires', href: '/accessoires' },
];

export default function Header(): JSX.Element {
    const { getItemCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const itemCount = getItemCount();

    useEffect(() => {
        const handleScroll = (): void => {
            setIsScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
                    ? 'bg-white/98 backdrop-blur-xl shadow-sm border-b border-black/5'
                    : 'bg-white/95 backdrop-blur-xl border-b border-black/5'
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center justify-between py-3">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-semibold tracking-[3px] text-black hover:opacity-70 transition-opacity"
                    >
                        MELHFA
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-normal text-black hover:opacity-60 transition-opacity tracking-wide uppercase"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions Desktop */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Recherche
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Connexion
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                        >
                            Aide
                        </Button>

                        <Link href="/panier" className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-transparent hover:opacity-60"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center p-0"
                                    >
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                    </div>

                    {/* Menu Mobile */}
                    <div className="lg:hidden flex items-center space-x-4">
                        <Link href="/panier" className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="p-2 hover:bg-transparent hover:opacity-60"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center p-0"
                                    >
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 hover:bg-transparent hover:opacity-60"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 p-0">
                                <div className="flex flex-col h-full">
                                    {/* Header du menu mobile */}
                                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                        <span className="text-lg font-semibold tracking-wide">Menu</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2"
                                        >
                                            <X className="w-5 h-5" />
                                        </Button>
                                    </div>

                                    {/* Navigation mobile */}
                                    <nav className="flex-1 p-6">
                                        <div className="space-y-6">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block text-base font-normal text-black hover:opacity-60 transition-opacity tracking-wide uppercase"
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                                            >
                                                <Search className="w-4 h-4 mr-3" />
                                                Recherche
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Connexion
                                            </Button>

                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-sm font-normal tracking-wide uppercase text-black hover:bg-transparent hover:opacity-60"
                                            >
                                                Aide
                                            </Button>
                                        </div>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}