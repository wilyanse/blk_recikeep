// scripts/deploy.js

async function main() {
  // Get the contract to deploy

  const recipeNFT = await await hre.ethers.deployContract("RecipeNFT");
  await recipeNFT.waitForDeployment();
  console.log(`Contract deployed to ${recipeNFT.target}`);
  // Sample data for recipes
  const sampleRecipes = [
    {
      name: "Canned Tuna Pasta",
      ingredients: ["200g / 7oz spaghetti", "1 tbsp cooking salt" , "285g/ 10 oz (approx) canned tuna in oil" , "2 clove garlic" , "2 anchovy fillets", "1/2 tsp chilli flakes / red pepper flakes", "2 tsp baby capers", "1 tbsp parsley", "1 tsp lemon zest", "2 tbsp lemon juice", "1/4 tsp cooking/kosher salt", "1/4 tsp black pepper"],
      steps: ["Bring 3 litres / 3 quarts of water to the boil with the 1 tablespoon of salt. Cook pasta per the packet time minus 1 minute. Just before draining, scoop out ~1 cup pasta cooking water, then drain the pasta.", "Heat the reserved oil from the tuna cans over medium heat. Add the garlic and anchovies and chilli flakes. Cook and stir for 1 minute.", "Add the pasta and capers and 1/3 cup of reserved pasta water. Toss using 2 spatulas for 2 minutes.", "Turn off the heat. Add tuna and parsley and lemon zest and juice and salt and pepper. Toss gently to mix through – try to keep some tuna chunks.", "Serve immediately!"],
      imageUrl: "https://www.recipetineats.com/wp-content/uploads/2023/04/Canned-tuna-pasta_3.jpg?resize=650,813"
    },
    {
      name: "Ginisang Corned Beef",
      ingredients: ["2 tbsp Vegetable Oil", "4 cloves Garlic", "1 pc Potato", "1 can Corned Beef", "1 pc Onion", "0.5 sachet MAGGI Magci Sarap 8g"],
      steps: ["Sauté garlic in oil until golden brown.", "Add potato and cook until light golden brown. Add corned beef.", "Add onion and season with MAGGI® MAGIC SARAP®. Transfer on a serving plate and serve."],
      imageUrl: "https://images.aws.nestle.recipes/resized/d7e7bf512bf7d0f868377d5facea3ed0_nksb05s3-d03_7876_708_600.jpg"
    },
    {
      name: "Mung Bean Soup",
      ingredients: ["2 cups dry monggo beans", "6 cups vegetable broth", "1 tablespoon oil", "1 onion", "2 cloves garlic", "1 tablespoons freshly grated ginger", "1 cup coconut milk", "1 bunch chopped or pulled malunggay leaves", "salt to taste"],
      steps: ["Bring the broth to a boil in a large pot. Add the rinsed monggo beans and cook, uncovered, for about 40 minutes. I checked on mine every 10 minutes and added more water as needed (mine needed more water every time I checked it). You want the consistency to be like a very thick soup.", "Heat the oil in a large skillet over medium heat. Saute the onion, garlic, and ginger in the oil in a large nonstick skillet until soft and fragrant, about 3 minutes. Add to the monggo pot and allow the mixture to simmer together for a few minutes.", "Stir in the coconut milk and malunggay leaves. Remove the monggo pot from the heat. It just needs to be hot enough to very slightly wilt the leaves. Serve over rice or plain, like a soup."],
      imageUrl: "https://pinchofyum.com/wp-content/uploads/2013/04/monggo-soup-3.jpg"
    }
  ];

  // Sample data for listings
  const sampleListings = [
    {
      desiredIngredients: ["Chicken", "Garlic", "Lemon"],
      maxSteps: 5,
      payment: ethers.parseEther("0.1")
    },
    {
      desiredIngredients: ["Tomato", "Basil", "Mozzarella"],
      maxSteps: 3,
      payment: ethers.parseEther("0.05")
    }
  ];

  // Create sample recipes
  for (const recipe of sampleRecipes) {
    await recipeNFT.createRecipeNFT(recipe.name, recipe.ingredients, recipe.steps, recipe.imageUrl);
    console.log(`Created recipe NFT: ${recipe.name}`);
  }

  // Create sample listings
  for (const listing of sampleListings) {
    await recipeNFT.createListing(listing.desiredIngredients, listing.maxSteps, { value: listing.payment });
    console.log(`Created listing with desired ingredients: ${listing.desiredIngredients.join(", ")}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
