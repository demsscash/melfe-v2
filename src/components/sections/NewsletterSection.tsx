// src/components/sections/NewsletterSection.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, CheckCircle } from 'lucide-react';

export default function NewsletterSection(): JSX.Element {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setError('Veuillez entrer une adresse email valide');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Simuler l'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsSubmitted(true);
            setEmail('');

            // Reset après 3 secondes
            setTimeout(() => {
                setIsSubmitted(false);
            }, 3000);
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <section className="py-20 bg-gray-50">
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-light tracking-wide">Merci !</h2>
                        <p className="text-gray-600">
                            Vous êtes maintenant inscrit(e) à notre newsletter.
                            Vous recevrez bientôt nos dernières actualités.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    {/* Titre et description */}
                    <div className="space-y-4">
                        <h2 className="text-3xl md:text-4xl font-light tracking-wide text-black">
                            Restez informé
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Recevez nos dernières collections et offres exclusives directement dans votre boîte mail
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <Input
                                    type="email"
                                    placeholder="Votre adresse email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 text-sm border border-gray-300 focus:border-black focus:ring-0 rounded-none"
                                    disabled={isSubmitting}
                                />
                                {error && (
                                    <p className="text-red-500 text-xs mt-2 text-left">{error}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting || !email}
                                className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm uppercase tracking-[2px] transition-all duration-300 rounded-none whitespace-nowrap"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Envoi...</span>
                                    </div>
                                ) : (
                                    "S'abonner"
                                )}
                            </Button>
                        </div>
                    </form>

                    {/* Informations supplémentaires */}
                    <div className="space-y-3 text-sm text-gray-500">
                        <p>
                            En vous abonnant, vous acceptez de recevoir nos communications marketing.
                        </p>
                        <div className="flex justify-center space-x-6 text-xs">
                            <span>• Pas de spam</span>
                            <span>• Désabonnement facile</span>
                            <span>• 1-2 emails par mois maximum</span>
                        </div>
                    </div>

                    {/* Avantages de l'inscription */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                        <div className="space-y-2">
                            <h4 className="font-medium text-black">Offres exclusives</h4>
                            <p className="text-sm text-gray-600">
                                Accès privilégié à nos soldes privées
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-black">Nouvelles collections</h4>
                            <p className="text-sm text-gray-600">
                                Soyez la première à découvrir nos créations
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-black">Conseils style</h4>
                            <p className="text-sm text-gray-600">
                                Tips et inspirations mode mauritanienne
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}