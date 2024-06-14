<script lang="ts">
    import { ethers } from "ethers";
    import type { JsonRpcSigner } from "ethers";
    import { Contract } from "ethers";
    import { ABI } from "../../abi";
    import { onMount } from 'svelte';
    import { TreeView, TreeViewItem } from '@skeletonlabs/skeleton';
    import { Autocomplete } from '@skeletonlabs/skeleton';
    import type { AutocompleteOption } from '@skeletonlabs/skeleton';
    import { Modal, getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';

    const initializeContract = async (signer: JsonRpcSigner) => {
      return new Contract(
        "0x7b8411Ea1b7ebEe476F6d55669df3A95A92a2227",
        ABI,
        signer
      );
    };
  
    interface Listing {
      id: number;
      poster: string;
      desiredIngredients: string[];
      maxSteps: number;
      payment: string;
      fulfilled: boolean;
    }
  
    interface Recipe {
      name: string;
      ingredients: string[];
      steps: string[];
      imageUrl: string;
      placeholder?: boolean;
    }
  
    let listings: Listing[] = [];
    let desiredIngredients = "";
    let maxSteps = 0;
    let payment = "";
    let listingsWithRecipes: Array<{ listing: Listing, recipes: Recipe[] }> = [];

    let ownedRecipesGlobal: Recipe[] = [];
  
    async function loadListings() {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);

      const [ownedRecipes, ownedListings] = await contract.getOwnedRecipesAndListings();
      ownedRecipesGlobal = ownedRecipes;
      
      for (const recipe of ownedRecipes) {
        flavorOptions.push({ label: recipe.name, value: recipe.name});
      }
      console.log(flavorOptions);

      try {
        const fetchedListings = await contract.getAllListings();
        for (const listing of fetchedListings) {
          // Check if the listing already exists in listingsWithRecipes
          const existingListingIndex = listingsWithRecipes.findIndex(item => item.listing.id === listing.id);
          if (existingListingIndex === -1) {
            let recipeData = await contract.getRecipesByListing(listing.id);
            if (recipeData.length === 0) {
              recipeData = [{
                name: "No recipes yet",
                ingredients: [],
                steps: [],
                imageUrl: "",
                placeholder: true
              }];
            }
            listingsWithRecipes.push({ listing, recipes: recipeData });
          }
        }
      } catch (error) {
        console.error("Error loading listings:", error);
      }
      console.log("Listings with recipes:", listingsWithRecipes);
      listingsWithRecipes = [...listingsWithRecipes];
    }
  
    async function createListing() {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      new Promise<{ ingredients: string[], steps: number}>((resolve) => {
            const modal: ModalSettings = {
                type: 'component',
                component: 'createListing',
                title: 'Create your own listing',
                body: 'Input details below and let the world cook!',
                response: (r: { ingredients: string[], steps: number}) => {
                    resolve(r);
                }
            };
            modalStore.trigger(modal);
        }).then((r: any) => {
            console.log(r);
            const paymentInWei = ethers.parseEther('0.00001');
            contract.createListing(r.ingredients, r.steps, { value: paymentInWei });
            loadListings();
            listingsWithRecipes = [...listingsWithRecipes];
        });
    }

    let flavorOptions: AutocompleteOption<string>[] = [];
				
    let images: string[] = [];
			
    const modalStore = getModalStore();

    async function suggestRecipe(listingId: number) {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);

    try {
        // Find the listing in listingsWithRecipes
        const listing = listingsWithRecipes.find(item => item.listing.id === listingId);

        if (!listing) {
            console.error(`Listing with ID ${listingId} not found`);
            return;
        }
        console.log(listing);
        // Check for duplicate recipe names

        // Proceed with suggesting the recipe
        new Promise<string>((resolve) => {
            const modal: ModalSettings = {
                type: 'component',
                component: 'suggestRecipeModal',
                meta: { recipes: ownedRecipesGlobal },
                response: (rName: string) => {
                    resolve(rName);
                }
            };
            modalStore.trigger(modal);
        }).then((rName: any) => {
            console.log(rName);
            const recipeAlreadyExists = listing.recipes.some(recipe => recipe.name === rName);
            console.log(recipeAlreadyExists);
            modalStore.clear();

            if (!recipeAlreadyExists) {
              // Here you would typically convert r to tokenId or handle as per your contract
              const tokenId = contract.getTokenIdByName(rName);
              contract.suggestRecipe(listingId, tokenId);
              loadListings(); // Refresh listings after suggesting the recipe
            }
        });
    } catch (error) {
        console.error('Error suggesting recipe:', error);
        const modal: ModalSettings = {
            type: 'alert',
            title: 'Error',
            body: 'An error occurred while suggesting the recipe.',
        };
        modalStore.trigger(modal);
    }
}
  
    async function fulfillListing(listingId: number, recipeName: string) {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
      try {
        const tokenId = await contract.getTokenIdByName(recipeName);
        const tx = await contract.fulfillListing(listingId, tokenId);
        await tx.wait();
        loadListings();
      } catch (error) {
        const modal: ModalSettings = {
            type: 'alert',
            // Data
            title: 'Listing Alert',
            body: 'This listing is not yours. You cannot fulfill a listing if its not yours.',
        };
        modalStore.trigger(modal);
      }
    }
  
    let recipeName: string = '';
  
    onMount(() => {
      loadListings();
    });
  </script>
  
  <main class='flex flex-col items-center justify-center '>
    <div class="bg-tertiary-600/80 p-5 rounded-lg">
      <div class='max-w-6xl justify-items-center my-10 flex flex-col items-center'>
        <h1 class="text-4xl font-bold mb-8 justify-center h1 text-center">Listings Gallery</h1>
        <button type="button" class="btn variant-filled mx-5 justify-items-center flex max-w-xl" on:click={createListing}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>        
          <span>Request for your own recipe!</span>
        </button>
      </div>
  
      <TreeView class="max-w-4xl justify-items-center my-4 grid grid-cols-1 p-5">
        <TreeViewItem class="w-max  bg-tertiary-800/100 p-5 rounded-lg">
          <h1 class="text-2xl font-bold mb-8 justify-center h1 text-center">Unfulfilled Listings</h1>
          <div class="grid grid-cols-2 w-max gap-5">
            {#each listingsWithRecipes as { listing, recipes }}
            {#if !listing.fulfilled}
              <TreeViewItem class="bg-secondary-400/100 rounded-lg text-black">
                <h2 class="text-xl">Listing {listing.id}: {listing.payment} ETH</h2>
                <svelte:fragment slot="children">
                  <TreeViewItem>
                    <h3 class="text-lg">Desired Ingredients</h3>
                    <svelte:fragment slot="children">
                      {#each listing.desiredIngredients as ingredient}
                        <TreeViewItem>
                          <p>{ingredient}</p>
                        </TreeViewItem>
                      {/each}
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <h3 class="text-lg">Max Steps</h3>
                    <svelte:fragment slot="children">
                      <TreeViewItem>
                        <p>{listing.maxSteps}</p>
                      </TreeViewItem>
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <h3 class="text-lg">Listing Owner</h3>
                    <svelte:fragment slot="children">
                      <TreeViewItem>
                        <p>{listing.poster}</p>
                      </TreeViewItem>
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <h3 class="text-lg">Suggested Recipes</h3>
                    <svelte:fragment slot="children">
                      {#each recipes as recipe}
                        <TreeViewItem>
                          {#if !recipe.placeholder}
                            <div class="card mx-5 my-5 p-5 bg-secondary-800/100 rounded-lg">
                              <header class="card-header text-center text-white">
                                  <h3 class='h3 text-xl font-bold'>{recipe.name}</h3>
                              </header>
                              <section class="p-4">
                                  <img src={recipe.imageUrl} alt={recipe.name} class="w-full h-40 object-cover" />
                              </section>
                              <footer class="card-footer text-center">
                                  <button type="button" class="btn variant-filled mx-5 justify-items-center flex " on:click={fulfillListing(listing.id, recipe.name)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <span>Fulfill listing</span>
                                  </button>
                              </footer>
                          </div>
                          {:else}
                            <p>No recipes suggested yet.</p>
                          {/if}
                        </TreeViewItem>
                      {/each}
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <button class='btn' on:click={() => suggestRecipe(listing.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      <span>Suggest a Recipe</span>
                    </button>
                  </TreeViewItem>
                </svelte:fragment>
              </TreeViewItem>
            {/if}
          {/each}
          </div>
        </TreeViewItem>
        <TreeViewItem class="w-max bg-tertiary-800/100 p-5 rounded-lg">
          <h1 class="text-2xl font-bold mb-8 justify-center h1 text-center">Fulfilled Listings</h1>
          <div class="grid grid-cols-2 w-max gap-5">
            {#each listingsWithRecipes as { listing, recipes }}
            {#if listing.fulfilled}
              <TreeViewItem class="bg-secondary-400/100 rounded-lg text-black">
                <h2 class="text-xl">Listing {listing.id}: {listing.payment} ETH</h2>
                <svelte:fragment slot="children">
                  <TreeViewItem>
                    <h3 class="text-lg">Desired Ingredients</h3>
                    <svelte:fragment slot="children">
                      {#each listing.desiredIngredients as ingredient}
                        <TreeViewItem>
                          <p>{ingredient}</p>
                        </TreeViewItem>
                      {/each}
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <h3 class="text-lg">Max Steps</h3>
                    <svelte:fragment slot="children">
                      <TreeViewItem>
                        <p>{listing.maxSteps}</p>
                      </TreeViewItem>
                    </svelte:fragment>
                  </TreeViewItem>
                  <TreeViewItem>
                    <h3 class="text-lg">Listing Owner</h3>
                    <svelte:fragment slot="children">
                      <TreeViewItem>
                        <p>{listing.poster}</p>
                      </TreeViewItem>
                    </svelte:fragment>
                  </TreeViewItem>
                </svelte:fragment>
              </TreeViewItem>
            {/if}
          {/each}
          </div>
        </TreeViewItem>
      </TreeView>
    </div>
    
  </main>
  