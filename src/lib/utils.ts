import { type ClassValue, clsx } from 'clsx';
import type { HTMLAttributes } from 'svelte/elements';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type ElementFromAttributes<T> =
	T extends HTMLAttributes<infer ElementType> ? ElementType : HTMLElement;

export type WithElementRef<T> = T & {
	ref?: ElementFromAttributes<T> | null;
};

export type WithoutChild<T> = Omit<T, 'child'>;

export type WithoutChildrenOrChild<T> = Omit<T, 'children' | 'child'>;
