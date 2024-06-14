<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	import { ListBox, ListBoxItem, getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	// Local
	let recipeName = '';
	const modalStore = getModalStore();

	// Handle Form Submission
	function onFormSubmit(): void {
		if ($modalStore[0].response) $modalStore[0].response(recipeName);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>Suggest a recipe for this listing</header>
		<article>Suggest a recipe from ones that you own!</article>
		<ListBox class="border border-surface-500 p-4 rounded-container-token bg-secondary-800/80 p-5 rounded-lg">
            {#each $modalStore[0].meta.recipes as recipe}
                <ListBoxItem bind:group={recipeName} name={recipe.name} value={recipe.name} class="bg-secondary-500/80 p-5 rounded-lg text-black">{recipe.name}</ListBoxItem>
            {/each}
		</ListBox>
		<!-- prettier-ignore -->
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Select Recipe</button>
    </footer>
	</div>
{/if}