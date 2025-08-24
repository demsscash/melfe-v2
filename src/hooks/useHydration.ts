// src/hooks/useHydration.ts

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook pour gérer l'hydratation et éviter les erreurs de rendu SSR/Client
 * Retourne true seulement après que le composant soit monté côté client
 */
export function useHydration() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return isHydrated;
}

/**
 * Hook pour un rendu conditionnel après hydratation
 * @param fallback - Valeur à retourner avant l'hydratation
 * @param value - Valeur à retourner après l'hydratation
 */
export function useClientOnly<T>(fallback: T, value: T): T {
    const isHydrated = useHydration();
    return isHydrated ? value : fallback;
}