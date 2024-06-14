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

	import { TreeView, TreeViewItem, RecursiveTreeView, type TreeViewNode } from '@skeletonlabs/skeleton';

</script>
<!-- <pre class="pre">name: {$modalStore[0].meta.name}</pre>
<pre class="pre">url: {$modalStore[0].meta.recipe_img}</pre>
<pre class="pre">ingredients: {$modalStore[0].meta.ingredients}</pre>
<pre class="pre">steps: {$modalStore[0].meta.steps}</pre>
 -->
{#if $modalStore[0]}
	<div class="modal-example-fullscreen {cBase} flex flex-col space-y-5 w-full py-10">
		<div class="flex flex-col items-center space-y-4 overflow-y-auto overscroll-contain max-h-full w-full h-full bg-primary-800/90 py-10 rounded-lg px-5 mx-5">
			<h2 class="h2 text-4xl font-bold mb-4 justify-center text-center">{$modalStore[0].meta.name}</h2>
			<div class="grid grid-cols-2 content-start space-x-5 w-full max-w-7xl">
				<TreeView selection multiple>
					<TreeViewItem name="medium" value="Ingredients" class="grid grid-col-1 bg-secondary-600/100 text-black p-5 rounded-lg" spacing="space-y-1">
						<svelte:fragment slot="lead">
							<div class="flex flex-row space-x-4 mt-3 mx-3">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
									</svg>
									<p class="text-2xl font-bold mb-5">Ingredients</p>
							</div>
						</svelte:fragment>
						<svelte:fragment slot="children">
							{#if $modalStore[0].meta.ingredients.length > 0}
							<ul class='list bg-secondary-700/100 p-5 rounded-lg'>
								{#each $modalStore[0].meta.ingredients as ingredient}
									<TreeViewItem name="Ingredients" value={ingredient}>
										{ingredient}
									</TreeViewItem>
								{/each}
							</ul>
							{/if}
						</svelte:fragment>
					</TreeViewItem>
					<TreeViewItem name="medium" value="Steps" class="flex flex-col place-content-center bg-secondary-600/100 text-black p-5 rounded-lg" spacing="space-y-1">
						<svelte:fragment slot="lead">
							<div class="flex flex-row space-x-4 mt-3 mx-3">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 my-1.5">
									<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
									</svg>
									<p class="text-2xl font-bold mb-5">Steps</p>
							</div>
						</svelte:fragment>
						<svelte:fragment slot="children">
							{#if $modalStore[0].meta.steps.length > 0}
							<ol class='list bg-secondary-700/100 p-5 rounded-lg'>
								{#each $modalStore[0].meta.steps as step}
									<TreeViewItem name="Steps" value={step}>
										{step}
									</TreeViewItem>
								{/each}
							</ol>
							{/if}
						</svelte:fragment>
					</TreeViewItem>
				</TreeView>
				<img src="{$modalStore[0].meta.recipe_img}" alt="{$modalStore[0].meta.name}" class="w-full aspect-square rounded-lg"/>
			</div>
			
		</div>
		<button class="btn variant-filled" on:click={parent.onClose}>× Close</button>
	</div>
{/if}