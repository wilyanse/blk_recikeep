// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RecipeNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    uint256 public viewPrice = 0.01 ether; // Set a price to view the recipe
    uint256 public listingCounter;

    struct Recipe {
        string name;
        string[] ingredients;
        string[] steps;
        string imageUrl;
    }

    struct Listing {
        uint256 id;
        address poster;
        string[] desiredIngredients;
        uint256 maxSteps;
        uint256 payment;
        bool fulfilled;
    }

    mapping(uint256 => Recipe) public tokenIdToRecipe;
    mapping(uint256 => mapping(address => bool)) public hasPaidForViewing;
    mapping(string => uint256) public nameToTokenId; // Mapping from recipe name to token ID
    mapping(uint256 => uint256[]) public listingToRecipes;
    Listing[] public listings;

    constructor() ERC721("RecipeNFT", "RCP") Ownable(msg.sender) {
        tokenCounter = 0;
        listingCounter = 0;
    }

    function createRecipeNFT(
        string memory _name,
        string[] memory _ingredients,
        string[] memory _steps,
        string memory _imageUrl
    ) public onlyOwner {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);

        Recipe memory newRecipe = Recipe({
            name: _name,
            ingredients: _ingredients,
            steps: _steps,
            imageUrl: _imageUrl
        });

        tokenIdToRecipe[newTokenId] = newRecipe;
        nameToTokenId[_name] = newTokenId; // Store the mapping from name to token ID
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

    function getTokenIdByName(string memory _name) public view returns (uint256) {
        require(nameToTokenId[_name] != 0 || keccak256(abi.encodePacked(tokenIdToRecipe[0].name)) == keccak256(abi.encodePacked(_name)), "Recipe not found");
        return nameToTokenId[_name];
    }

    function createListing(string[] memory _desiredIngredients, uint256 _maxSteps) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        listings.push(Listing({
            id: listingCounter,
            poster: msg.sender,
            desiredIngredients: _desiredIngredients,
            maxSteps: _maxSteps,
            payment: msg.value,
            fulfilled: false
        }));
        
        listingCounter++;
    }

    function suggestRecipe(uint256 listingId, uint256 recipeTokenId) public {
        require(ownerOf(recipeTokenId) != listings[listingId].poster, "You cannot suggest a recipe for your own listing");
        listingToRecipes[listingId].push(recipeTokenId);
    }

    function fulfillListing(uint256 listingId, uint256 fulfilledRecipeId) public {
        Listing storage listing = listings[listingId];
        require(listing.poster == msg.sender, "Only the poster can fulfill the listing");
        require(!listing.fulfilled, "Listing already fulfilled");

        address recipeOwner = ownerOf(fulfilledRecipeId);
        require(recipeOwner != address(0), "Recipe does not exist");
        
        deleteAllOtherRecipes(listingId, fulfilledRecipeId);
        
        listing.fulfilled = true;
        payable(recipeOwner).transfer(listing.payment);
    }

    function deleteAllOtherRecipes(uint256 listingId, uint256 fulfilledRecipeId) private {
        uint256[] storage recipeIds = listingToRecipes[listingId];
        for (uint256 i = 0; i < recipeIds.length; i++) {
            if (recipeIds[i] != fulfilledRecipeId) {
                delete tokenIdToRecipe[recipeIds[i]];
            }
        }
        delete listingToRecipes[listingId];
    }

    function getAllListings() public view returns (Listing[] memory) {
        return listings;
    }

    function getRecipesByListing(uint256 listingId) public view returns (Recipe[] memory) {
        uint256[] storage recipeIds = listingToRecipes[listingId];
        Recipe[] memory recipes = new Recipe[](recipeIds.length);
        for (uint256 i = 0; i < recipeIds.length; i++) {
            recipes[i] = tokenIdToRecipe[recipeIds[i]];
        }
        return recipes;
    }
}
