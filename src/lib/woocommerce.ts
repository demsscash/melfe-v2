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

// Fonctions utilitaires pour obtenir le hex d'une couleur
export const getColorHex = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
        'blanc': '#FFFFFF',
        'blanc-casse': '#F8F8FF',
        'blanc cassé': '#F8F8FF',
        'beige': '#F5F5DC',
        'crème': '#FFFDD0',
        'ivoire': '#FFFFF0',
        'noir': '#000000',
        'gris': '#808080',
        'bleu': '#0000FF',
        'bleu-marine': '#000080',
        'bleu marine': '#000080',
        'rouge': '#FF0000',
        'bordeaux': '#800020',
        'rose': '#FFC0CB',
        'vert': '#008000',
        'jaune': '#FFFF00',
        'orange': '#FFA500',
        'violet': '#800080',
        'marron': '#A52A2A',
        'dore': '#FFD700',
        'doré': '#FFD700',
        'argente': '#C0C0C0',
        'argenté': '#C0C0C0',
        'multicolore': '#FF6B6B'
    };

    return colorMap[colorName.toLowerCase()] || '#CCCCCC';
};

// ✅ INTERFACE CORRECTE pour les paramètres WooCommerce
interface BasicProductParams {
    page?: number;
    per_page?: number;
    category?: number | string; // ✅ Peut être ID (number) ou slug (string)
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
    on_sale?: boolean;
    featured?: boolean;
    status?: string;
    exclude?: number[];
}

// ✅ Interface pour les catégories WooCommerce
export interface WooCommerceCategory {
    id: number;
    name: string;
    slug: string;
    parent: number;
    description: string;
    display: string;
    image: any;
    menu_order: number;
    count: number;
}

// Service WooCommerce
export class WooCommerceService {

    // ✅ MÉTHODE PRINCIPALE GETPRODUCTS - Corrigée pour les catégories
    static async getProducts(params?: BasicProductParams): Promise<ApiResponse<WooCommerceProduct[]>> {
        try {
            const defaultParams: BasicProductParams = {
                page: 1,
                per_page: 20,
                status: 'publish',
                ...params
            };

            // ✅ CONVERSION IMPORTANTE : Si category est un slug, on le convertit en ID
            if (defaultParams.category && typeof defaultParams.category === 'string') {
                console.log('🔍 Recherche catégorie par slug:', defaultParams.category);

                const categoryId = await this.getCategoryIdBySlug(defaultParams.category);
                if (categoryId) {
                    console.log('✅ Catégorie trouvée, ID:', categoryId);
                    defaultParams.category = categoryId;
                } else {
                    console.warn('⚠️ Catégorie non trouvée:', defaultParams.category);
                    // On garde le slug au cas où ça marcherait
                }
            }

            console.log('📤 Paramètres finaux envoyés à WooCommerce:');
            console.table(defaultParams);

            const response = await api.get("products", defaultParams);

            console.log(`✅ ${response.data.length} produits reçus`);

            // Afficher les catégories du premier produit pour debug
            if (response.data.length > 0 && response.data[0].categories) {
                console.log('📂 Catégories du premier produit:', response.data[0].categories);
            }

            return {
                data: response.data as WooCommerceProduct[],
                success: true,
            };

        } catch (error: any) {
            console.error("❌ ERREUR getProducts:", error);

            if (error.response) {
                console.error("❌ Status HTTP:", error.response.status);
                console.error("❌ Data:", error.response.data);
            }

            return {
                data: [],
                success: false,
                message: `Erreur API: ${error.response?.status || 'Inconnue'} - ${error.response?.data?.message || error.message}`
            };
        }
    }

