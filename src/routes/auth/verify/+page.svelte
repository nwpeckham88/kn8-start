<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
</script>

<div class="relative min-h-screen selection:bg-primary/20">
	<GeometricBackground />

	<div class="container relative z-10 mx-auto flex min-h-screen items-center py-12">
		<Card.Root class="mx-auto w-full max-w-lg rounded-3xl border bg-card/90 shadow-xl backdrop-blur">
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Check your inbox</Card.Title>
				<Card.Description class="text-base">
					We sent a secure link and one-time code to complete verification.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="rounded-2xl border bg-background/60 p-4 text-sm text-muted-foreground">
					Open the email, then follow the link or enter the code to continue.
				</div>

				<Button class="h-11 w-full rounded-xl text-base" href="/auth/otp">
					Enter a code
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
