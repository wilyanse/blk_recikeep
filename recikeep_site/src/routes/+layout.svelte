<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';

	initializeStores();

	import RecipeModal from './recipeModal.svelte';
	import CreateRecipeModal from './createRecipeModal.svelte';
	import CreateListing from './createListing.svelte';

	const modalRegistry: Record<string, ModalComponent> = {
		// Set a unique modal ID, then pass the component reference
		recipeModal: { ref: RecipeModal },
		createRecipeModal: { ref: CreateRecipeModal },
		createListing: { ref: CreateListing }
		// ...
	};

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
			
</script>
<Modal components={modalRegistry} />
<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end" gap="gap-10">
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">Skeleton</strong>
			</svelte:fragment>

			<svelte:fragment>
				<div class="grid grid-cols-3 gap-10 justify-center">
					<a
						class="btn btn-sm variant-ghost-surface"
						href="/"
						rel="noreferrer"
					>
						Home
					</a>
					<a
						class="btn btn-sm variant-ghost-surface"
						href="/recipes"
						rel="noreferrer"
					>
						Recipes
					</a>
					<a
						class="btn btn-sm variant-ghost-surface"
						href="/listings"
						rel="noreferrer"
					>
						Listings
					</a>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
