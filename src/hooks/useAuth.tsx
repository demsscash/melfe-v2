// src/hooks/useAuth.tsx

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@/lib/auth';
import {
    User,
    AuthContextType,
    LoginCredentials,
    RegisterCredentials,
    AuthResponse
} from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isHydrated, setIsHydrated] = useState(false);

    const isAuthenticated = !!user && !!token;

    // Initialisation : vérifier si l'utilisateur est déjà connecté
    useEffect(() => {
        initializeAuth();
    }, []);

    async function initializeAuth() {
        setIsLoading(true);

        try {
            // Marquer comme hydraté d'abord
            setIsHydrated(true);

            const storedToken = localStorage.getItem('auth_token');
            const storedUser = localStorage.getItem('auth_user');

            if (storedToken && storedUser) {
                // Valider le token
                const isValid = await AuthService.validateToken(storedToken);

                if (isValid) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                } else {
                    // Token expiré, nettoyer le storage
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('auth_user');
                }
            }
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de l\'auth:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(credentials: LoginCredentials): Promise<AuthResponse> {
        setIsLoading(true);

        try {
            const response = await AuthService.login(credentials);

            if (response.success && response.data) {
                const { token: newToken, user: userData } = response.data;

                // Sauvegarder dans le state
                setToken(newToken);
                setUser(userData);

                // Sauvegarder dans localStorage seulement si hydraté
                if (isHydrated) {
                    localStorage.setItem('auth_token', newToken);
                    localStorage.setItem('auth_user', JSON.stringify(userData));
                }

                return response;
            }

            return response;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            return {
                success: false,
                message: 'Erreur de connexion'
            };
        } finally {
            setIsLoading(false);
        }
    }

    async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
        setIsLoading(true);

        try {
            const response = await AuthService.register(credentials);

            if (response.success && response.data) {
                const { token: newToken, user: userData } = response.data;

                // Connexion automatique après inscription
                setToken(newToken);
                setUser(userData);

                if (isHydrated) {
                    localStorage.setItem('auth_token', newToken);
                    localStorage.setItem('auth_user', JSON.stringify(userData));
                }
            }

            return response;
        } catch (error) {
            console.error('Erreur d\'inscription:', error);
            return {
                success: false,
                message: 'Erreur lors de l\'inscription'
            };
        } finally {
            setIsLoading(false);
        }
    }

    function logout() {
        setUser(null);
        setToken(null);

        if (isHydrated) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
        }

        // Optionnel : rediriger vers la page d'accueil
        window.location.href = '/';
    }

    async function updateUser(userData: Partial<User>): Promise<boolean> {
        if (!user || !token) return false;

        try {
            const success = await AuthService.updateUser(user.id, userData, token);

            if (success) {
                // Mettre à jour l'utilisateur dans le state
                const updatedUser = { ...user, ...userData };
                setUser(updatedUser);
                if (isHydrated) {
                    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
                }
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            return false;
        }
    }

    const contextValue: AuthContextType = {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth doit être utilisé dans un AuthProvider');
    }

    return context;
}

// Hook pour protéger les routes
export function useRequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            // Rediriger vers la page de connexion
            window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
    }, [isAuthenticated, isLoading]);

    return { isAuthenticated, isLoading };
}