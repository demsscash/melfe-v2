// src/components/product/ProductImageGallery.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { WooCommerceImage } from '@/types/woocommerce';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog';

interface ProductImageGalleryProps {
    images: WooCommerceImage[];
    productName: string;
    isOnSale?: boolean;
    discountPercentage?: number;
    isFeatured?: boolean;
}

export default function ProductImageGallery({
    images,
    productName,
    isOnSale = false,
    discountPercentage = 0,
    isFeatured = false,
}: ProductImageGalleryProps): JSX.Element {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const hasMultipleImages = images.length > 1;
    const currentImage = images[currentImageIndex] || images[0];

    const goToPrevious = (): void => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const goToNext = (): void => {
        setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const goToImage = (index: number): void => {
        setCurrentImageIndex(index);
    };

    const toggleWishlist = (): void => {
        setIsWishlisted(!isWishlisted);
    };

    if (!currentImage) {
        return (
            <div className="aspect-[3/4] bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Aucune image disponible</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
                <div className="aspect-[3/4] relative overflow-hidden rounded-lg bg-gray-100">
                    <Image
                        src={currentImage.src}
                        alt={currentImage.alt || productName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {isOnSale && discountPercentage > 0 && (
                            <Badge className="bg-red-500 text-white">
                                -{discountPercentage}%
                            </Badge>
                        )}
                        {isFeatured && (
                            <Badge className="bg-black text-white">
                                Nouveauté
                            </Badge>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleWishlist}
                        className={cn(
                            "absolute top-4 right-4 w-10 h-10 p-0 rounded-full z-10 transition-all duration-300",
                            "bg-white/80 hover:bg-white backdrop-blur-sm",
                            isWishlisted && "bg-red-50 text-red-500 hover:bg-red-100"
                        )}
                    >
                        <Heart
                            className={cn(
                                "w-5 h-5 transition-all duration-300",
                                isWishlisted && "fill-current"
                            )}
                        />
                    </Button>

                    {/* Navigation Arrows */}
                    {hasMultipleImages && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 p-0 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </>
                    )}

                    {/* Expand Button */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute bottom-4 right-4 w-10 h-10 p-0 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                            >
                                <Expand className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0">
                            <div className="relative w-full h-full">
                                <Image
                                    src={currentImage.src}
                                    alt={currentImage.alt || productName}
                                    fill
                                    className="object-contain"
                                    sizes="90vw"
                                />
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Image Counter */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                            {currentImageIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            {hasMultipleImages && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id}
                            onClick={() => goToImage(index)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300",
                                currentImageIndex === index
                                    ? "border-black shadow-md"
                                    : "border-gray-200 hover:border-gray-400"
                            )}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || `${productName} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Mobile Dots Indicator */}
            {hasMultipleImages && (
                <div className="flex justify-center gap-2 md:hidden">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToImage(index)}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                currentImageIndex === index
                                    ? "bg-black"
                                    : "bg-gray-300"
                            )}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}