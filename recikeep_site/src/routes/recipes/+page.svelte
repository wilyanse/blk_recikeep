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
        "0xd5BA7c9afD3FdE1F8F62313C1c4304F3349782a3",
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
      recipes = recipeNames.map((name: string, index: number) => ({
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
        new Promise<RecipeData>((resolve) => {
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
                    payToViewRecipe(name, index);
                }
            },
        };
        modalStore.trigger(modal);
      }
    }
  
    async function payToViewRecipe(name: string, index: number) {
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
      }
    }

    onMount(() => {
        fetchRecipes();
     });
</script>
  
  <main class='flex flex-col items-center justify-center'>
    <div class='py-30 max-w-6xl justify-items-center my-10 flex flex-col'>
      <h1 class='text-4xl font-bold mb-8 justify-center h1 text-center'>Recipe Gallery</h1>
      <button type="button" class="btn variant-filled mx-5 justify-items-center flex " on:click={createRecipeNFT}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>        
        <span>Create your own recipe!</span>
      </button>
    </div>
    
    <div>
      <div class='grid  grid-cols-3 '>
        {#if recipes.length > 0}
            {#each recipes as recipe}
              <div class="card mx-5 my-5 p-5">
                  <header class="card-header text-center">
                      <h3 class='h3 text-xl font-bold'>{recipe.name}</h3>
                  </header>
                  <section class="p-4">
                      <img src={recipe.imageUrl} alt={recipe.name} class="w-full h-40 object-cover" />
                  </section>
                  <footer class="card-footer text-center">
                      <button type="button" class="btn variant-filled mx-5 justify-items-center flex " on:click={viewRecipe(recipe.name, recipe.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                            
                        <span>View this recipe</span>
                      </button>
                  </footer>
              </div>
            {/each}
        {:else}
            <h1 class='text-xl font-bold mb-8 justify-center h1 text-center'>No recipes present. Start by sharing the first one yourself!</h1>
        {/if}
      </div>
    </div>
  </main>