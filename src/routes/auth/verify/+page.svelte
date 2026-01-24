<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import GeometricBackground from '$lib/components/GeometricBackground.svelte';
</script>

<div class="selection:bg-primary/20 relative min-h-screen">
	<GeometricBackground />

	<div class="relative z-10 container mx-auto flex min-h-screen items-center py-12">
		<Card.Root
			class="bg-card/90 mx-auto w-full max-w-lg rounded-3xl border shadow-xl backdrop-blur"
		>
			<Card.Header class="space-y-2">
				<Card.Title class="text-3xl font-semibold tracking-tight">Check your inbox</Card.Title>
				<Card.Description class="text-base">
					We sent a secure link and one-time code to complete verification.
				</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-6">
				<div class="bg-background/60 text-muted-foreground rounded-2xl border p-4 text-sm">
					Open the email, then follow the link or enter the code to continue.
				</div>

				<Button class="h-11 w-full rounded-xl text-base" href="/auth/otp">Enter a code</Button>

				<div class="text-muted-foreground text-center text-sm">
					<a class="text-foreground hover:text-primary font-medium transition" href="/auth">
						Back to sign in
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
