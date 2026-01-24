<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
</script>

<div class="selection:bg-primary/20 relative min-h-screen w-full overflow-hidden">
	<GeometricBackground />

	<div class="relative z-10 container mx-auto flex min-h-screen items-center py-12">
		<Card.Root
			class="bg-card/90 mx-auto w-full max-w-lg rounded-3xl border shadow-xl backdrop-blur"
		>
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Set a new password</Card.Title>
				<Card.Description class="text-base">
					Create a strong password to secure your account.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="space-y-2">
					<Label for="password">New password</Label>
					<Input id="password" type="password" autocomplete="new-password" />
				</div>
				<div class="space-y-2">
					<Label for="confirm">Confirm password</Label>
					<Input id="confirm" type="password" autocomplete="new-password" />
				</div>

				<Button class="h-11 w-full rounded-xl text-base" href="/auth">Update password</Button>

				<div class="text-muted-foreground text-center text-sm">
					<a class="text-foreground hover:text-primary font-medium transition" href="/auth">
						Back to sign in
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
