// src/app/auth/register/page.tsx

import { Suspense } from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { MelhfaLoader } from '@/components/ui/MelhfaLoader';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Rejoignez Melhfa Store
                    </h1>
                    <p className="text-gray-600">
                        Créez votre compte pour découvrir nos créations mauritaniennes
                    </p>
                </div>

                <Suspense fallback={
                    <div className="flex justify-center">
                        <MelhfaLoader size="lg" text="Chargement..." color="purple" />
                    </div>
                }>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    );
}