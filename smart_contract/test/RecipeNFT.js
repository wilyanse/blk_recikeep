const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RecipeNFT", function () {
  let recipeNFT;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    recipeNFT = await hre.ethers.deployContract("RecipeNFT");
    await recipeNFT.waitForDeployment();
    console.log(`\tContract deployed to ${recipeNFT.target}`);
  });

  it("Should create and retrieve a recipe NFT", async function () {
    const ingredients = ["Ingredient1", "Ingredient2"];
    const steps = ["Step1", "Step2"];
    const imageUrl = "http://example.com/image.png";

    await recipeNFT.createRecipeNFT("Recipe1", ingredients, steps, imageUrl);

    const recipe = await recipeNFT.getRecipe(0);
    expect(recipe.name).to.equal("Recipe1");
    expect(recipe.ingredients).to.eql(ingredients);
    expect(recipe.steps).to.eql(steps);
    expect(recipe.imageUrl).to.equal(imageUrl);
  });

  it("Should allow payment to view a recipe", async function () {
    const ingredients = ["Ingredient1", "Ingredient2"];
    const steps = ["Step1", "Step2"];
    const imageUrl = "http://example.com/image.png";
  
    await recipeNFT.createRecipeNFT("Recipe1", ingredients, steps, imageUrl);
  
    // addr1 pays to view the recipe
    await recipeNFT.connect(addr1).payToViewRecipe(0, { value: ethers.parseEther("0.01") });
  
    const hasPaid = await recipeNFT.hasPaidForViewing(0, addr1.address);
    expect(hasPaid).to.be.true;
  
    const recipe = await recipeNFT.connect(addr1).getRecipe(0);
    expect(recipe.name).to.equal("Recipe1");
    expect(recipe.ingredients).to.eql(ingredients);
    expect(recipe.steps).to.eql(steps);
    expect(recipe.imageUrl).to.equal(imageUrl);
  });

  it("Should create and fulfill a listing", async function () {
    const desiredIngredients = ["Ingredient1", "Ingredient2"];
    const maxSteps = 5;
    const payment = ethers.parseEther("1");

    await recipeNFT.connect(addr1).createListing(desiredIngredients, maxSteps, { value: payment });

    const ingredients = ["Ingredient1", "Ingredient2"];
    const steps = ["Step1", "Step2"];
    const imageUrl = "http://example.com/image.png";

    await recipeNFT.createRecipeNFT("Recipe1", ingredients, steps, imageUrl);

    await recipeNFT.connect(addr2).fulfillListing(0, 0);

    const listing = await recipeNFT.listings(0);
    expect(listing.fulfilled).to.be.true;
  });
});