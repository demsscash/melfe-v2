// src/app/boutique/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import { WooCommerceService, WooCommerceCategory } from '@/lib/woocommerce';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Boutique - Collection complète de Melhfa',
    description: 'Découvrez notre collection complète de melhfa mauritaniennes. Voiles traditionnels et modernes, accessoires premium et créations artisanales.',
    openGraph: {
        title: 'Boutique MELHFA - Collection complète',
        description: 'Découvrez notre collection complète de melhfa mauritaniennes.',
        images: ['/images/boutique-og.jpg'],
    },
};

interface BoutiquePageProps {
    searchParams: {
        page?: string;
        category?: string;
        filter?: string;
        sort?: string;
        search?: string;
        // ✅ AJOUT : Paramètres prix
        price_min?: string;
        price_max?: string;
    };
}

export default async function BoutiquePage({
    searchParams
}: BoutiquePageProps): Promise<JSX.Element> {
    const page = Number(searchParams.page) || 1;
    const categorySlug = searchParams.category; // ✅ Récupéré depuis l'URL
    const filter = searchParams.filter;
    const sort = searchParams.sort;
    const search = searchParams.search;

    // ✅ AJOUT : Paramètres prix
    const priceMin = searchParams.price_min ? Number(searchParams.price_min) : undefined;
    const priceMax = searchParams.price_max ? Number(searchParams.price_max) : undefined;

    console.log('🔍 BoutiquePage - Paramètres reçus:', {
        page,
        categorySlug,
        filter,
        sort,
        search,
        priceMin,
        priceMax
    });

    // ✅ CONSTRUCTION DES PARAMÈTRES API CORRECTE
    const apiParams: any = {
        page,
        per_page: 20,
    };

    // ✅ CATÉGORIE : Passer le slug, la conversion ID se fera automatiquement
    if (categorySlug) {
        apiParams.category = categorySlug;
        console.log('🏷️ Filtre catégorie slug:', categorySlug);
    }

    // Recherche textuelle
    if (search) {
        apiParams.search = search;
        console.log('🔍 Recherche:', search);
    }

    // ✅ AJOUT : Filtres prix
    if (priceMin !== undefined && priceMin > 0) {
        apiParams.min_price = priceMin;
        console.log('💰 Prix minimum:', priceMin);
    }
    if (priceMax !== undefined && priceMax < 100000) {
        apiParams.max_price = priceMax;
        console.log('💰 Prix maximum:', priceMax);
    }

    // Filtres spéciaux
    if (filter === 'sale') {
        apiParams.on_sale = true;
        console.log('🏷️ Filtre promotion activé');
    }
    if (filter === 'featured') {
        apiParams.featured = true;
        console.log('⭐ Filtre vedettes activé');
    }
    if (filter === 'new') {
        apiParams.orderby = 'date';
        apiParams.order = 'desc';
        console.log('🆕 Filtre nouveautés activé');
    }

    // ✅ TRI AMÉLIORÉ
    switch (sort) {
        case 'price-asc':
            apiParams.orderby = 'price';
            apiParams.order = 'asc';
            console.log('📊 Tri: Prix croissant');
            break;
        case 'price-desc':
            apiParams.orderby = 'price';
            apiParams.order = 'desc';
            console.log('📊 Tri: Prix décroissant');
            break;
        case 'name-asc':
            apiParams.orderby = 'title';
            apiParams.order = 'asc';
            console.log('📊 Tri: Nom A-Z');
            break;
        case 'name-desc':
            apiParams.orderby = 'title';
            apiParams.order = 'desc';
            console.log('📊 Tri: Nom Z-A');
            break;
        case 'date-desc':
        default:
            apiParams.orderby = 'date';
            apiParams.order = 'desc';
            console.log('📊 Tri: Plus récent');
    }

    console.log('📤 Paramètres finaux pour API:', apiParams);

    // ✅ RÉCUPÉRATION DES DONNÉES AVEC GESTION D'ERREUR
    let products: any[] = [];
    let categories: WooCommerceCategory[] = [];
    let selectedCategory: WooCommerceCategory | null = null;
    let hasError = false;
    let errorMessage = '';

    try {
        console.log('🚀 Début récupération données...');

        // Récupérer en parallèle produits et catégories
        const [productsResponse, categoriesResponse] = await Promise.all([
            WooCommerceService.getProducts(apiParams),
            WooCommerceService.getCategories(),
        ]);

        // ✅ TRAITEMENT DES RÉSULTATS
        products = productsResponse.data || [];
        categories = categoriesResponse.data || [];

        // ✅ RÉCUPÉRER LA CATÉGORIE SÉLECTIONNÉE pour l'affichage
        if (categorySlug && categories.length > 0) {
            selectedCategory = categories.find(cat => cat.slug === categorySlug) || null;
            console.log('🏷️ Catégorie sélectionnée:', selectedCategory?.name);
        }

        // Vérifier les erreurs
        if (!productsResponse.success) {
            console.warn('⚠️ Erreur produits:', productsResponse.message);
            hasError = true;
            errorMessage = productsResponse.message || 'Erreur lors du chargement des produits';
        }

        console.log(`✅ Récupération terminée:`);
        console.log(`   - ${products.length} produits`);
        console.log(`   - ${categories.length} catégories`);

        // Debug: Afficher quelques infos sur les produits
        if (products.length > 0) {
            const firstProduct = products[0];
            console.log('📦 Premier produit:', {
                name: firstProduct.name,
                categories: firstProduct.categories?.map((c: any) => c.name) || []
            });
        }

    } catch (error: any) {
        console.error('❌ Erreur complète dans BoutiquePage:', error);
        hasError = true;
        errorMessage = error.message || 'Erreur inconnue';
        products = [];
        categories = [];
    }

    // ✅ TITRE DYNAMIQUE basé sur la catégorie sélectionnée
    const getPageTitle = () => {
        if (filter === 'sale') return 'Promotions';
        if (filter === 'featured') return 'Produits Vedettes';
        if (filter === 'new') return 'Nouvelles Arrivées';
        if (selectedCategory) return selectedCategory.name;
        if (search) return `Résultats pour: "${search}"`;
        return 'Boutique';
    };

    const getPageDescription = () => {
        if (filter === 'sale') return 'Profitez de nos offres exceptionnelles sur une sélection de melhfa premium';
        if (filter === 'featured') return 'Découvrez nos créations d\'exception, sélectionnées par nos artisans';
        if (filter === 'new') return 'Les dernières créations de nos ateliers mauritaniens';
        if (selectedCategory) return selectedCategory.description || `Découvrez notre collection ${selectedCategory.name.toLowerCase()}`;
        return 'Découvrez notre collection complète de melhfa mauritaniennes, alliant tradition et modernité';
    };

    return (
        <div className="min-h-screen bg-white">
            {/* ✅ AFFICHAGE D'ERREUR SI PROBLÈME */}
            {hasError && (
                <div className="bg-red-50 border border-red-200 p-4 mt-16">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <h2 className="text-red-800 font-semibold mb-2">⚠️ Problème de Connexion</h2>
                        <p className="text-red-600 text-sm">{errorMessage}</p>
                    </div>
                </div>
            )}

            {/* Header de la page */}
            <div className="bg-gray-50 py-16 mt-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black">
                            {getPageTitle()}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {getPageDescription()}
                        </p>

                        {/* ✅ BREADCRUMB avec catégorie */}
                        <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                            <a href="/" className="hover:text-black">Accueil</a>
                            <span>›</span>
                            <a href="/boutique" className="hover:text-black">Boutique</a>
                            {selectedCategory && (
                                <>
                                    <span>›</span>
                                    <span className="text-black font-medium">{selectedCategory.name}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <Suspense fallback={<FiltersSkeleton />}>
                                <ProductFilters
                                    categories={categories}
                                    currentCategory={categorySlug}
                                    currentFilter={filter}
                                    currentSort={sort || 'date-desc'}
                                    // ✅ AJOUT : Props pour filtres prix
                                    currentPriceRange={[priceMin || 0, priceMax || 100000]}
                                />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
                                </span>

                                {/* ✅ Message informatif */}
                                {products.length === 0 && !hasError && (
                                    <span className="text-sm text-orange-600">
                                        - Essayez d'autres filtres
                                    </span>
                                )}

                                {/* ✅ Indicateur de filtre actif */}
                                {selectedCategory && (
                                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                        Catégorie: {selectedCategory.name}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <Tabs defaultValue="grid" className="hidden sm:block">
                                    <TabsList className="grid w-fit grid-cols-2">
                                        <TabsTrigger value="grid" className="px-3">
                                            <LayoutGrid className="w-4 h-4" />
                                        </TabsTrigger>
                                        <TabsTrigger value="list" className="px-3">
                                            <List className="w-4 h-4" />
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                {/* Mobile Filters */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="lg:hidden"
                                >
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    Filtres
                                </Button>
                            </div>
                        </div>

                        {/* ✅ AFFICHAGE DES PRODUITS OU MESSAGE */}
                        {!hasError ? (
                            products.length > 0 ? (
                                <Suspense fallback={<ProductGridSkeleton />}>
                                    <ProductGrid
                                        products={products}
                                        currentPage={page}
                                        hasMore={products.length === 20}
                                    />
                                </Suspense>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                        Aucun produit trouvé
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {selectedCategory
                                            ? `Aucun produit dans la catégorie "${selectedCategory.name}".`
                                            : 'Aucun produit ne correspond à vos critères.'
                                        }
                                    </p>
                                    <Button
                                        onClick={() => window.location.href = '/boutique'}
                                        className="bg-black text-white hover:bg-gray-800"
                                    >
                                        Voir tous les produits
                                    </Button>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                    Problème de connexion
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    Impossible de charger les produits depuis WooCommerce.
                                </p>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    Réessayer
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {products.length === 20 && !hasError && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    variant="outline"
                                    className="px-8"
                                    asChild
                                >
                                    <a href={`/boutique?${new URLSearchParams({
                                        ...Object.fromEntries(
                                            Object.entries(searchParams).filter(([_, v]) => v !== undefined)
                                        ),
                                        page: (page + 1).toString()
                                    }).toString()}`}>
                                        Charger plus de produits
                                    </a>
                                </Button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

// Composants de skeleton
function FiltersSkeleton(): JSX.Element {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-3 bg-gray-200 rounded w-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}

function ProductGridSkeleton(): JSX.Element {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-8 bg-gray-200 rounded w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}