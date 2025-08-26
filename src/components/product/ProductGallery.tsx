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
        <div className="space-y-4">
            {/* Image principale */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                <Image
                    src={currentImage.src}
                    alt={currentImage.alt || productName}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    priority
                />

                {/* Bouton zoom */}
                <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openZoom()}
                >
                    <Expand className="w-4 h-4" />
                </Button>

                {/* Navigation si plusieurs images */}
                {productImages.length > 1 && (
                    <>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handlePreviousImage}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleNextImage}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </>
                )}

                {/* Indicateur page */}
                {productImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                        {selectedImageIndex + 1} / {productImages.length}
                    </div>
                )}
            </div>

            {/* Miniatures */}
            {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {productImages.map((image, index) => (
                        <button
                            key={image.id || index}
                            className={cn(
                                "flex-shrink-0 relative aspect-square w-16 h-16 rounded-md overflow-hidden border-2 transition-all",
                                index === selectedImageIndex
                                    ? "border-black shadow-md"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                            onClick={() => setSelectedImageIndex(index)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt || `${productName} ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Modal de zoom */}
            <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
                <DialogContent className="max-w-4xl w-full p-0 bg-black">
                    <div className="relative aspect-square w-full">
                        <Image
                            src={productImages[zoomImageIndex].src}
                            alt={productImages[zoomImageIndex].alt || productName}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 80vw"
                        />

                        {/* Bouton fermer */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-4 right-4 text-white hover:bg-white/20"
                            onClick={() => setIsZoomOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </Button>

                        {/* Navigation dans le zoom */}
                        {productImages.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                    onClick={handleZoomPrevious}
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                                    onClick={handleZoomNext}
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>

                                {/* Indicateur */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                                    {zoomImageIndex + 1} / {productImages.length}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Miniatures en bas du zoom */}
                    {productImages.length > 1 && (
                        <div className="p-4 bg-gray-900">
                            <div className="flex gap-2 justify-center overflow-x-auto">
                                {productImages.map((image, index) => (
                                    <button
                                        key={image.id || index}
                                        className={cn(
                                            "flex-shrink-0 relative aspect-square w-12 h-12 rounded-md overflow-hidden border-2 transition-all",
                                            index === zoomImageIndex
                                                ? "border-white"
                                                : "border-gray-600 hover:border-gray-400"
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