// src/components/layout/Footer.tsx

'use client';

import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface FooterSection {
    title: string;
    links: Array<{
        name: string;
        href: string;
    }>;
}

const footerSections: FooterSection[] = [
    {
        title: 'Produits',
        links: [
            { name: 'Nouvelles Arrivées', href: '/boutique?filter=new' },
            { name: 'Collections Premium', href: '/collections/premium' },
            { name: 'Melhfa Traditionnelles', href: '/collections/traditionnelles' },
            { name: 'Accessoires', href: '/accessoires' },
        ],
    },
    {
        title: 'Aide',
        links: [
            { name: 'Guide des tailles', href: '/aide/tailles' },
            { name: 'Livraison', href: '/aide/livraison' },
            { name: 'Retours', href: '/aide/retours' },
            { name: 'FAQ', href: '/aide/faq' },
        ],
    },
    {
        title: 'Entreprise',
        links: [
            { name: 'À propos', href: '/a-propos' },
            { name: 'Carrières', href: '/carrieres' },
            { name: 'Presse', href: '/presse' },
            { name: 'Contact', href: '/contact' },
        ],
    },
];

const socialLinks = [
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'YouTube', href: '#', icon: Youtube },
];

export default function Footer(): JSX.Element {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNewsletterSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!email) return;

        // Simuler l'inscription à la newsletter
        setIsSubscribed(true);
        setEmail('');

        setTimeout(() => {
            setIsSubscribed(false);
        }, 3000);
    };

    return (
        <footer className="bg-white border-t border-black/5">
            {/* Newsletter Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <h2 className="text-2xl font-light mb-4 tracking-wide">
                        Restez informé
                    </h2>
                    <p className="text-gray-600 mb-8 text-sm">
                        Recevez nos dernières collections et offres exclusives
                    </p>

                    <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                        <div className="flex gap-0">
                            <Input
                                type="email"
                                placeholder="Votre adresse email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 rounded-r-none border-r-0 focus:ring-0 focus:border-black text-sm"
                                required
                            />
                            <Button
                                type="submit"
                                className="bg-black text-white hover:bg-gray-800 px-6 rounded-l-none text-xs uppercase tracking-wide"
                                disabled={isSubscribed}
                            >
                                {isSubscribed ? 'Merci !' : "S'abonner"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Sections de liens */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-widest mb-6 text-black">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Réseaux sociaux */}
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-widest mb-6 text-black">
                            Suivez-nous
                        </h3>
                        <div className="space-y-3">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <Link
                                        key={social.name}
                                        href={social.href}
                                        className="flex items-center text-sm text-gray-600 hover:text-black transition-colors group"
                                    >
                                        <IconComponent className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                                        {social.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                        <p className="text-xs text-gray-500">
                            © 2024 MELHFA. Tous droits réservés.
                        </p>
                        <div className="flex space-x-6">
                            <Link
                                href="/mentions-legales"
                                className="text-xs text-gray-500 hover:text-black transition-colors"
                            >
                                Mentions légales
                            </Link>
                            <Link
                                href="/politique-confidentialite"
                                className="text-xs text-gray-500 hover:text-black transition-colors"
                            >
                                Confidentialité
                            </Link>
                            <Link
                                href="/cookies"
                                className="text-xs text-gray-500 hover:text-black transition-colors"
                            >
                                Cookies
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-xs text-gray-500">Paiement sécurisé</span>
                        <div className="flex space-x-2">
                            {/* Logos des méthodes de paiement - vous pouvez remplacer par de vraies images */}
                            <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-[8px] font-bold text-gray-600">VISA</span>
                            </div>
                            <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-[8px] font-bold text-gray-600">MC</span>
                            </div>
                            <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-[8px] font-bold text-gray-600">PP</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}