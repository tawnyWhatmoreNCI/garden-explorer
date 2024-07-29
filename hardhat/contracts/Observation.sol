// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Observation is ERC721, ERC721Enumerable, Ownable {
    //sister contract address for badges which is an erc 1155
    address private gardenAuthContract;
    address private badgeContract;

    //next token id - used for minting
    uint256 private _nextTokenId = 0;
    //garden explorer contract address - cannot mint if user does not own one. 
    address private gardenExplorer;
    //can be updated by the owner. 
    string private baseURI;
    //minting is free, but in case we want to charge for it in the future
    uint256 private mintPrice = 0; 
    //checksum mapping per token id. for validating the metadata validity
    mapping(uint256 => bytes32) public checksums;

    constructor(address initialOwner, string memory initialBaseURI, address gardenAuthContractAddress, address badgeContractAddress)
        ERC721("Garden Explorer Observation", "OBSERVE")
        Ownable(initialOwner)
    {
        gardenAuthContract = gardenAuthContractAddress;
        badgeContract = badgeContractAddress;
        baseURI = initialBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        //returns local variable - can be updated by setBaseUri
        return baseURI;
    }

    //main function that users will call. mints new token and sets metadata checksum. 
    //checks users balance. if they have met a badge milestone, the badge 1155 contract transfers the badge to the user.
    function safeMint(address mintTo, bytes32 metadataChecksum) public {
        //require(gardenExplorer != address(0), "Observation: garden explorer not set");
        _safeMint(mintTo, _nextTokenId);
        updateChecksum(_nextTokenId, metadataChecksum);
        //increment token Id
        _nextTokenId++;
       //todo: figure out how to call badge contract for milestone. hardcode for now. 
       if (balanceOf(mintTo) == 1) { //TODO:
        //hooray an initial observation from this user, send a badge their way. 
        //need to call the function signature for transferring the badge. 
        //badgeContract.call(abi.encodeWithSignature("transferTo(address, uint256,address)", address(this),1, mintTo));
       }
    }

    function setBaseUri(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    function updateGardenExplorer(address newGardenExplorer) public onlyOwner {
        gardenExplorer = newGardenExplorer;
    }

    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    function updateChecksum(uint256 tokenId, bytes32 newChecksum) public {
        require(_ownerOf(tokenId) == msg.sender, "Caller is not the owner of this ID. Cannot update checksum.");
        checksums[tokenId] = newChecksum;
    }

    function getChecksum(uint256 tokenId) public view returns (bytes32) {
        return checksums[tokenId];
    }

    function doesChecksumMatch(uint256 tokenId, bytes32 checksum) public view returns (bool) {
        return checksums[tokenId] == checksum;
    }

        // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function ownersTokens(address owner) public view returns (uint256[] memory) {
    uint256 tokenCount = balanceOf(owner);
    uint256[] memory tokenIds = new uint256[](tokenCount);
    for (uint256 i = 0; i < tokenCount; i++) {
        tokenIds[i] = tokenOfOwnerByIndex(owner, i);
    }
    return tokenIds;
}

    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }

    //pair with sister contract for balance/authentication
    function setGardenAuthContractAddress(address newGardenAuthContract) public onlyOwner {
        gardenAuthContract = newGardenAuthContract;
    }

    //pair with sister contract for badges 
    function setBadgeContractAddress(address newBadgeContract) public onlyOwner {
        badgeContract = newBadgeContract;
    }

    //would i need another function to adjust call signature? 


}