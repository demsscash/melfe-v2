
// src/components/layout/Footer.tsx

import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Melhfa Store</h3>
                        <p className="text-gray-400 text-sm">
                            Votre destination pour les melhfa mauritaniennes authentiques et de qualité premium.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="text-gray-400 hover:text-white">Accueil</Link></li>
                            <li><Link href="/boutique" className="text-gray-400 hover:text-white">Boutique</Link></li>
                            <li><Link href="/collections" className="text-gray-400 hover:text-white">Collections</Link></li>
                            <li><Link href="/about" className="text-gray-400 hover:text-white">À propos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Compte</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/auth/login" className="text-gray-400 hover:text-white">Connexion</Link></li>
                            <li><Link href="/auth/register" className="text-gray-400 hover:text-white">Inscription</Link></li>
                            <li><Link href="/account" className="text-gray-400 hover:text-white">Mon compte</Link></li>
                            <li><Link href="/panier" className="text-gray-400 hover:text-white">Panier</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li>Email: contact@melhfastore.com</li>
                            <li>Tél: +222 XX XX XX XX</li>
                            <li>Nouakchott, Mauritanie</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
                    <p>&copy; 2025 Melhfa Store. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}