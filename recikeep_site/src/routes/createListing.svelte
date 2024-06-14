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
		ingredients: [''],
		steps: 10,
	};

	function removeIngredient(index: number): void {
		formData.ingredients.splice(index, 1);
		formData.ingredients = [...formData.ingredients]; // Trigger reactivity
	}

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
		<form class="modal-form {cForm} bg-secondary-800/80 p-5 rounded-lg">
            <label class="label">
				<div class="flex flex-row space-x-2">
					<span class="h3 text-lg font-bold justify-center text-center">Ingredients</span>
					<button on:click={() => formData.ingredients = [...formData.ingredients, '']}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
							<path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clip-rule="evenodd" />
						  </svg>
					</button>
				</div>
				<div class="overflow-y-scroll max-h-80">
					{#each formData.ingredients as ingredient, index}
						<div class="flex">
							<input class="input" type="text" bind:value={formData.ingredients[index]} placeholder='What ingredients do you want to use?' />
							<button type="button" on:click={() => removeIngredient(index)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
								<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
							</button>
						</div>
					{/each}
				</div>


            </label>
            <label class="label">
                <span class="h3 text-lg font-bold justify-center text-center">Max Steps</span>
                <input class="input" type="text" bind:value={formData.steps} placeholder="5" />
            </label>
		</form>
        <!-- prettier-ignore -->
        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Post this listing!</button>
        </footer>

	</div>
{/if}