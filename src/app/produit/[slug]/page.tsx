// src/app/produit/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { WooCommerceService } from '@/lib/woocommerce';
import { WooCommerceProduct } from '@/types/woocommerce';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { formatPrice, isOnSale } from '@/lib/woocommerce';

interface ProductPageProps {
    params: Promise<{ slug: string }>;
}

// Génération des métadonnées SEO dynamiques
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params;
    const productResponse = await WooCommerceService.getProductBySlug(slug);

    if (!productResponse.success || !productResponse.data) {
        return {
            title: 'Produit non trouvé - Melhfa E-commerce',
        };
    }

    const product = productResponse.data;

    return {
        title: `${product.name} - Melhfa E-commerce`,
        description: product.short_description || product.description?.substring(0, 160),
        keywords: [
            product.name,
            'melhfa',
            'voile mauritanienne',
            ...(product.categories?.map(cat => cat.name) || [])
        ].join(', '),
        openGraph: {
            title: product.name,
            description: product.short_description,
            images: product.images?.map(img => ({
                url: img.src,
                width: img.width || 800,
                height: img.height || 600,
                alt: img.alt || product.name,
            })) || [],
        },
        alternates: {
            canonical: `/produit/${product.slug}`,
        },
    };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
    const { slug } = await params;

    // Récupérer le produit
    const productResponse = await WooCommerceService.getProductBySlug(slug);

    if (!productResponse.success || !productResponse.data) {
        notFound();
    }

    const product = productResponse.data;

    // Récupérer les produits similaires (même catégorie)
    const relatedProductsResponse = product.categories.length > 0
        ? await WooCommerceService.getProducts({
            category: product.categories[0].id,
            per_page: 4,
            exclude: [product.id],
        })
        : { data: [], success: true };

    const relatedProducts = relatedProductsResponse.data || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumbs */}
            <nav className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2 py-4 text-sm">
                        <Link
                            href="/"
                            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <Home className="w-4 h-4 mr-1" />
                            Accueil
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link
                            href="/boutique"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Boutique
                        </Link>
                        {product.categories.length > 0 && (
                            <>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                <Link
                                    href={`/boutique?category=${product.categories[0].slug}`}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    {product.categories[0].name}
                                </Link>
                            </>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium truncate max-w-xs">
                            {product.name}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Bouton retour mobile */}
            <div className="lg:hidden bg-white border-b px-4 py-3">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="text-gray-600 hover:text-gray-900"
                >
                    <Link href="/boutique">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à la boutique
                    </Link>
                </Button>
            </div>

            {/* Contenu principal du produit */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* Galerie d'images */}
                    <div className="space-y-4">
                        <ProductGallery
                            images={product.images || []}
                            productName={product.name}
                        />

                        {/* Badges produit */}
                        <div className="flex flex-wrap gap-2">
                            {isOnSale(product) && (
                                <Badge variant="destructive" className="text-xs">
                                    🏷️ En promotion
                                </Badge>
                            )}
                            {product.featured && (
                                <Badge variant="secondary" className="text-xs">
                                    ⭐ Produit vedette
                                </Badge>
                            )}
                            {product.manage_stock && product.stock_quantity! <= 5 && product.stock_quantity! > 0 && (
                                <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                                    ⚠️ Stock limité ({product.stock_quantity})
                                </Badge>
                            )}
                            {product.stock_status === 'outofstock' && (
                                <Badge variant="destructive" className="text-xs">
                                    ❌ Rupture de stock
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Informations produit */}
                    <div className="space-y-6">
                        <ProductInfo product={product} />

                        {/* Informations supplémentaires */}
                        <div className="space-y-4 pt-6 border-t">
                            <h3 className="text-lg font-medium text-gray-900">
                                Informations produit
                            </h3>

                            {/* SKU */}
                            {product.sku && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Référence :</span>
                                    <span className="font-mono text-gray-900">{product.sku}</span>
                                </div>
                            )}

                            {/* Dimensions */}
                            {(product.dimensions?.length || product.dimensions?.width || product.dimensions?.height) && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Dimensions :</span>
                                    <span className="text-gray-900">
                                        {[
                                            product.dimensions.length && `L: ${product.dimensions.length}cm`,
                                            product.dimensions.width && `l: ${product.dimensions.width}cm`,
                                            product.dimensions.height && `H: ${product.dimensions.height}cm`
                                        ].filter(Boolean).join(' × ')}
                                    </span>
                                </div>
                            )}

                            {/* Poids */}
                            {product.weight && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Poids :</span>
                                    <span className="text-gray-900">{product.weight}g</span>
                                </div>
                            )}

                            {/* Attributs */}
                            {product.attributes && product.attributes.length > 0 && (
                                <div className="space-y-2">
                                    {product.attributes.map((attribute, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span className="text-gray-600 capitalize">
                                                {attribute.name} :
                                            </span>
                                            <span className="text-gray-900">
                                                {attribute.options.join(', ')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Politique de retour */}
                        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                            <h4 className="font-medium text-gray-900 mb-2">
                                Politique de retour
                            </h4>
                            <p>
                                Retour gratuit sous 30 jours. Produit dans son état d'origine avec étiquettes.
                                Frais de retour à votre charge.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description détaillée */}
                {product.description && (
                    <div className="mt-16">
                        <Separator className="mb-8" />
                        <div className="prose prose-gray max-w-none">
                            <h2 className="text-2xl font-light mb-6">Description détaillée</h2>
                            <div
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: product.description }}
                            />
                        </div>
                    </div>
                )}

                {/* Produits similaires */}
                {relatedProducts.length > 0 && (
                    <div className="mt-16">
                        <Separator className="mb-8" />
                        <RelatedProducts
                            products={relatedProducts}
                            currentProductId={product.id}
                        />
                    </div>
                )}


            </main>

            {/* Espacement pour le bouton fixe mobile */}
            <div className="lg:hidden h-24" />
        </div>
    );
}