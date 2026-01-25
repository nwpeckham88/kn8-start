# shadcn-svelte & Bits UI Documentation

## Overview

`shadcn-svelte` is a collection of re-usable components built on top of `bits-ui` (an unstyled, accessible component library for Svelte).

## Installation

Use the CLI to add components as needed.

```bash
pnpm dlx shadcn-svelte@latest init
pnpm dlx shadcn-svelte@latest add button
```

## Bits UI

`bits-ui` provides the primitive components that handle accessibility and keyboard navigation.

```svelte
<script>
	import { Button } from 'bits-ui';
</script>

<Button.Root class="...">Click me</Button.Root>
```

## Theming

Theming is handled via Tailwind CSS variables in `src/app.css`.

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  ...
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  ...
}
```

## Accessibility

All components are built with ARIA attributes and follow WAI-ARIA design patterns.
