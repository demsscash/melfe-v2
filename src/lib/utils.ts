// src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Formatage des prix
export function formatCurrency(
  amount: number | string,
  currency: string = 'MRU',
  locale: string = 'fr-FR'
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) return '0 MRU';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === 'MRU' ? 'EUR' : currency, // Fallback pour MRU
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount).replace('€', 'MRU');
}

// Formatage des prix simples
export function formatPrice(price: number | string, currency: string = 'MRU'): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) return '0 MRU';

  return `${numPrice.toLocaleString('fr-FR')} ${currency}`;
}

// Génération d'un slug à partir d'un texte
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9 -]/g, '') // Supprimer les caractères spéciaux
    .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
    .replace(/-+/g, '-') // Supprimer les tirets multiples
    .trim(); // Supprimer les tirets en début et fin
}

// Validation d'email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation de téléphone mauritanien
export function isValidMauritanianPhone(phone: string): boolean {
  // Format: +222 XX XX XX XX ou 222 XX XX XX XX ou XX XX XX XX
  const phoneRegex = /^(\+222|222)?[0-9\s]{8,}$/;
  const cleaned = phone.replace(/\s/g, '');
  return phoneRegex.test(cleaned) && cleaned.length >= 8;
}

// Formatage de téléphone mauritanien
export function formatMauritanianPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 8) {
    return `+222 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('222')) {
    const withoutCountryCode = cleaned.slice(3);
    return `+222 ${withoutCountryCode.slice(0, 2)} ${withoutCountryCode.slice(2, 4)} ${withoutCountryCode.slice(4, 6)} ${withoutCountryCode.slice(6, 8)}`;
  }

  return phone;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Calculer la distance de Levenshtein pour la recherche floue
export function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0]![i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j]![0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j]![i] = Math.min(
        matrix[j]![i - 1]! + 1, // deletion
        matrix[j - 1]![i]! + 1, // insertion
        matrix[j - 1]![i - 1]! + indicator // substitution
      );
    }
  }

  return matrix[str2.length]![str1.length]!;
}

// Recherche floue dans un tableau de chaînes
export function fuzzySearch(query: string, items: string[], threshold: number = 2): string[] {
  const lowerQuery = query.toLowerCase();

  return items.filter(item => {
    const lowerItem = item.toLowerCase();

    // Correspondance exacte
    if (lowerItem.includes(lowerQuery)) return true;

    // Correspondance floue
    const distance = levenshteinDistance(lowerQuery, lowerItem);
    return distance <= threshold;
  });
}

// Générer un ID unique
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 5);
  return `${prefix}${timestamp}${randomPart}`;
}

// Copier dans le presse-papiers
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pour les navigateurs plus anciens
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// Formater une date en français
export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('fr-FR', options);
}

// Calculer le temps relatif (il y a X jours)
export function getRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
  if (diffInSeconds < 31536000) return `Il y a ${Math.floor(diffInSeconds / 2592000)} mois`;

  return `Il y a ${Math.floor(diffInSeconds / 31536000)} an${Math.floor(diffInSeconds / 31536000) > 1 ? 's' : ''}`;
}

// Truncate text avec ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Capitaliser la première lettre
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// Calculer la note moyenne
export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Number((sum / ratings.length).toFixed(1));
}

// Vérifier si on est côté client
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Attendre un délai
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mélanger un tableau (shuffle)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

// Grouper un tableau par une clé
export function groupBy<T, K extends keyof any>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const group = key(item);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group]!.push(item);
    return groups;
  }, {} as Record<K, T[]>);
}

// Supprimer les doublons d'un tableau
export function removeDuplicates<T>(array: T[], key?: (item: T) => any): T[] {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const keyValue = key(item);
    if (seen.has(keyValue)) {
      return false;
    }
    seen.add(keyValue);
    return true;
  });
}

// Vérifier si un objet est vide
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  return Object.keys(obj).length === 0;
}