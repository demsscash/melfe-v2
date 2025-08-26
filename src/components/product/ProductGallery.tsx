// src/components/product/ProductGallery.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImage {
    id: number;
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

interface ProductGalleryProps {
    images: ProductImage[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [zoomImageIndex, setZoomImageIndex] = useState(0);

    // Image par défaut si pas d'images
    const defaultImage = {
        id: 0,
        src: '/placeholder-product.jpg',
        alt: productName,
        width: 600,
        height: 600
    };

    const productImages = images.length > 0 ? images : [defaultImage];
    const currentImage = productImages[selectedImageIndex];

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? productImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === productImages.length - 1 ? 0 : prev + 1
        );
    };

    const handleZoomPrevious = () => {
        setZoomImageIndex((prev) =>
            prev === 0 ? productImages.length - 1 : prev - 1
        );
    };

    const handleZoomNext = () => {
        setZoomImageIndex((prev) =>
            prev === productImages.length - 1 ? 0 : prev + 1
        );
    };

    const openZoom = (index: number = selectedImageIndex) => {
        setZoomImageIndex(index);
        setIsZoomOpen(true);
    };

    return (
        <div className="space-y-3">
            {/* Layout desktop : miniatures à gauche, image principale à droite */}
            <div className="flex flex-col md:flex-row md:gap-4">

                {/* Miniatures - En haut sur mobile, à gauche sur desktop */}
                {productImages.length > 1 && (
                    <div className="md:w-20 order-2 md:order-1">
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-hide">
                            {productImages.map((image, index) => (
                                <button
                                    key={image.id || index}
                                    className={cn(
                                        "flex-shrink-0 relative aspect-square w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                                        index === selectedImageIndex
                                            ? "border-black shadow-lg ring-2 ring-black/10"
                                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                    )}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <Image
                                        src={image.src}
                                        alt={image.alt || `${productName} ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Image principale */}
                <div className="flex-1 order-1 md:order-2">
                    <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group cursor-zoom-in">
                        <Image
                            src={currentImage.src}
                            alt={currentImage.alt || productName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 60vw"
                            priority
                            onClick={() => openZoom()}
                        />

                        {/* Overlay avec boutons - visible au hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">

                            {/* Bouton zoom */}
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openZoom();
                                }}
                            >
                                <Expand className="w-4 h-4" />
                            </Button>

                            {/* Navigation si plusieurs images */}
                            {productImages.length > 1 && (
                                <>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePreviousImage();
                                        }}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white mr-12"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNextImage();
                                        }}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </>
                            )}

                            {/* Indicateur page - visible seulement sur mobile */}
                            {productImages.length > 1 && (
                                <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2">
                                    <div className="flex gap-1.5">
                                        {productImages.map((_, index) => (
                                            <div
                                                key={index}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-300",
                                                    index === selectedImageIndex
                                                        ? "bg-white shadow-lg"
                                                        : "bg-white/50"
                                                )}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de zoom amélioré */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogContent className="max-w-6xl w-full h-[90vh] p-0 bg-black border-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={productImages[zoomImageIndex].src}
                            alt={productImages[zoomImageIndex].alt || productName}
                            fill
                            className="object-contain p-4"
                            sizes="90vw"
                        />

                        {/* Bouton fermer */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
                            onClick={() => setIsZoomOpen(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Navigation dans le zoom */}
                        {productImages.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 p-0"
                                    onClick={handleZoomPrevious}
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 h-12 w-12 p-0"
                                    onClick={handleZoomNext}
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </Button>

                                {/* Indicateur avec style amélioré */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {zoomImageIndex + 1} / {productImages.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Miniatures en bas du zoom */}
                    {productImages.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
                            <div className="flex gap-2 justify-center overflow-x-auto bg-black/30 backdrop-blur-sm rounded-full p-3 scrollbar-hide">
                                {productImages.map((image, index) => (
                                    <button
                                        key={image.id || index}
                                        className={cn(
                                            "flex-shrink-0 relative aspect-square w-12 h-12 rounded-lg overflow-hidden border-2 transition-all",
                                            index === zoomImageIndex
                                                ? "border-white shadow-lg"
                                                : "border-white/30 hover:border-white/60"
                                        )}
                                        onClick={() => setZoomImageIndex(index)}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt || `${productName} ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="48px"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}