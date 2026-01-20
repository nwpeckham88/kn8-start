# Tailwind CSS v4 Documentation

## Overview
Tailwind CSS v4 is a major update focusing on performance and a CSS-first configuration model. It no longer requires a `tailwind.config.js` file for basic setups.

## Installation
```bash
npm install tailwindcss @tailwindcss/vite
```

## Vite Configuration
Add the plugin to `vite.config.ts`.

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()]
});
```

## CSS Entry Point
In your main CSS file (e.g., `src/app.css`):

```css
@import "tailwindcss";
```

## Customization
Customizations are now done directly in CSS using `@theme` blocks or CSS variables.

```css
@theme {
  --color-primary: #3b82f6;
  --font-sans: "Inter", sans-serif;
}
```

## Dark Mode
V4 supports a more flexible dark mode setup. You can use the `dark:` variant as usual. For class-based dark mode:

```css
@custom-variant dark (&:where(.dark, .dark *));
```
