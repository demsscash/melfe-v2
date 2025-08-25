// src/app/page.tsx

import { Suspense } from 'react';
import React from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { WooCommerceService } from '@/lib/woocommerce';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Truck, Shield, Heart } from 'lucide-react';


// Composants pour les sections de la page d'accueil
import HeroSection from '@/components/sections/HeroSection';
import FeaturedProductsSection from '@/components/sections/FeaturedProductsSection';
import PromoSection from '@/components/sections/PromoSection';
import NewsletterSection from '@/components/sections/NewsletterSection';

export default async function HomePage(): Promise<JSX.Element> {
  // Récupérer les données des produits
  const [featuredProducts, saleProducts, newArrivals] = await Promise.all([
    WooCommerceService.getFeaturedProducts(6),
    WooCommerceService.getSaleProducts(4),
    WooCommerceService.getNewArrivals(8),
  ]);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Promo Banner */}
      <PromoSection />

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-4 tracking-wide">
              Produits Vedettes
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de melhfa d&apos;exception, alliant tradition mauritanienne et élégance contemporaine
            </p>
          </div>

          {/* Grid de produits vedettes avec design asymétrique */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {/* Produit principal - grande taille */}
            <div className="lg:row-span-2">
              <div className="relative h-[600px] lg:h-[824px] overflow-hidden rounded-lg group cursor-pointer">
                <Image
                  src="/images/melf2.jpg"
                  alt="Collection Sahara"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 right-6">
                  <Badge className="bg-red-500 text-white">-25%</Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-light mb-3 tracking-wide">Collection Sahara</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Melhfa artisanale aux motifs berbères traditionnels, tissée à la main dans nos ateliers de Nouakchott.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-medium">
                      42.000 MRU{" "}
                      <span className="text-sm line-through opacity-70">56.000 MRU</span>
                    </div>
                    <Button className="bg-white text-black hover:bg-gray-100">
                      Découvrir
                    </Button>

                  </div>
                </div>
              </div>
            </div>

            {/* Produits secondaires */}
            <div className="space-y-6">
              <div className="relative h-[400px] overflow-hidden rounded-lg group cursor-pointer">
                <Image
                  src="/images/melf.jpg"
                  alt="Melhfa Élégance"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-light mb-2 tracking-wide">Melhfa Élégance</h3>
                  <p className="text-sm opacity-90 mb-3">Design moderne pour femme active</p>
                  <div className="text-lg font-medium">32.000 MRU</div>
                </div>
              </div>

              <div className="relative h-[400px] overflow-hidden rounded-lg group cursor-pointer">
                <Image
                  src="/images/melf3.jpg"
                  alt="Melhfa Océan"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 right-6">
                  <Badge className="bg-red-500 text-white">-15%</Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-xl font-light mb-2 tracking-wide">Melhfa Océan</h3>
                  <p className="text-sm opacity-90 mb-3">Nuances bleues inspirées de l&apos;Atlantique</p>
                  <div className="text-lg font-medium">
                    29.000 MRU{" "}
                    <span className="text-sm line-through opacity-70">34.000 MRU</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Products */}
      <section className="py-20">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl font-light mb-4 tracking-wide">Nouvelle Collection</h2>
              <p className="text-gray-600">Les dernières créations de nos artisans</p>
            </div>
            <Button variant="outline" className="hidden md:flex" asChild>
              <Link href="/boutique">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {newArrivals.success && newArrivals.data.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="animate-fade-in-up"
                />
              ))}
            </div>
          </Suspense>

          <div className="text-center mt-12 md:hidden">
            <Button variant="outline" asChild>
              <Link href="/boutique">
                Voir tout
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Truck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Livraison gratuite</h3>
              <p className="text-sm text-gray-600">À partir de 50.000 MRU dans tout Nouakchott</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Garantie qualité</h3>
              <p className="text-sm text-gray-600">Retour gratuit sous 30 jours</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Fait main</h3>
              <p className="text-sm text-gray-600">Chaque melhfa est unique et artisanale</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </main>
  );
}

// Composant de skeleton pour le chargement
function ProductGridSkeleton(): JSX.Element {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}