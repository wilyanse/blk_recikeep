// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RecipeNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public viewPrice = 0.01 ether; // Set a price to view the recipe

    struct Recipe {
        string name;
        string[] ingredients;
        string[] steps;
        string imageUrl;
    }

    struct Listing {
        address poster;
        string[] desiredIngredients;
        uint256 maxSteps;
        uint256 payment;
        bool fulfilled;
    }

    mapping(uint256 => Recipe) public tokenIdToRecipe;
    mapping(uint256 => mapping(address => bool)) public hasPaidForViewing;
    Listing[] public listings;

    constructor() ERC721("RecipeNFT", "RCP") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function createRecipeNFT(
        string memory _name,
        string[] memory _ingredients,
        string[] memory _steps,
        string memory _imageUrl,
        string memory _tokenURI
    ) public onlyOwner {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        Recipe memory newRecipe = Recipe({
            name: _name,
            ingredients: _ingredients,
            steps: _steps,
            imageUrl: _imageUrl
        });

        tokenIdToRecipe[newTokenId] = newRecipe;
        tokenCounter++;
    }

    function payToViewRecipe(uint256 tokenId) public payable {
        require(msg.value == viewPrice, "Incorrect price sent");
        hasPaidForViewing[tokenId][msg.sender] = true;
    }

    function getRecipe(uint256 tokenId) public view returns (Recipe memory) {
        require(hasPaidForViewing[tokenId][msg.sender] || ownerOf(tokenId) == msg.sender, "You have not paid to view this recipe");
        return tokenIdToRecipe[tokenId];
    }

    function getAllRecipeNamesAndImages() public view returns (string[] memory, string[] memory) {
        uint256 totalRecipes = tokenCounter;
        string[] memory recipeNames = new string[](totalRecipes);
        string[] memory recipeImages = new string[](totalRecipes);

        for (uint256 i = 0; i < totalRecipes; i++) {
            recipeNames[i] = tokenIdToRecipe[i].name;
            recipeImages[i] = tokenIdToRecipe[i].imageUrl;
        }

        return (recipeNames, recipeImages);
    }

    function createListing(string[] memory _desiredIngredients, uint256 _maxSteps) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        listings.push(Listing({
            poster: msg.sender,
            desiredIngredients: _desiredIngredients,
            maxSteps: _maxSteps,
            payment: msg.value,
            fulfilled: false
        }));
    }

    function fulfillListing(uint256 listingId, uint256 recipeTokenId) public {
        Listing storage listing = listings[listingId];
        require(!listing.fulfilled, "Listing already fulfilled");
        Recipe memory recipe = tokenIdToRecipe[recipeTokenId];

        // Check if the recipe matches the listing criteria
        require(recipe.steps.length <= listing.maxSteps, "Recipe has too many steps");
        for (uint256 i = 0; i < listing.desiredIngredients.length; i++) {
            bool ingredientFound = false;
            for (uint256 j = 0; j < recipe.ingredients.length; j++) {
                if (keccak256(abi.encodePacked(recipe.ingredients[j])) == keccak256(abi.encodePacked(listing.desiredIngredients[i]))) {
                    ingredientFound = true;
                    break;
                }
            }
            require(ingredientFound, "Recipe does not have all desired ingredients");
        }

        listing.fulfilled = true;
        payable(msg.sender).transfer(listing.payment);
    }

    function getAllListings() public view returns (Listing[] memory) {
        return listings;
    }
}
