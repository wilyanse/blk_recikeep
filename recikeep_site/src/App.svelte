<script lang="ts">
  import { ethers } from "ethers";
  import type { JsonRpcSigner } from "ethers";
  import { Contract } from "ethers";
  import { ABI } from "./abi";

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const account = await provider.send("eth_accounts", []);
    console.log(account);
  };

  const initializeContract = async (signer: JsonRpcSigner) => {
    return new Contract(
      "0x4B2b94F449943506dB5d8840C509A1d872A979A6",
      ABI,
      signer
    );
  };

  export interface Recipe {
    name: string;
    ingredients: string[];
    steps: string[];
    imageUrl: string;
  }

  export let recipe: Recipe;

  const createRecipe = async () => {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    await contract.createRecipe(100);
    alert("100 tokens staked");
    getStake();
    getLastStake();
    getRewards();
  };
</script>

<main>
  <button on:click={connectWallet}>Connect Wallet</button>
  <br>
  <h1>Create Recipe NFT</h1>
  <div>
    <h2>{recipe.name}</h2>
    <img src="{recipe.imageUrl}" alt="{recipe.name}" />
    <ul>
      {#each recipe.ingredients as ingredient}
        <li>{ingredient}</li>
      {/each}
    </ul>
    <ol>
      {#each recipe.steps as step}
        <li>{step}</li>
      {/each}
    </ol>
  </div>
</main>