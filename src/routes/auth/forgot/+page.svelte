<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
</script>

<div class="relative min-h-screen w-full overflow-hidden selection:bg-primary/20">
	<GeometricBackground />

	<div class="container relative z-10 mx-auto flex min-h-screen items-center py-12">
		<Card.Root class="mx-auto w-full max-w-lg rounded-3xl border bg-card/90 shadow-xl backdrop-blur">
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Reset your password</Card.Title>
				<Card.Description class="text-base">
					Enter your email and we will send a secure reset link.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input id="email" type="email" autocomplete="email" placeholder="name@example.com" />
				</div>

				<Button class="h-11 w-full rounded-xl text-base" href="/auth/verify">
					Send reset link
				</Button>

				<div class="text-center text-sm text-muted-foreground">
					<a class="font-medium text-foreground transition hover:text-primary" href="/auth">
						Back to sign in
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
