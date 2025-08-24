// src/app/boutique/page.tsx

import { Suspense } from 'react';
import { Metadata } from 'next';
import { WooCommerceService } from '@/lib/woocommerce';
import ProductGrid from '@/components/product/ProductGrid';
import ProductFilters from '@/components/product/ProductFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';

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
    };
}

export default async function BoutiquePage({
    searchParams
}: BoutiquePageProps): Promise<JSX.Element> {
    const page = Number(searchParams.page) || 1;
    const category = searchParams.category;
    const filter = searchParams.filter;
    const sort = searchParams.sort;
    const search = searchParams.search;

    // Construire les paramètres pour l'API WooCommerce
    const apiParams: any = {
        page,
        per_page: 20,
    };

    if (category) apiParams.category = category;
    if (search) apiParams.search = search;
    if (filter === 'sale') apiParams.on_sale = true;
    if (filter === 'featured') apiParams.featured = true;
    if (filter === 'new') {
        apiParams.orderby = 'date';
        apiParams.order = 'desc';
    }

    switch (sort) {
        case 'price-asc':
            apiParams.orderby = 'price';
            apiParams.order = 'asc';
            break;
        case 'price-desc':
            apiParams.orderby = 'price';
            apiParams.order = 'desc';
            break;
        case 'name-asc':
            apiParams.orderby = 'title';
            apiParams.order = 'asc';
            break;
        case 'name-desc':
            apiParams.orderby = 'title';
            apiParams.order = 'desc';
            break;
        default:
            apiParams.orderby = 'date';
            apiParams.order = 'desc';
    }

    // Récupérer les produits et catégories
    const [productsResponse, categoriesResponse] = await Promise.all([
        WooCommerceService.getProducts(apiParams),
        WooCommerceService.getCategories(),
    ]);

    const products = productsResponse.data || [];
    const categories = categoriesResponse.data || [];

    return (
        <div className="min-h-screen bg-white">
            {/* Header de la page */}
            <div className="bg-gray-50 py-16 mt-16">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-light tracking-wide text-black">
                            {filter === 'sale' && 'Promotions'}
                            {filter === 'featured' && 'Produits Vedettes'}
                            {filter === 'new' && 'Nouvelles Arrivées'}
                            {category && `Catégorie: ${category}`}
                            {search && `Résultats pour: "${search}"`}
                            {!filter && !category && !search && 'Boutique'}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {filter === 'sale' && 'Profitez de nos offres exceptionnelles sur une sélection de melhfa premium'}
                            {filter === 'featured' && 'Découvrez nos créations d\'exception, sélectionnées par nos artisans'}
                            {filter === 'new' && 'Les dernières créations de nos ateliers mauritaniens'}
                            {!filter && !category && !search && 'Découvrez notre collection complète de melhfa mauritaniennes, alliant tradition et modernité'}
                        </p>
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
                                    currentCategory={category}
                                    currentFilter={filter}
                                    currentSort={sort}
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
                            </div>

                            <div className="flex items-center gap-4">
                                {/* View Toggle */}
                                <Tabs defaultValue="grid" className="hidden sm:block">
                                    <TabsList className="grid w-fit grid-cols-2">
                                        <TabsTrigger value="grid" className="px-3">
                                            <Grid3X3 className="w-4 h-4" />
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

                        {/* Products Grid */}
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid
                                products={products}
                                currentPage={page}
                                hasMore={products.length === 20} // Supposer qu'il y a plus si on a 20 produits
                            />
                        </Suspense>

                        {/* Pagination */}
                        {products.length === 20 && (
                            <div className="flex justify-center mt-12">
                                <Button
                                    variant="outline"
                                    className="px-8"
                                    asChild
                                >
                                    <a href={`/boutique?${new URLSearchParams({
                                        ...searchParams,
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

// Composants de skeleton pour le chargement
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
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
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