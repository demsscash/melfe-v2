// src/components/auth/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MelhfaInlineLoader } from '@/components/ui/MelhfaLoader';

const loginSchema = z.object({
    username: z.string().min(1, 'Le nom d\'utilisateur est requis'),
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginFormData = {
    username: string;
    password: string;
};

export default function LoginForm() {
    const { login, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const redirectTo = searchParams.get('redirect') || '/account';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);

        try {
            const response = await login(data);

            if (response.success) {
                router.push(redirectTo);
            } else {
                setError(response.message || 'Erreur de connexion');
            }
        } catch (err) {
            setError('Une erreur inattendue s\'est produite');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Connexion</CardTitle>
                <CardDescription className="text-center">
                    Connectez-vous à votre compte pour accéder à votre espace personnel
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="username">Nom d'utilisateur ou Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="Votre nom d'utilisateur ou email"
                                className="pl-10"
                                {...register('username')}
                            />
                        </div>
                        {errors.username && (
                            <p className="text-sm text-red-600">{errors.username.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Votre mot de passe"
                                className="pl-10 pr-10"
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isSubmitting || isLoading}
                    >
                        {(isSubmitting || isLoading) ? (
                            <MelhfaInlineLoader text="Connexion..." size="sm" color="blue" />
                        ) : (
                            'Se connecter'
                        )}
                    </Button>

                    <div className="text-center space-y-2">
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                            Mot de passe oublié ?
                        </Link>
                        <div className="text-sm text-gray-600">
                            Pas encore de compte ?{' '}
                            <Link
                                href={`/auth/register?redirect=${encodeURIComponent(redirectTo)}`}
                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                            >
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}