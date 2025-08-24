// src/components / ui / breadcrumb.tsx
import React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

export default function Breadcrumb({ items, className }: BreadcrumbProps): JSX.Element {
    return (
        <nav aria-label="Breadcrumb" className={cn("flex", className)}>
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-black"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Accueil
                    </Link>
                </li>
                {items.slice(1).map((item, index) => (
                    <li key={item.href}>
                        <div className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {index === items.length - 2 ? (
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="ml-1 text-sm font-medium text-gray-700 hover:text-black md:ml-2"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    )
}