// src/types/auth.ts

export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName: string;
    avatar?: string;
    role: string;
    billing?: {
        first_name: string;
        last_name: string;
        company: string;
        address_1: string;
        address_2: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
        email: string;
        phone: string;
    };
    shipping?: {
        first_name: string;
        last_name: string;
        company: string;
        address_1: string;
        address_2: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
}

export interface AuthResponse {
    success: boolean;
    data?: {
        token: string;
        user: User;
        user_email: string;
        user_nicename: string;
        user_display_name: string;
    };
    message?: string;
    error?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<boolean>;
}

export interface ApiError {
    success: false;
    message: string;
    code?: string;
}