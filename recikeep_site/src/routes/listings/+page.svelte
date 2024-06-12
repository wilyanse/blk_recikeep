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
        "0x32E00984c50397a8f9417aE0FDb08A1ce1E2c46c",
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
  
    async function loadListings() {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);

      const [names, images] = await contract.getAllRecipeNamesAndImages();
      console.log(names);
      for (const name of names) {
        flavorOptions.push({ label: name, value: name});
      }
      console.log(flavorOptions);
      try {
        listings = await contract.getAllListings();
        for (const listing of listings) {
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
          listingsWithRecipes = [...listingsWithRecipes, { listing, recipes: recipeData }];
        }
      } catch (error) {
        console.error("Error loading listings:", error);
      }
      console.log("Listings with recipes:", listingsWithRecipes);
    }
  
    async function createListing() {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
  
      const ingredientsArray = desiredIngredients.split(',').map(ing => ing.trim());
      const paymentInWei = ethers.parseEther(payment);
      const tx = await contract.createListing(ingredientsArray, maxSteps, { value: paymentInWei });
      await tx.wait();
      loadListings(); // Reload listings after creation
    }

    let popupSettings: PopupSettings = {
        event: 'focus-click',
        target: 'popupAutocomplete',
        placement: 'bottom',
    };

    let inputPopupDemo: string = '';
    import { popup } from '@skeletonlabs/skeleton';
    import type { PopupSettings } from '@skeletonlabs/skeleton';

    
    let flavorOptions: AutocompleteOption<string>[] = [];
				
    let images: string[] = [];
			
    const modalStore = getModalStore();

    async function suggestRecipe(listingId: number, recipeName: string) {
        const { ethereum } = window as any;
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const contract = await initializeContract(signer);

        try {
            const tokenId = await contract.getTokenIdByName(recipeName);
            const tx = await contract.suggestRecipe(listingId, tokenId);
            await tx.wait();
            loadListings(); // Reload listings after suggestion
        } catch (error) {
            const modal: ModalSettings = {
                type: 'alert',
                // Data
                title: 'Listing Alert',
                body: 'This listing is yours. You cannot suggest a recipe for your own listing.',
            };
            modalStore.trigger(modal);
        };

    }
    
    function onPopupDemoSelect(event: CustomEvent<AutocompleteOption<string>>): void {
        inputPopupDemo = event.detail.label;
    }

    function onTreeViewGroupChange(): void {
        inputPopupDemo = '';
    }
  
    async function fulfillListing(listingId: number, recipeName: string) {
      const { ethereum } = window as any;
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = await initializeContract(signer);
  
      const tokenId = await contract.getTokenIdByName(recipeName);
      const tx = await contract.fulfillListing(listingId, tokenId);
      await tx.wait();
      loadListings(); // Reload listings after fulfillment
    }
  
    let recipeName: string = '';
  
    onMount(() => {
      loadListings();
    });
  </script>
  
  <main>
    <h1>Recipe Listings</h1>
    <button class='btn' >Create Listing</button>
    <TreeView>
      <TreeViewItem>
        <h1>Unfulfilled Listings</h1>
        {#each listingsWithRecipes as { listing, recipes }}
          {#if !listing.fulfilled}
            <TreeViewItem>
              <h2>Listing {listing.id}: {listing.payment} ETH</h2>
              <svelte:fragment slot="children">
                <TreeViewItem>
                  <h3>Desired Ingredients</h3>
                  <svelte:fragment slot="children">
                    {#each listing.desiredIngredients as ingredient}
                      <TreeViewItem>
                        <p>{ingredient}</p>
                      </TreeViewItem>
                    {/each}
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                  <h3>Max Steps</h3>
                  <svelte:fragment slot="children">
                    <TreeViewItem>
                      <p>{listing.maxSteps}</p>
                    </TreeViewItem>
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                  <h3>Listing Owner</h3>
                  <svelte:fragment slot="children">
                    <TreeViewItem>
                      <p>{listing.poster}</p>
                    </TreeViewItem>
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                  <h3>Suggested Recipes</h3>
                  <svelte:fragment slot="children">
                    {#each recipes as recipe}
                      <TreeViewItem>
                        <p>{recipe.name}</p>
                        {#if !recipe.placeholder}
                          <img src='{recipe.imageUrl}' alt={recipe.name} />
                        {/if}
                      </TreeViewItem>
                    {/each}
                    <!-- TODO: insert code for button fulfill listing if owner -->
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                    <input
                        class="input autocomplete"
                        type="search"
                        name="autocomplete-search"
                        bind:value={inputPopupDemo}
                        placeholder="Search..."
                        use:popup={popupSettings}
                    />
                    <div data-popup="popupAutocomplete">
                        <Autocomplete
                            bind:input={inputPopupDemo}
                            options={flavorOptions}
                            on:selection={onPopupDemoSelect}
                        />
                    </div>
                    <button class='btn' on:click={() => suggestRecipe(listing.id, inputPopupDemo)}>Suggest this Recipe</button>
                  </TreeViewItem>
              </svelte:fragment>
            </TreeViewItem>
          {/if}
        {/each}
      </TreeViewItem>
      <TreeViewItem>
        <h1>Fulfilled Listings</h1>
        {#each listingsWithRecipes as { listing, recipes }}
          {#if listing.fulfilled}
            <TreeViewItem>
              <h2>Listing {listing.id}: {listing.payment} ETH</h2>
              <svelte:fragment slot="children">
                <TreeViewItem>
                  <h3>Desired Ingredients</h3>
                  <svelte:fragment slot="children">
                    {#each listing.desiredIngredients as ingredient}
                      <TreeViewItem>
                        <p>{ingredient}</p>
                      </TreeViewItem>
                    {/each}
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                  <h3>Max Steps</h3>
                  <svelte:fragment slot="children">
                    <TreeViewItem>
                      <p>{listing.maxSteps}</p>
                    </TreeViewItem>
                  </svelte:fragment>
                </TreeViewItem>
                <TreeViewItem>
                  <h3>Listing Owner</h3>
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
      </TreeViewItem>
    </TreeView>
  </main>
  