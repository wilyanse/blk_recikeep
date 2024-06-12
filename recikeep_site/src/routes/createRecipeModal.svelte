<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Form Data
	const formData = {
		name: 'What do you call this recipe?',
		ingredients: ['What do you need to create this recipe?'],
		steps: ['How do I remake this recipe?'],
        url: 'Do you have a link to an image of the food?'
	};

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
        console.log("yep submitted");
		if ($modalStore[0].response) $modalStore[0].response(formData);
		modalStore.close();
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<!-- Enable for debugging: -->
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Recipe Name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="What do you call this recipe?" />
			</label>
            <label class="label">
                <span>Ingredients</span>
                {#each formData.ingredients as ingredient, index}
                    <input class="input" type="text" bind:value={formData.ingredients[index]} placeholder="What do you need to create this recipe?" />
                {/each}
                <button on:click={() => formData.ingredients = [...formData.ingredients, '']}>Add Ingredient</button>
            </label>
            <label class="label">
                <span>Steps</span>
                {#each formData.steps as step, index}
                    <input class="input" type="text" bind:value={formData.steps[index]} placeholder="How do I remake this recipe?" />
                {/each}
                <button on:click={() => formData.steps = [...formData.steps, '']}>Add Step</button>
            </label>
            <label class="label">
				<span>Image Link</span>
				<input class="input" type="text" bind:value={formData.url} placeholder="Do you have a link to an image of the food?" />
			</label>
		</form>
        <!-- prettier-ignore -->
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Post this recipe!</button>
        </footer>

	</div>
{/if}