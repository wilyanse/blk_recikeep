<script lang="ts">
  
    import { ethers } from "ethers";
    import type { JsonRpcSigner } from "ethers";
    import { Contract } from "ethers";
    import { ABI } from "../../abi";
    import { onMount } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
			
	const modalStore = getModalStore();

	// Notes: Use `w-screen h-screen` to fit the visible canvas size.
	const cBase = 'bg-surface-100-800-token w-screen h-screen p-4 flex justify-center items-center';

    const initializeContract = async (signer: JsonRpcSigner) => {
      return new Contract(
        "0x32E00984c50397a8f9417aE0FDb08A1ce1E2c46c",
        ABI,
        signer
      );
    };
  
    // Define types for recipe data
    interface RecipeData {
      id: number,
      name: string;
      ingredients: string[];
      steps: string[];
      imageUrl: string;
    }
  
    // Define recipe data array
    let recipes: RecipeData[] = [];
    let errorCodes: number[] = [];
    let errorMessages: string[] = [];
    // Function to fetch all recipe names and images
    async function fetchRecipes() {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      const account = await provider.send("eth_accounts", []);
  
      const [recipeNames, recipeImages] = await contract.getAllRecipeNamesAndImages();
  
      // Combine names and images into RecipeData array
      recipes = recipeNames.map((name, index) => ({
          id: index, // Assigning unique ID for each recipe
          name,
          ingredients: [],
          steps: [],
          imageUrl: recipeImages[index]
        }));
  
      errorMessages = new Array(recipes.length).fill("");
      errorCodes = new Array(recipes.length).fill(0);
    }
  
    interface RecipeData {
      name: string;
      ingredients: string[];
      steps: string[];
      imageUrl: string;
    }
  
    // Recipe creation form fields
    let recipeName: string = '';
    let ingredients: string[] = ['']; // Initial subfield
    let steps: string[] = ['']; // Initial subfield
    let imageUrl: string = '';
  
    // Function to create the NFT
    async function createRecipeNFT() {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = await initializeContract(signer);
        const account = await provider.send("eth_accounts", []);
        // Convert ingredients and steps to arrays
        const ingredientsArray = ingredients.filter(Boolean); // Remove empty strings
        const stepsArray = steps.filter(Boolean); // Remove empty strings
        new Promise<boolean>((resolve) => {
            const modal: ModalSettings = {
                type: 'component',
                component: 'createRecipeModal',
                title: 'Create your own Recipe',
                body: 'Input details below and show your recipe to the world!',
                response: (r: RecipeData) => {
                    resolve(r);
                }
            };
            modalStore.trigger(modal);

        }).then((r: any) => {
            console.log(r);
            contract.createRecipeNFT(r.name, r.ingredients, r.steps, r.url);
            fetchRecipes();
        });

    }
  
    // Variable to control modal visibility
    let showModal = false;
  
    async function viewRecipe(name: string, index: number) {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      const account = await provider.send("eth_accounts", []);
      try {
        const tokenId = await contract.getTokenIdByName(name);
        const recipeData = await contract.getRecipe(tokenId);
        recipes[index].ingredients = recipeData.ingredients;
        recipes[index].steps = recipeData.steps;

        const modal: ModalSettings = {
            type: 'component',
            component: 'recipeModal',
            meta: { ingredients: recipes[index].ingredients, steps: recipes[index].steps, recipe_img: recipes[index].imageUrl, name: recipes[index].name }
        };
        modalStore.trigger(modal);

      } catch (error) {
        const modal: ModalSettings = {
            type: 'confirm',
            // Data
            title: 'Recipe is not owned',
            body: 'You need to purchase this recipe in order to view it. Do you want to purchase this recipe?',
            // TRUE if confirm pressed, FALSE if cancel pressed
            response: (r: boolean) => {
                if (r) {
                    payToViewRecipe(name);
                }
            },
        };
        modalStore.trigger(modal);
        console.error("Error viewing recipe:", error);
        errorMessages[recipes[index].id] = "You need to pay to view this recipe.";
        errorCodes[recipes[index].id] = error.code || -1;
      }
    }
  
    async function payToViewRecipe(name: string) {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      const account = await provider.send("eth_accounts", []);
      try {
        const tokenId = await contract.getTokenIdByName(name);
        const tx = await contract.payToViewRecipe(tokenId, { value: ethers.parseEther("0.01") });
        await tx.wait();
        errorMessages[recipes[index].id] = "";
        errorCodes[recipes[index].id] = 0;
        viewRecipe(name, index); // Try to view the recipe again after payment
      } catch (error) {
        console.error("Error paying to view recipe:", error);
        errorMessages[recipes[index].id] = "Payment failed. Please try again.";
        errorCodes[recipes[index].id] = error.code || -1;
      }
    }

    onMount(() => {
        fetchRecipes();
     });
</script>
  
  <main>
    <div>
    <h1>Recipe Gallery</h1>

    <div class="snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10">
        {#if recipes.length > 0}
            {#each recipes as recipe}
                <div class="snap-start shrink-0 card py-20 w-40 md:w-80 text-center">
                    <div class="card">
                        <header class="card-header">
                            {recipe.name}
                        </header>
                        <section class="p-4">
                            <img src={recipe.imageUrl} alt={recipe.name} class="w-full h-40 object-cover" />
                        </section>
                        <footer class="card-footer">
                            <button on:click={() => viewRecipe(recipe.name, recipe.id)}>View Recipe</button>
                        </footer>
                    </div>
                </div>
            {/each}
        {:else}
            <p>No recipes present. Create one for yourself!</p>
        {/if}
    </div>
    <div>
      <button type="button" on:click={() => createRecipeNFT()}>Create Recipe</button>
    </div>
  </main>