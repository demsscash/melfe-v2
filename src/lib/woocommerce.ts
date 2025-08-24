// src/lib/woocommerce.ts

// @ts-ignore
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { WooCommerceProduct, ApiResponse } from "@/types/woocommerce";

// Configuration de l'API WooCommerce
export const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WC_API_URL || "",
    consumerKey: process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "",
    consumerSecret: process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "",
    version: "wc/v3",
    queryStringAuth: true,
});

// Fonctions utilitaires pour les prix
export const formatPrice = (price: string | number, currency: string = 'MRU'): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numPrice) || numPrice === null || numPrice === undefined) {
        return '0 MRU';
    }
    
    return `${numPrice.toLocaleString('fr-FR')} ${currency}`;
};

// Vérifier si un produit est en promotion
export const isOnSale = (product: WooCommerceProduct): boolean => {
    return product.on_sale && product.sale_price !== '';
};

// Calculer le pourcentage de réduction
export const getDiscountPercentage = (product: WooCommerceProduct): number => {
    if (!isOnSale(product)) return 0;

    const regularPrice = parseFloat(product.regular_price);
    const salePrice = parseFloat(product.sale_price);

    if (isNaN(regularPrice) || isNaN(salePrice) || regularPrice === 0) return 0;

    return Math.round(((regularPrice - salePrice) / regularPrice) * 100);
};

// Obtenir la première image d'un produit
export const getProductImage = (product: WooCommerceProduct): string => {
    return product.images && product.images.length > 0 ? product.images[0]!.src : '/placeholder-product.jpg';
};

// Obtenir toutes les images d'un produit
export const getProductImages = (product: WooCommerceProduct): string[] => {
    return product.images ? product.images.map(image => image.src) : [];
};

// Fonctions utilitaires pour obtenir le hex d'une couleur (pour ProductCard)
export const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'blanc': '#FFFFFF',
        'blanc cassé': '#F8F8FF',
        'beige': '#F5F5DC',
        'crème': '#FFFDD0',
        'ivoire': '#FFFFF0',
        'noir': '#000000',
        'gris': '#808080',
        'bleu': '#0000FF',
        'bleu marine': '#000080',
        'bleu ciel': '#87CEEB',
        'rouge': '#FF0000',
        'bordeaux': '#800020',
        'rose': '#FFC0CB',
        'vert': '#008000',
        'vert olive': '#808000',
        'jaune': '#FFFF00',
        'orange': '#FFA500',
        'violet': '#800080',
        'marron': '#A52A2A',
        'doré': '#FFD700',
        'argenté': '#C0C0C0',
        'multicolore': '#FF6B6B'
    };

    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
};

// Service WooCommerce
export class WooCommerceService {
    // Récupérer tous les produits
    static async getProducts(params?: {
        page?: number;
        per_page?: number;
        category?: string;
        search?: string;
        orderby?: string;
        order?: 'asc' | 'desc';
        on_sale?: boolean;
        featured?: boolean;
    }): Promise<ApiResponse<WooCommerceProduct[]>> {
        try {
            const defaultParams = {
                page: 1,
                per_page: 20,
                status: 'publish',
                ...params
            };

            const response = await api.get("products", defaultParams);

            return {
                data: response.data as WooCommerceProduct[],
                success: true,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des produits:", error);
            return {
                data: [],
                success: false,
                message: "Erreur lors de la récupération des produits"
            };
        }
    }

    // Récupérer un produit par son slug
    static async getProductBySlug(slug: string): Promise<ApiResponse<WooCommerceProduct | null>> {
        try {
            const response = await api.get("products", { slug, status: 'publish' });
            const products = response.data as WooCommerceProduct[];

            return {
                data: products.length > 0 ? products[0] || null : null,
                success: true,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération du produit:", error);
            return {
                data: null,
                success: false,
                message: "Produit non trouvé"
            };
        }
    }

    // Récupérer un produit par son ID
    static async getProductById(id: number): Promise<ApiResponse<WooCommerceProduct | null>> {
        try {
            const response = await api.get(`products/${id}`);

            return {
                data: response.data as WooCommerceProduct,
                success: true,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération du produit:", error);
            return {
                data: null,
                success: false,
                message: "Produit non trouvé"
            };
        }
    }

    // Récupérer les produits en vedette
    static async getFeaturedProducts(limit: number = 6): Promise<ApiResponse<WooCommerceProduct[]>> {
        return this.getProducts({
            featured: true,
            per_page: limit,
            orderby: 'date',
            order: 'desc'
        });
    }

    // Récupérer les produits en promotion
    static async getSaleProducts(limit: number = 6): Promise<ApiResponse<WooCommerceProduct[]>> {
        return this.getProducts({
            on_sale: true,
            per_page: limit,
            orderby: 'date',
            order: 'desc'
        });
    }

    // Récupérer les nouvelles arrivées
    static async getNewArrivals(limit: number = 8): Promise<ApiResponse<WooCommerceProduct[]>> {
        return this.getProducts({
            per_page: limit,
            orderby: 'date',
            order: 'desc'
        });
    }

    // Récupérer les catégories
    static async getCategories(): Promise<ApiResponse<any[]>> {
        try {
            const response = await api.get("products/categories", {
                per_page: 100,
                hide_empty: true
            });

            return {
                data: response.data,
                success: true,
            };
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories:", error);
            return {
                data: [],
                success: false,
                message: "Erreur lors de la récupération des catégories"
            };
        }
    }

    // Rechercher des produits
    static async searchProducts(query: string, limit: number = 20): Promise<ApiResponse<WooCommerceProduct[]>> {
        return this.getProducts({
            search: query,
            per_page: limit
        });
    }
}