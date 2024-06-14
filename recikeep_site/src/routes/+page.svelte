<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';

    import { ethers } from "ethers";
    import type { JsonRpcSigner } from "ethers";
    import { Contract } from "ethers";
    import { ABI } from "../abi";

    const connectWallet = async () => {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const account = await provider.send("eth_accounts", []);
        console.log(account);
    };

    const initializeContract = async (signer: JsonRpcSigner) => {
        return new Contract(
        "0x7b8411Ea1b7ebEe476F6d55669df3A95A92a2227",
        ABI,
        signer
        );
    };
</script>
  
<div class="flex h-full flex-wrap flex-col space-y-10">
	<div class="mx-auto px-4 py-8 text-center lg:py-16 w-full max-w-screen-xl bg-tertiary-500/75 rounded-lg">
		<div class='flex space-x-2.5 justify-center'>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14">
				<path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
			</svg>
			<h1 class="text-5xl font-bold mb-8 justify-center h1">ReciKeep</h1>
		</div>
		<p class="mb-6 justify-center italic">The blockchain DAPP that lets you monetize your cooking!</p>
	</div>

	<Accordion class="grid justify-items-center w-full max-w-screen-xl mx-auto space-y-5 bg-tertiary-500/40 py-10 rounded-lg">
		<AccordionItem class="w-full max-w-screen-md bg-tertiary-500/40 rounded-lg">
			<svelte:fragment slot="lead"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
			  </svg>
			  </svelte:fragment>
			<svelte:fragment slot="summary">What does ReciKeep do?</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="flex flex-col space-y-100">
					<strong>Share your recipes:</strong>
					<p>ReciKeep lets you share your recipes with the world! Creating a recipe lets you create an NFT of your own recipe for the world to see, and for you to permanently keep. Of course, they won't be seeing it for free. They can only see basic information regarding the recipe you've made such as its name and image but not see the ingredients and steps that they need to do to make it. This lets you earn money the more that others want to recreate your recipes!</p>
					<br>
					<strong>View other's recipes:</strong>
					<p>Similar to how others can view your recipes, you can view their recipes as well! Do note that you will have to pay to view their recipes, but if the image looks appetizing enough, then go for it!</p>
					<br>
					<strong>Request a recipe:</strong>
					<p>ReciKeep lets you ask others to post their recipes depending on the ingredients that you have in store, and how easy you want the recipe to be. Creating a listing will cost you, but its a small price to pay to cook something great!</p>
					<br>
					<strong>Fulfill a listing:</strong>
					<p>If you're a professional cook with many recipes in store, you can choose to see ReciKeep as a freelance market for people that need help with their ingredients! Suggest recipes for listings and if people like the recipe that you've suggested, you get to earn money in your wallet! A freelance cook's dream.</p>
				</div>
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem class="w-full max-w-screen-md bg-tertiary-500/40 rounded-lg">
			<svelte:fragment slot="lead"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
			  </svg>
			  </svelte:fragment>
			<svelte:fragment slot="summary">How does it do it?</svelte:fragment>
			<svelte:fragment slot="content">
				<div>
					<p>ReciKeep utilizes the ERC721 standard on the Ethereum blockchain in order to create, view, and trade unique NFTs for recipes and listings. All of the data on the site can only be viewed if the user has already connected their wallet. Recipes and listings can be created by anyone and an ERC721 token is minted to represent the unique object on the blockchain. All transactions that alter objects would require a gas fee which is paid for by the sender. The site does not take any of the payments between transactions. All money used in transactions between users will go back to the users once transactions are completed.</p>
				</div>
			</svelte:fragment>
		</AccordionItem>
		<AccordionItem class="w-full max-w-screen-md bg-tertiary-500/40 rounded-lg">
			<svelte:fragment slot="lead"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
			  </svg>
			  </svelte:fragment>
			<svelte:fragment slot="summary">Who made ReciKeep?</svelte:fragment>
			<svelte:fragment slot="content">
				<div class="flex flex-col space-y-100">
					<strong>Will Jose:</strong>
					<p>Fullstack developer and Project Manager of ReciKeep</p>
					<p class="italic">Student of CS 172 WFX</p>
					<br>
					<strong>Raymart Villos:</strong>
					<p>Product analysis and Marketing Specialist</p>
					<br>
					<strong>Brylle Logrono:</strong>
					<p>UI/UX designer and Content manager</p>
				</div>
			</svelte:fragment>
		</AccordionItem>
	</Accordion>

	<div class="mx-auto my-10 px-4 py-8 space-y-5 w-full max-w-screen-xl bg-tertiary-500/80 rounded-lg">
		<h2 class="h2 text-xl text-center">
			What are you waiting for? Connect your wallet and let's get started!
		</h2>
		<button type="button" class="btn variant-filled mx-auto max-w-screen-xl justify-items-center flex " on:click={connectWallet}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
			</svg>  
			<span>Connect your wallet</span>
		</button>
	</div>
</div>
  

<style lang="postcss">
</style>
