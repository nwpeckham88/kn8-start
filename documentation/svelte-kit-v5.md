# SvelteKit v5 Documentation

## Overview

Svelte 5 introduces a new reactivity system called **Runes**, which replaces the previous top-level variables and `$: ` syntax. SvelteKit v5 leverages these runes for a more powerful and predictable development experience.

## Key Concepts: Runes

- `$state(value)`: Declares a reactive state.
- `$derived(expression)`: Declares a value derived from other reactive states.
- `$effect(() => { ... })`: Runs side effects when dependencies change.
- `$props()`: Accesses props passed to a component.
- `$bindable()`: Marks a prop as bindable.

## Snippets and Render Tags

Snippets allow you to define reusable chunks of UI within a component.

```svelte
{#snippet mySnippet(name)}
	<p>Hello {name}!</p>
{/snippet}

{@render mySnippet('World')}
```

## SvelteKit 2+ Integration

- **Redirects**: Use `redirect()` from `@sveltejs/kit` in `load` functions and actions.
- **Errors**: Use `error()` for expected errors.
- **Hooks**: `hooks.server.ts` handles server-side logic like authentication and session management.

## Routing

- `src/routes/+page.svelte`: Main entry point for a route.
- `src/routes/+layout.svelte`: Layout for a route and its children.
- `src/routes/+server.ts`: API endpoints.
- `src/routes/+page.server.ts`: Server-side load functions and actions.
