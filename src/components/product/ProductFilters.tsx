// src/components/product/ProductFilters.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { X, Filter, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WooCommerceCategory } from '@/lib/woocommerce';

// ✅ INTERFACE CORRIGÉE avec vraie structure WooCommerce
interface ProductFiltersProps {
    categories: WooCommerceCategory[];
    currentCategory?: string; // slug de la catégorie
    currentFilter?: string;
    currentSort?: string;
    // ✅ AJOUT : Props pour filtres prix
    currentPriceRange?: number[];
}

const sortOptions = [
    { label: 'Plus récent', value: 'date-desc' },
    { label: 'Prix croissant', value: 'price-asc' },
    { label: 'Prix décroissant', value: 'price-desc' },
    { label: 'Nom A-Z', value: 'name-asc' },
    { label: 'Nom Z-A', value: 'name-desc' },
];

export default function ProductFilters({
    categories,
    currentCategory,
    currentFilter,
    currentSort = 'date-desc',
    // ✅ AJOUT : Props prix avec valeur par défaut
    currentPriceRange = [0, 100000]
}: ProductFiltersProps): JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();

    // ✅ ÉTAT LOCAL pour les catégories sélectionnées (utilise les slugs)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        currentCategory ? [currentCategory] : []
    );

    // ✅ AJOUT : État pour les prix
    const [priceRange, setPriceRange] = useState<number[]>(currentPriceRange);

    // ✅ Synchroniser avec les props quand elles changent
    useEffect(() => {
        setSelectedCategories(currentCategory ? [currentCategory] : []);
        setPriceRange(currentPriceRange);
    }, [currentCategory, currentPriceRange]);

    const updateFilters = (newParams: Record<string, string | string[] | null>): void => {
        const params = new URLSearchParams();

        // Conserver tous les paramètres existants sauf ceux qu'on modifie
        searchParams.forEach((value, key) => {
            if (!newParams.hasOwnProperty(key)) {
                params.set(key, value);
            }
        });

        // Appliquer les nouveaux paramètres
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.delete(key);
                value.forEach(v => params.append(key, v));
            } else {
                params.set(key, value);
            }
        });

        // Reset page à 1 quand on change les filtres
        params.set('page', '1');

        const newUrl = `/boutique?${params.toString()}`;
        console.log('🔄 Navigation vers:', newUrl);
        router.push(newUrl);
    };

    const handleSortChange = (value: string): void => {
        console.log('📊 Changement tri:', value);
        updateFilters({ sort: value });
    };

    // ✅ GESTION DES CATÉGORIES CORRIGÉE
    const handleCategoryChange = (categorySlug: string, checked: boolean): void => {
        console.log('🏷️ Changement catégorie:', { categorySlug, checked });

        const newCategories = checked
            ? [...selectedCategories, categorySlug]
            : selectedCategories.filter(c => c !== categorySlug);

        console.log('🏷️ Nouvelles catégories sélectionnées:', newCategories);
        setSelectedCategories(newCategories);

        // ✅ IMPORTANT: Pour l'instant on ne supporte qu'une catégorie à la fois
        // donc on passe soit la catégorie sélectionnée, soit null
        const categoryToSet = newCategories.length > 0 ? newCategories[newCategories.length - 1] : null;
        updateFilters({ category: categoryToSet });
    };

    // ✅ AJOUT : Gestion des prix
    const handlePriceChange = (): void => {
        console.log('💰 Application filtre prix:', priceRange);
        updateFilters({
            price_min: priceRange[0] > 0 ? priceRange[0].toString() : null,
            price_max: priceRange[1] < 100000 ? priceRange[1].toString() : null
        });
    };

    const clearAllFilters = (): void => {
        console.log('🧹 Effacement tous filtres');
        setSelectedCategories([]);
        setPriceRange([0, 100000]);
        router.push('/boutique');
    };

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        currentFilter ||
        (currentSort && currentSort !== 'date-desc') ||
        priceRange[0] > 0 ||
        priceRange[1] < 100000;

    // ✅ HELPER: Trouver une catégorie par slug
    const getCategoryBySlug = (slug: string): WooCommerceCategory | undefined => {
        return categories.find(cat => cat.slug === slug);
    };

    return (
        <div className="space-y-6">
            {/* Header avec compteur de filtres actifs */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <h2 className="font-medium text-sm uppercase tracking-wide">
                        Filtres
                        {hasActiveFilters && (
                            <span className="ml-2 bg-black text-white text-xs px-2 py-1 rounded-full">
                                {selectedCategories.length + (currentFilter ? 1 : 0)}
                            </span>
                        )}
                    </h2>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-xs text-gray-500 hover:text-black p-0 h-auto"
                    >
                        <X className="w-3 h-3 mr-1" />
                        Effacer
                    </Button>
                )}
            </div>

            {/* Sort */}
            <div className="space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wide">
                    Trier par
                </Label>
                <Select value={currentSort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un tri" />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Filters Accordion */}
            <Accordion type="multiple" defaultValue={["categories", "quick-filters"]} className="w-full">

                {/* ✅ CATÉGORIES - Version fonctionnelle */}
                {categories.length > 0 && (
                    <AccordionItem value="categories">
                        <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                            <div className="flex items-center gap-2">
                                <Tag className="w-3 h-3" />
                                Catégories ({categories.length})
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 pt-1">
                            {categories.map((category) => (
                                <div key={category.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`category-${category.id}`}
                                        checked={selectedCategories.includes(category.slug)}
                                        onCheckedChange={(checked) =>
                                            handleCategoryChange(category.slug, checked as boolean)
                                        }
                                    />
                                    <Label
                                        htmlFor={`category-${category.id}`}
                                        className="text-sm cursor-pointer flex-1 flex justify-between items-center"
                                    >
                                        <span className="flex-1">{category.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400 text-xs">({category.count})</span>
                                            {selectedCategories.includes(category.slug) && (
                                                <span className="w-2 h-2 bg-black rounded-full"></span>
                                            )}
                                        </div>
                                    </Label>
                                </div>
                            ))}

                            {/* ✅ Affichage de la catégorie actuellement sélectionnée */}
                            {currentCategory && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="text-xs text-gray-500 mb-2">Catégorie active:</div>
                                    <div className="bg-black text-white px-3 py-2 rounded-lg text-sm">
                                        {getCategoryBySlug(currentCategory)?.name || currentCategory}
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* ✅ FILTRES RAPIDES - Ceux qui marchent */}
                <AccordionItem value="quick-filters">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        Filtres rapides
                    </AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-1">
                        <Button
                            variant={currentFilter === 'sale' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => updateFilters({ filter: currentFilter === 'sale' ? null : 'sale' })}
                        >
                            🏷️ En promotion
                            {currentFilter === 'sale' && <span className="ml-auto">✓</span>}
                        </Button>
                        <Button
                            variant={currentFilter === 'featured' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => updateFilters({ filter: currentFilter === 'featured' ? null : 'featured' })}
                        >
                            ⭐ Produits vedettes
                            {currentFilter === 'featured' && <span className="ml-auto">✓</span>}
                        </Button>
                        <Button
                            variant={currentFilter === 'new' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => updateFilters({ filter: currentFilter === 'new' ? null : 'new' })}
                        >
                            🆕 Nouveautés
                            {currentFilter === 'new' && <span className="ml-auto">✓</span>}
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* ✅ COULEURS - Version placeholder pour plus tard */}
                <AccordionItem value="colors">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        <div className="flex items-center justify-between w-full">
                            <span>Couleurs</span>
                            <span className="text-xs text-gray-400">Bientôt</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-1">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-sm text-gray-500 mb-2">🎨 Filtrage par couleur</p>
                            <p className="text-xs text-gray-400">En cours de développement...</p>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* ✅ PRIX - Version fonctionnelle */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        <div className="flex items-center justify-between w-full">
                            <span>Prix (MRU)</span>
                            {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    Actif
                                </span>
                            )}
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-1">
                        {/* Slider de prix */}
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={100000}
                            min={0}
                            step={1000}
                            className="w-full"
                        />

                        {/* Affichage des valeurs */}
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{priceRange[0].toLocaleString()} MRU</span>
                            <span>{priceRange[1].toLocaleString()} MRU</span>
                        </div>

                        {/* Bouton d'application */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handlePriceChange}
                            disabled={priceRange[0] === 0 && priceRange[1] === 100000}
                        >
                            💰 Appliquer prix
                        </Button>

                        {/* Raccourcis prix */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => {
                                    setPriceRange([0, 20000]);
                                    setTimeout(handlePriceChange, 100);
                                }}
                            >
                                &lt; 20k
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => {
                                    setPriceRange([20000, 50000]);
                                    setTimeout(handlePriceChange, 100);
                                }}
                            >
                                20k - 50k
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => {
                                    setPriceRange([50000, 100000]);
                                    setTimeout(handlePriceChange, 100);
                                }}
                            >
                                50k - 100k
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8"
                                onClick={() => {
                                    setPriceRange([0, 100000]);
                                    setTimeout(handlePriceChange, 100);
                                }}
                            >
                                Tous prix
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* ✅ RÉSUMÉ DES FILTRES ACTIFS */}
            {hasActiveFilters && (
                <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Label className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        Filtres actifs
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {selectedCategories.map(categorySlug => {
                            const category = getCategoryBySlug(categorySlug);
                            return (
                                <span key={categorySlug} className="bg-black text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                    {category?.name || categorySlug}
                                    <button
                                        onClick={() => handleCategoryChange(categorySlug, false)}
                                        className="hover:bg-gray-700 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            );
                        })}
                        {currentFilter && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                {currentFilter === 'sale' && '🏷️ Promotion'}
                                {currentFilter === 'featured' && '⭐ Vedette'}
                                {currentFilter === 'new' && '🆕 Nouveauté'}
                                <button
                                    onClick={() => updateFilters({ filter: null })}
                                    className="hover:bg-blue-700 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {/* ✅ AJOUT : Badge prix actif */}
                        {(priceRange[0] > 0 || priceRange[1] < 100000) && (
                            <span className="bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                                💰 {priceRange[0].toLocaleString()}-{priceRange[1].toLocaleString()} MRU
                                <button
                                    onClick={() => {
                                        setPriceRange([0, 100000]);
                                        updateFilters({ price_min: null, price_max: null });
                                    }}
                                    className="hover:bg-green-700 rounded-full p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* ✅ DEBUG INFO - En développement seulement */}
            {process.env.NODE_ENV === 'development' && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        🔍 Debug Info
                    </Label>
                    <div className="text-xs space-y-1 bg-blue-50 p-3 rounded">
                        <p><strong>Catégories disponibles:</strong> {categories.length}</p>
                        <p><strong>Catégorie actuelle:</strong> {currentCategory || 'Aucune'}</p>
                        <p><strong>Filtre actuel:</strong> {currentFilter || 'Aucun'}</p>
                        <p><strong>Tri actuel:</strong> {currentSort}</p>
                        <p><strong>Prix actuel:</strong> {priceRange[0]} - {priceRange[1]} MRU</p>
                        <p><strong>URL actuelle:</strong> {typeof window !== 'undefined' ? window.location.search : ''}</p>
                        {categories.length > 0 && (
                            <details className="mt-2">
                                <summary className="cursor-pointer text-blue-600">Voir toutes les catégories</summary>
                                <div className="mt-2 space-y-1">
                                    {categories.map(cat => (
                                        <div key={cat.id} className="text-xs">
                                            • {cat.name} (slug: {cat.slug}, id: {cat.id}, count: {cat.count})
                                        </div>
                                    ))}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}