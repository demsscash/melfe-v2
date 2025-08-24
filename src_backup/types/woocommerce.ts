// src/types/woocommerce.ts

export interface WooCommerceImage {
    id: number;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    src: string;
    name: string;
    alt: string;
}

export interface WooCommerceCategory {
    id: number;
    name: string;
    slug: string;
}

export interface WooCommerceAttribute {
    id: number;
    name: string;
    position: number;
    visible: boolean;
    variation: boolean;
    options: string[];
}

export interface WooCommerceDimensions {
    length: string;
    width: string;
    height: string;
}

export interface WooCommerceProduct {
    id: number;
    name: string;
    slug: string;
    permalink: string;
    date_created: string;
    date_created_gmt: string;
    date_modified: string;
    date_modified_gmt: string;
    type: 'simple' | 'grouped' | 'external' | 'variable';
    status: 'draft' | 'pending' | 'private' | 'publish';
    featured: boolean;
    catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
    description: string;
    short_description: string;
    sku: string;
    price: string;
    regular_price: string;
    sale_price: string;
    date_on_sale_from: string | null;
    date_on_sale_from_gmt: string | null;
    date_on_sale_to: string | null;
    date_on_sale_to_gmt: string | null;
    price_html: string;
    on_sale: boolean;
    purchasable: boolean;
    total_sales: number;
    virtual: boolean;
    downloadable: boolean;
    downloads: unknown[];
    download_limit: number;
    download_expiry: number;
    external_url: string;
    button_text: string;
    tax_status: 'taxable' | 'shipping' | 'none';
    tax_class: string;
    manage_stock: boolean;
    stock_quantity: number | null;
    stock_status: 'instock' | 'outofstock' | 'onbackorder';
    backorders: 'no' | 'notify' | 'yes';
    backorders_allowed: boolean;
    backordered: boolean;
    sold_individually: boolean;
    weight: string;
    dimensions: WooCommerceDimensions;
    shipping_required: boolean;
    shipping_taxable: boolean;
    shipping_class: string;
    shipping_class_id: number;
    reviews_allowed: boolean;
    average_rating: string;
    rating_count: number;
    related_ids: number[];
    upsell_ids: number[];
    cross_sell_ids: number[];
    parent_id: number;
    purchase_note: string;
    categories: WooCommerceCategory[];
    tags: unknown[];
    images: WooCommerceImage[];
    attributes: WooCommerceAttribute[];
    default_attributes: unknown[];
    variations: number[];
    grouped_products: number[];
    menu_order: number;
    meta_data: unknown[];
}

export interface CartItem {
    id: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
    total: number;
}

export interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

export interface ProductFilters {
    category?: string;
    priceRange?: {
        min: number;
        max: number;
    };
    colors?: string[];
    sizes?: string[];
    sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'date-desc';
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

// Types pour les couleurs de melhfa
export interface MelhfaColor {
    name: string;
    hex: string;
    slug: string;
}

// Types pour les tailles/types de melhfa
export interface MelhfaSize {
    name: string;
    slug: string;
    description?: string;
}

// Configuration du site
export interface SiteConfig {
    name: string;
    description: string;
    url: string;
    currency: {
        code: string;
        symbol: string;
        position: 'before' | 'after';
    };
    shipping: {
        freeShippingThreshold: number;
        standardRate: number;
    };
}