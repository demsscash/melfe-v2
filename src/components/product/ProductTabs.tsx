// src/components/product/ProductTabs.tsx

'use client';

import { WooCommerceProduct } from '@/types/woocommerce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Star,
    Truck,
    RotateCcw,
    Shield
} from 'lucide-react';

interface ProductTabsProps {
    product: WooCommerceProduct;
}

export default function ProductTabs({ product }: ProductTabsProps) {
    const hasDescription = product.description && product.description.trim() !== '';
    const hasAttributes = product.attributes && product.attributes.length > 0;

    return (
        <div className="w-full">
            <Tabs defaultValue="description" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Caractéristiques</TabsTrigger>
                    <TabsTrigger value="shipping">Livraison</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            {hasDescription ? (
                                <div
                                    className="prose prose-gray max-w-none"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Aucune description disponible pour ce produit.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="specifications" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-6">Caractéristiques techniques</h3>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-medium text-sm mb-3 text-gray-900">Informations générales</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">SKU</span>
                                            <span className="text-sm font-medium">{product.sku || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-100">
                                            <span className="text-sm text-gray-600">Stock</span>
                                            <Badge
                                                variant={product.stock_status === 'instock' ? 'secondary' : 'destructive'}
                                                className="text-xs"
                                            >
                                                {product.stock_status === 'instock' ? 'En stock' : 'Rupture de stock'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {hasAttributes && (
                                    <div>
                                        <h4 className="font-medium text-sm mb-3 text-gray-900">Attributs</h4>
                                        <div className="space-y-3">
                                            {product.attributes.map((attribute) => (
                                                <div key={attribute.id} className="flex justify-between py-2 border-b border-gray-100">
                                                    <span className="text-sm text-gray-600">{attribute.name}</span>
                                                    <span className="text-sm font-medium">
                                                        {attribute.options.join(', ')}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="shipping" className="mt-6">
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-6">Livraison et retours</h3>

                            <div className="space-y-8">
                                <div>
                                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Options de livraison
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                                            <div>
                                                <h5 className="font-medium text-sm">Livraison standard</h5>
                                                <p className="text-xs text-gray-600">3-5 jours ouvrés</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">5.000 MRU</p>
                                                <p className="text-xs text-gray-600">Gratuite dès 50.000 MRU</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                                        <RotateCcw className="w-5 h-5" />
                                        Retours et échanges
                                    </h4>

                                    <div className="space-y-3 text-sm">
                                        <p>• <strong>30 jours</strong> pour retourner votre article</p>
                                        <p>• Retour <strong>gratuit</strong> en magasin ou par courrier</p>
                                        <p>• Article en <strong>parfait état</strong> avec étiquettes</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-sm mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Garantie qualité
                                    </h4>

                                    <div className="space-y-3 text-sm">
                                        <p>• Garantie <strong>2 ans</strong> contre les défauts de fabrication</p>
                                        <p>• Service client dédié pour toute réclamation</p>
                                        <p>• Engagement qualité artisanale mauritanienne</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}