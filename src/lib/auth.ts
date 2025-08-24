// src/lib/auth.ts

import { api } from './woocommerce';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
    ApiError
} from '@/types/auth';

// Configuration pour l'authentification JWT
const JWT_API_URL = process.env.NEXT_PUBLIC_WC_API_URL;

export class AuthService {

    /**
     * Connexion utilisateur avec JWT - VERSION SIMPLIFIÉE
     */
    static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
            console.log('Tentative de connexion à:', `${JWT_API_URL}/wp-json/jwt-auth/v1/token`);

            const response = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password,
                }),
            });

            const data = await response.json();
            console.log('Réponse complète JWT:', data);

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Erreur de connexion',
                };
            }

            // Créer un utilisateur basique avec les données directement disponibles
            const user: User = {
                id: 0,
                username: credentials.username,
                email: data.user_email || '',
                firstName: '',
                lastName: '',
                displayName: data.user_display_name || data.user_nicename || credentials.username,
                role: 'customer',
            };

            console.log('✅ Connexion réussie ! Token reçu:', data.token ? 'Oui' : 'Non');

            return {
                success: true,
                data: {
                    token: data.token,
                    user: user,
                    user_email: data.user_email || '',
                    user_nicename: data.user_nicename || '',
                    user_display_name: data.user_display_name || '',
                },
            };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            return {
                success: false,
                message: 'Erreur de connexion au serveur',
            };
        }
    }

    /**
     * Inscription d'un nouvel utilisateur
     */
    static async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        try {
            console.log('Tentative de création de compte...');

            // Créer le compte utilisateur via WooCommerce REST API
            const customerData = {
                username: credentials.username,
                email: credentials.email,
                password: credentials.password,
                first_name: credentials.firstName || '',
                last_name: credentials.lastName || '',
            };

            const response = await api.post('customers', customerData);
            console.log('Réponse création client:', response.data);

            if (response.data) {
                // Connexion automatique après inscription
                return await this.login({
                    username: credentials.username,
                    password: credentials.password,
                });
            }

            return {
                success: false,
                message: 'Erreur lors de la création du compte',
            };
        } catch (error: any) {
            console.error('Erreur lors de l\'inscription:', error);

            // Gestion des erreurs spécifiques WooCommerce
            if (error.response?.data?.message) {
                return {
                    success: false,
                    message: error.response.data.message,
                };
            }

            return {
                success: false,
                message: 'Erreur lors de la création du compte',
            };
        }
    }

    /**
     * Récupérer les informations complètes de l'utilisateur - VERSION SIMPLIFIÉE
     */
    static async getUserInfo(token: string): Promise<User> {
        // Pour l'instant, retournons un utilisateur basique
        // On implémentera la récupération complète plus tard
        return {
            id: 0,
            username: 'utilisateur',
            email: '',
            firstName: '',
            lastName: '',
            displayName: 'Utilisateur connecté',
            role: 'customer',
        };
    }

    /**
     * Mettre à jour les informations utilisateur
     */
    static async updateUser(userId: number, userData: Partial<User>, token: string): Promise<boolean> {
        try {
            const updateData: any = {};

            if (userData.firstName) updateData.first_name = userData.firstName;
            if (userData.lastName) updateData.last_name = userData.lastName;
            if (userData.email) updateData.email = userData.email;
            if (userData.billing) updateData.billing = userData.billing;
            if (userData.shipping) updateData.shipping = userData.shipping;

            const response = await api.put(`customers/${userId}`, updateData);

            return response.data ? true : false;
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            return false;
        }
    }

    /**
     * Valider un token JWT - VERSION SIMPLIFIÉE
     */
    static async validateToken(token: string): Promise<boolean> {
        try {
            const response = await fetch(`${JWT_API_URL}/wp-json/jwt-auth/v1/token/validate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log('Validation token:', response.ok);
            return response.ok;
        } catch (error) {
            console.log('Erreur validation token:', error);
            return false;
        }
    }

    /**
     * Rafraîchir un token JWT (non implémenté dans le plugin standard)
     */
    static async refreshToken(token: string): Promise<string | null> {
        return null;
    }

    /**
     * Récupérer les commandes de l'utilisateur
     */
    static async getUserOrders(userId: number): Promise<any[]> {
        try {
            const response = await api.get('orders', { customer: userId });
            return response.data || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des commandes:', error);
            return [];
        }
    }
}