<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	// Stores
	import { getModalStore } from '@skeletonlabs/skeleton';

	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	// Notes: Use `w-screen h-screen` to fit the visible canvas size.
	const cBase = 'bg-surface-100-800-token w-screen h-screen p-4 flex justify-center items-center';


</script>
<!-- <pre class="pre">name: {$modalStore[0].meta.name}</pre>
<pre class="pre">url: {$modalStore[0].meta.recipe_img}</pre>
<pre class="pre">ingredients: {$modalStore[0].meta.ingredients}</pre>
<pre class="pre">steps: {$modalStore[0].meta.steps}</pre>
 -->
{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase}">
		<div class="flex flex-col items-center space-y-4">
			<h2 class="h2">{$modalStore[0].meta.name}</h2>
			{#if $modalStore[0].meta.ingredients.length > 0}
			<ul>
				{#each $modalStore[0].meta.ingredients as ingredient}
				<li>{ingredient}</li>
				{/each}
			</ul>
			{/if}
			{#if $modalStore[0].meta.steps.length > 0}
			<ol>
				{#each $modalStore[0].meta.steps as step}
				<li>{step}</li>
				{/each}
			</ol>
			{/if}
			<img src="{$modalStore[0].meta.recipe_img}" alt="{$modalStore[0].meta.name}" />
			<button class="btn variant-filled" on:click={parent.onClose}>× Close</button>
		</div>
	</div>
{/if}