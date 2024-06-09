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

    const recipe: RecipeData = {
      name: recipeName,
      ingredients: ingredientsArray,
      steps: stepsArray,
      imageUrl: imageUrl
    };

    // Submit the recipe as an NFT
    await contract.createRecipeNFT(recipe.name, recipe.ingredients, recipe.steps, recipe.imageUrl);

    // Clear form fields after submission
    recipeName = '';
    ingredients = [''];
    steps = [''];
    imageUrl = '';
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
      // Display recipe data as needed
    } catch (error) {
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
  interface Listing {
    id: number;
    poster: string;
    desiredIngredients: string[];
    maxSteps: number;
    payment: string;
    fulfilled: boolean;
  };

  let listings: Listing[] = [];
  let desiredIngredients = "";
  let maxSteps = 0;
  let payment = "";

  async function loadListings() {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);
    try {
      listings = await contract.getAllListings();
      for (const listing of listings) {
        const recipeData = await contract.getRecipesByListing(listing.id);
        const recipes = recipeData.map((recipe: any) => ({
          name: recipe.name,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          imageUrl: recipe.imageUrl
      }));
    }} catch (error) {
      console.error("Error loading listings:", error);
    }
    console.log(listings);
    console.log(contract.listingToRecipes);
  }

  async function createListing() {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);

    const ingredientsArray = desiredIngredients.split(',').map(ing => ing.trim());
    const paymentInWei = ethers.parseEther(payment);
    const tx = await contract.createListing(ingredientsArray, maxSteps, { value: paymentInWei });
    await tx.wait();
  }

  async function suggestRecipe(listingId: number, recipeName: string) {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);

    const tokenId = await contract.getTokenIdByName(recipeName);
    const tx = await contract.suggestRecipe(listingId, tokenId);
    await tx.wait();
  }

  async function fulfillListing(listingId: number, recipeName: string) {
    const { ethereum } = window as any;
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = await initializeContract(signer);
    const account = await provider.send("eth_accounts", []);

    const tokenId = await contract.getTokenIdByName(recipeName);
    const tx = await contract.fulfillListing(listingId, tokenId);
    await tx.wait();
  }

</script>

<main>
  <button on:click={connectWallet}>Connect Wallet</button>
  <div>
  <!-- Display recipe creation form -->
  <h1>Recipe Gallery</h1>

  <button on:click={fetchRecipes}>Fetch Recipes</button>

  {#if recipes.length > 0}
    {#each recipes as recipe}
      <div>
        <h2>{recipe.name}</h2>
        <img src="{recipe.imageUrl}" alt="{recipe.name}" />
        <button on:click={() => viewRecipe(recipe.name, recipe.id)}>View Recipe</button>
        {#if errorMessages[recipe.id]}
          <div>
            <p>{errorMessages[recipe.id]}</p>
            <button on:click={() => payToViewRecipe(recipe.name, recipe.id)}>Get Recipe</button>
          </div>
        {/if}
        {#if recipe.ingredients.length > 0}
          <ul>
            {#each recipe.ingredients as ingredient}
              <li>{ingredient}</li>
            {/each}
          </ul>
        {/if}
        {#if recipe.steps.length > 0}
          <ol>
            {#each recipe.steps as step}
              <li>{step}</li>
            {/each}
          </ol>
        {/if}
      </div>
    {/each}
  {:else}
    <p>No recipes found</p>
  {/if}

  <div>
    <button on:click={() => showModal = true}>Create Recipe</button>
  </div>

  {#if showModal}
    <div>
      <input type="text" bind:value={recipeName} placeholder="Recipe Name" />
      <input type="text" bind:value={imageUrl} placeholder="Image URL" />
      
      <h3>Ingredients</h3>
      {#each ingredients as ingredient, index}
        <input type="text" bind:value={ingredients[index]} placeholder="Ingredient" />
      {/each}
      <button on:click={() => ingredients = [...ingredients, '']}>Add Ingredient</button>
      
      <h3>Steps</h3>
      {#each steps as step, index}
        <input type="text" bind:value={steps[index]} placeholder="Step" />
      {/each}
      <button on:click={() => steps = [...steps, '']}>Add Step</button>

      <button on:click={createRecipeNFT}>Submit</button>
    </div>
  {/if}

  <h1>Recipe Listings</h1>
  <button on:click={loadListings}>Fetch Recipes</button>
  <!-- Display Listings -->
  <div>
    {#each listings as listing}
      <div class="listing">
        <h2>Listing {listing.id}</h2>
        <p>Poster: {listing.poster}</p>
        <p>Desired Ingredients: {listing.desiredIngredients.join(', ')}</p>
        <p>Max Steps: {listing.maxSteps}</p>
        <p>Payment: {listing.payment} ETH</p>
        <p>Fulfilled: {listing.fulfilled ? 'Yes' : 'No'}</p>

        <h3>Recipes</h3>
        {#if listing.recipes && listing.recipes.length > 0}
          <ul>
            {#each listing.recipes as recipe}
              <li>
                <p><strong>Name:</strong> {recipe.name}</p>
                <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
                <p><strong>Steps:</strong> {recipe.steps.join(', ')}</p>
                <p><strong>Image:</strong> <img src={recipe.imageUrl} alt={recipe.name} width="100"/></p>
              </li>
            {/each}
          </ul>
        {:else}
          <p>No recipes suggested yet.</p>
        {/if}

        {#if !listing.fulfilled}
          <input type="text" placeholder="Recipe Name" bind:value={recipeName} />
          <button on:click={() => suggestRecipe(listing.id, recipeName)}>Suggest Recipe</button>
          <button on:click={() => fulfillListing(listing.id, recipeName)}>Fulfill Listing</button>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Create Listing -->
  <div>
    <h2>Create Listing</h2>
    <input type="text" placeholder="Desired Ingredients (comma separated)" bind:value={desiredIngredients} />
    <input type="number" placeholder="Max Steps" bind:value={maxSteps} />
    <input type="text" placeholder="Payment in ETH" bind:value={payment} />
    <button on:click={createListing}>Create Listing</button>
  </div>

</main>