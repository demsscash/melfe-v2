// src/app/produit/[slug]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WooCommerceService, formatPrice, isOnSale, getDiscountPercentage } from '@/lib/woocommerce';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';
import ProductTabs from '@/components/product/ProductTabs';
import Breadcrumb from '@/components/ui/breadcrumb';

interface ProductPageProps {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const response = await WooCommerceService.getProductBySlug(params.slug);

    if (!response.success || !response.data) {
        return {
            title: 'Produit non trouvé',
        };
    }

    const product = response.data;
    const discountPercentage = getDiscountPercentage(product);

    return {
        title: `${product.name} - MELHFA`,
        description: product.short_description || product.description,
        openGraph: {
            title: product.name,
            description: product.short_description || product.description,
            images: product.images.map(img => ({
                url: img.src,
                width: 800,
                height: 1200,
                alt: img.alt || product.name,
            })),
            type: 'product',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: product.short_description || product.description,
            images: [product.images[0]?.src || ''],
        },
        alternates: {
            canonical: `/produit/${product.slug}`,
        },
        other: {
            'product:price:amount': product.price,
            'product:price:currency': 'MRU',
            'product:availability': product.stock_status === 'instock' ? 'in stock' : 'out of stock',
            'product:condition': 'new',
            ...(isOnSale(product) && {
                'product:sale_price:amount': product.sale_price,
                'product:sale_price:currency': 'MRU',
            }),
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps): Promise<JSX.Element> {
    // Récupérer le produit
    const response = await WooCommerceService.getProductBySlug(params.slug);

    if (!response.success || !response.data) {
        notFound();
    }

    const product = response.data;

    // Récupérer les produits liés
    const relatedProductsResponse = await WooCommerceService.getProducts({
        per_page: 4,
        exclude: [product.id],
        category: product.categories[0]?.slug,
    });

    const relatedProducts = relatedProductsResponse.data || [];

    // Breadcrumb items
    const breadcrumbItems = [
        { label: 'Accueil', href: '/' },
        { label: 'Boutique', href: '/boutique' },
        ...(product.categories.length > 0 ? [{
            label: product.categories[0].name,
            href: `/boutique?category=${product.categories[0].slug}`
        }] : []),
        { label: product.name, href: `/produit/${product.slug}` },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-6 pt-20 pb-6">
                <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Product Details */}
            <div className="max-w-[1400px] mx-auto px-6 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <ProductImageGallery
                            images={product.images}
                            productName={product.name}
                            isOnSale={isOnSale(product)}
                            discountPercentage={getDiscountPercentage(product)}
                            isFeatured={product.featured}
                        />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <ProductInfo product={product} />
                    </div>
                </div>
            </div>

            {/* Product Tabs */}
            <div className="max-w-[1400px] mx-auto px-6 pb-16">
                <ProductTabs product={product} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="bg-gray-50 py-16">
                    <div className="max-w-[1400px] mx-auto px-6">
                        <RelatedProducts products={relatedProducts} />
                    </div>
                </div>
            )}

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'Product',
                        name: product.name,
                        description: product.description,
                        image: product.images.map(img => img.src),
                        sku: product.sku,
                        mpn: product.sku,
                        brand: {
                            '@type': 'Brand',
                            name: 'MELHFA'
                        },
                        offers: {
                            '@type': 'Offer',
                            price: product.price,
                            priceCurrency: 'MRU',
                            availability: product.stock_status === 'instock'
                                ? 'https://schema.org/InStock'
                                : 'https://schema.org/OutOfStock',
                            url: `${process.env.NEXT_PUBLIC_SITE_URL}/produit/${product.slug}`,
                            seller: {
                                '@type': 'Organization',
                                name: 'MELHFA'
                            },
                            ...(isOnSale(product) && {
                                priceValidUntil: product.date_on_sale_to || '2024-12-31'
                            })
                        },
                        aggregateRating: product.rating_count > 0 ? {
                            '@type': 'AggregateRating',
                            ratingValue: product.average_rating,
                            reviewCount: product.rating_count
                        } : undefined,
                        category: product.categories.map(cat => cat.name).join(', '),
                    })
                }}
            />
        </div>
    );
}