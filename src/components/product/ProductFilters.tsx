// src/components/product/ProductFilters.tsx

'use client';

import { useState } from 'react';
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
import { X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
}

interface ProductFiltersProps {
    categories: Category[];
    currentCategory?: string;
    currentFilter?: string;
    currentSort?: string;
}

interface ColorOption {
    name: string;
    value: string;
    hex: string;
}

interface SizeOption {
    name: string;
    value: string;
}

const colorOptions: ColorOption[] = [
    { name: 'Noir', value: 'noir', hex: '#000000' },
    { name: 'Blanc', value: 'blanc', hex: '#FFFFFF' },
    { name: 'Rouge', value: 'rouge', hex: '#DC2626' },
    { name: 'Bleu', value: 'bleu', hex: '#2563EB' },
    { name: 'Vert', value: 'vert', hex: '#059669' },
    { name: 'Jaune', value: 'jaune', hex: '#D97706' },
    { name: 'Violet', value: 'violet', hex: '#7C3AED' },
    { name: 'Rose', value: 'rose', hex: '#EC4899' },
];

const sizeOptions: SizeOption[] = [
    { name: 'Standard', value: 'standard' },
    { name: 'Grande taille', value: 'grande' },
    { name: 'Petite taille', value: 'petite' },
    { name: 'Sur mesure', value: 'sur-mesure' },
];

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
    currentSort = 'date-desc'
}: ProductFiltersProps): JSX.Element {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        currentCategory ? [currentCategory] : []
    );

    const updateFilters = (newParams: Record<string, string | string[] | null>): void => {
        const params = new URLSearchParams(searchParams.toString());

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

        // Reset page to 1 when filters change
        params.set('page', '1');

        router.push(`/boutique?${params.toString()}`);
    };

    const handleSortChange = (value: string): void => {
        updateFilters({ sort: value });
    };

    const handleCategoryChange = (categorySlug: string, checked: boolean): void => {
        const newCategories = checked
            ? [...selectedCategories, categorySlug]
            : selectedCategories.filter(c => c !== categorySlug);

        setSelectedCategories(newCategories);
        updateFilters({ category: newCategories.length > 0 ? newCategories : null });
    };

    const handleColorChange = (colorValue: string, checked: boolean): void => {
        const newColors = checked
            ? [...selectedColors, colorValue]
            : selectedColors.filter(c => c !== colorValue);

        setSelectedColors(newColors);
        updateFilters({ color: newColors.length > 0 ? newColors : null });
    };

    const handleSizeChange = (sizeValue: string, checked: boolean): void => {
        const newSizes = checked
            ? [...selectedSizes, sizeValue]
            : selectedSizes.filter(s => s !== sizeValue);

        setSelectedSizes(newSizes);
        updateFilters({ size: newSizes.length > 0 ? newSizes : null });
    };

    const clearAllFilters = (): void => {
        setPriceRange([0, 100000]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedCategories([]);

        router.push('/boutique');
    };

    const hasActiveFilters =
        selectedCategories.length > 0 ||
        selectedColors.length > 0 ||
        selectedSizes.length > 0 ||
        priceRange[0] > 0 ||
        priceRange[1] < 100000;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <h2 className="font-medium text-sm uppercase tracking-wide">Filtres</h2>
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
                        <SelectValue />
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
            <Accordion type="multiple" defaultValue={['categories', 'colors', 'sizes', 'price']}>
                {/* Categories */}
                {categories.length > 0 && (
                    <AccordionItem value="categories">
                        <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                            Catégories
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
                                        className="text-sm cursor-pointer flex-1 flex justify-between"
                                    >
                                        <span>{category.name}</span>
                                        <span className="text-gray-400">({category.count})</span>
                                    </Label>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Colors */}
                <AccordionItem value="colors">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        Couleurs
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-1">
                        <div className="grid grid-cols-4 gap-3">
                            {colorOptions.map((color) => (
                                <div key={color.value} className="flex flex-col items-center space-y-1">
                                    <button
                                        onClick={() => handleColorChange(color.value, !selectedColors.includes(color.value))}
                                        className={cn(
                                            "w-8 h-8 rounded-full border-2 transition-all duration-200",
                                            selectedColors.includes(color.value)
                                                ? "border-black scale-110 shadow-md"
                                                : "border-gray-200 hover:scale-105",
                                            color.hex === '#FFFFFF' && "border-gray-300"
                                        )}
                                        style={{ backgroundColor: color.hex }}
                                        title={color.name}
                                    />
                                    <span className="text-xs text-gray-600">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Sizes */}
                <AccordionItem value="sizes">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        Tailles
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3 pt-1">
                        {sizeOptions.map((size) => (
                            <div key={size.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`size-${size.value}`}
                                    checked={selectedSizes.includes(size.value)}
                                    onCheckedChange={(checked) =>
                                        handleSizeChange(size.value, checked as boolean)
                                    }
                                />
                                <Label
                                    htmlFor={`size-${size.value}`}
                                    className="text-sm cursor-pointer"
                                >
                                    {size.name}
                                </Label>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>

                {/* Price Range */}
                <AccordionItem value="price">
                    <AccordionTrigger className="text-xs font-medium uppercase tracking-wide py-3">
                        Prix (MRU)
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-1">
                        <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={100000}
                            min={0}
                            step={1000}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>{priceRange[0].toLocaleString()} MRU</span>
                            <span>{priceRange[1].toLocaleString()} MRU</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => updateFilters({
                                price_min: priceRange[0].toString(),
                                price_max: priceRange[1].toString()
                            })}
                        >
                            Appliquer
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Quick Filters */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
                <Label className="text-xs font-medium uppercase tracking-wide">
                    Filtres rapides
                </Label>
                <div className="space-y-2">
                    <Button
                        variant={currentFilter === 'sale' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => updateFilters({ filter: currentFilter === 'sale' ? null : 'sale' })}
                    >
                        En promotion
                    </Button>
                    <Button
                        variant={currentFilter === 'featured' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => updateFilters({ filter: currentFilter === 'featured' ? null : 'featured' })}
                    >
                        Produits vedettes
                    </Button>
                    <Button
                        variant={currentFilter === 'new' ? 'default' : 'outline'}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => updateFilters({ filter: currentFilter === 'new' ? null : 'new' })}
                    >
                        Nouvelles arrivées
                    </Button>
                </div>
            </div>
        </div>
    );
}