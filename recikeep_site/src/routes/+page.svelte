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
        "0x32E00984c50397a8f9417aE0FDb08A1ce1E2c46c",
        ABI,
        signer
        );
    };
</script>
  
<div class="flex h-full flex-wrap flex-col">
	<div class="mx-auto max-w-screen-xl px-4 py-8 text-center lg:py-16">
		<h1 class="text-4xl font-bold mb-4 justify-center">Welcome to Our Site</h1>
		<p class="mb-6 justify-center">A short description of the site goes here. yep</p>
	</div>

	<div class="mx-auto my-10 px-4 py-8">
		<button type="button" class="btn variant-filled mx-auto max-w-screen-xl grid justify-items-center" on:click={connectWallet}>
			<span>icon</span>
			<span>Connect wallet</span>
		</button>
	</div>



	<Accordion autocollapse class="grid justify-items-center w-full mx-auto">
		<AccordionItem open class="w-full max-w-screen-xl">
			<svelte:fragment slot="lead">icon</svelte:fragment>
			<svelte:fragment slot="summary">summary</svelte:fragment>
			<svelte:fragment slot="content">content</svelte:fragment>
		</AccordionItem>
		<AccordionItem class="w-full max-w-screen-xl">
			<svelte:fragment slot="lead">icon</svelte:fragment>
			<svelte:fragment slot="summary">summary</svelte:fragment>
			<svelte:fragment slot="content my-4">content</svelte:fragment>
		</AccordionItem>
		<AccordionItem class="w-full max-w-screen-xl">
			<svelte:fragment slot="lead">icon</svelte:fragment>
			<svelte:fragment slot="summary">summary</svelte:fragment>
			<svelte:fragment slot="content my-4">content</svelte:fragment>
		</AccordionItem>
	</Accordion>
</div>
  

<style lang="postcss">
</style>