    // ✅ NOUVELLE MÉTHODE : Récupérer l'ID d'une catégorie par son slug
    static async getCategoryIdBySlug(slug: string): Promise<number | null> {
        try {
            const categories = await this.getCategories();
            if (categories.success && categories.data) {
                const category = categories.data.find(cat => cat.slug === slug);
                return category ? category.id : null;
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur getCategoryIdBySlug:', error);
            return null;
        }
    }

    // ✅ NOUVELLE MÉTHODE : Récupérer une catégorie par son ID
    static async getCategoryById(id: number): Promise<WooCommerceCategory | null> {
        try {
            const categories = await this.getCategories();
            if (categories.success && categories.data) {
                return categories.data.find(cat => cat.id === id) || null;
            }
            return null;
        } catch (error) {
            console.error('❌ Erreur getCategoryById:', error);
            return null;
        }
    }

    // ✅ RÉCUPÉRER LES CATÉGORIES - Version améliorée
    static async getCategories(): Promise<ApiResponse<WooCommerceCategory[]>> {
        try {
            console.log('📂 Récupération des catégories WooCommerce...');

            const response = await api.get("products/categories", {
                per_page: 100,
                hide_empty: true,
                orderby: 'count',
                order: 'desc'
            });

            console.log(`✅ ${response.data.length} catégories trouvées:`);

            // Afficher les catégories pour debug
            response.data.forEach((cat: WooCommerceCategory) => {
                console.log(`- ${cat.name} (${cat.slug}) - ID: ${cat.id} - Produits: ${cat.count}`);
            });

            return {
                data: response.data as WooCommerceCategory[],
                success: true,
            };
        } catch (error: any) {
            console.error("❌ Erreur getCategories:", error);

            return {
                data: [],
                success: false,
                message: "Erreur lors de la récupération des catégories"
            };
        }
    }

    // ✅ MÉTHODE SPÉCIALISÉE : Récupérer produits par catégorie (avec ID)
    static async getProductsByCategory(categoryId: number, limit: number = 20): Promise<ApiResponse<WooCommerceProduct[]>> {
        console.log(`🏷️ Récupération produits catégorie ID: ${categoryId}`);

        return this.getProducts({
            category: categoryId,
            per_page: limit,
            orderby: 'date',
            order: 'desc'
        });
    }

    // ✅ MÉTHODE SPÉCIALISÉE : Récupérer produits par slug de catégorie
    static async getProductsByCategorySlug(categorySlug: string, limit: number = 20): Promise<ApiResponse<WooCommerceProduct[]>> {
        console.log(`🏷️ Récupération produits catégorie slug: ${categorySlug}`);

        return this.getProducts({
            category: categorySlug, // La méthode getProducts convertira automatiquement
            per_page: limit,
            orderby: 'date',
            order: 'desc'
        });
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

    // Rechercher des produits
    static async searchProducts(query: string, limit: number = 20): Promise<ApiResponse<WooCommerceProduct[]>> {
        return this.getProducts({
            search: query,
            per_page: limit
        });
    }

    // ✅ TEST CONNEXION avec test des catégories
    static async testBasicConnection(): Promise<ApiResponse<any>> {
        try {
            console.log('🔍 TEST CONNEXION WOOCOMMERCE + CATÉGORIES');
            console.log('🔗 URL:', process.env.NEXT_PUBLIC_WC_API_URL);

            // Test 1: Un produit
            const productsTest = await api.get("products", { per_page: 1 });
            console.log('✅ Test produits OK:', productsTest.data.length);

            // Test 2: Catégories
            const categoriesTest = await api.get("products/categories", { per_page: 5 });
            console.log('✅ Test catégories OK:', categoriesTest.data.length);

            if (categoriesTest.data.length > 0) {
                console.log('📂 Première catégorie:', categoriesTest.data[0]);
            }

            return {
                data: {
                    status: 'success',
                    productsCount: productsTest.data.length,
                    categoriesCount: categoriesTest.data.length,
                    firstCategory: categoriesTest.data[0]?.name || 'Aucune'
                },
                success: true,
            };

        } catch (error: any) {
            console.error('❌ TEST CONNEXION ÉCHOUÉ:', error);

            return {
                data: {
                    status: 'error',
                    error: error.message,
                    details: error.response?.data
                },
                success: false,
                message: `Connexion échouée: ${error.message}`
            };
        }
    }
}