// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./GardenExplorer.sol";
import "./GardenBadges.sol";
import "hardhat/console.sol";

/**
 * @title Garden Explorer Observations
 * @author x23202556
 * @notice ERC721 contract for minting and managing observation tokens.
 * These tokens are used to record observations made by users on the Garden Explorer platform.
 * Each observation token is associated with a checksum that can be used to verify the metadata integrity, useful for validating updates to the associated JSON.
 * The contract requires the user to have a Garden Explorer token balance which is used as an authentication before minting observation tokens is allowed.
 * The contract also checks for token balance milestones and rewards users with badges from an ERC1155 for reaching certain observation counts.
 */
contract Observation is ERC721, ERC721Enumerable, Ownable {
   /**
    * @dev The next token ID to be assigned. Incremented after mint.
    */
    uint256 private _nextTokenId = 0;
    /**
     * @dev The base URI for the metadata. 
     * TokenId gets concatenated to this string. Can be updated by owner/admin.
     */
    string private baseURI;
    /**
     * @dev The price to mint a new token. Can be updated by owner/admin.
     */
    uint256 private mintPrice = 0; 
    /**
     * @notice Mapping of token ID to metadata checksum. Used to verify metadata integrity. 
     */
    mapping(uint256 => bytes32) public checksums;
    /**
     * @dev The Garden Explorer contract. Used for authentication/permission to mint.
     */
    GardenExplorer private gardenExplorerContract;
    /**
     * @dev The Garden Badges contract. Used for rewarding users with badges for balance milestones.
     */
    GardenExplorerBadges private badgesContract;


    /**
     * @notice Constructor.
     * @param initialOwner  - owner of the contract
     * @param initialBaseURI - base uri for the metadata. will be concatenated with token id
     * @param gardenAuthContractAddress - address of the Garden Explorer contract. This is used as authentication for minting. 
     * @param badgeContractAddress - address of the Garden Badges contract. This is used as rewards for balance milestones. 
     */
    constructor(address initialOwner, string memory initialBaseURI, address gardenAuthContractAddress, address badgeContractAddress)
        ERC721("Garden Explorer Observation", "OBSERVE")
        Ownable(initialOwner)
    {
        gardenExplorerContract = GardenExplorer(gardenAuthContractAddress);
        badgesContract = GardenExplorerBadges(badgeContractAddress);
        baseURI = initialBaseURI;
    }

/**
 * @notice Internal function. Returns the base URI for the metadata. 
 * Uses the local variable baseURI. Can be updated by owner/admin.
 */
    function _baseURI() internal view override returns (string memory) {
        //returns local variable - can be updated by setBaseUri
        return baseURI;
    }

    /**
     * 
     * @notice User function. Mints a new token to the sender, sets the metadata checksum, and checks for badge milestones.
     * Requires that the sender owns a Garden Explorer token.
     * @param mintTo - address to mint the token to
     * @param metadataChecksum  metadata checksum. Used to verify metadata integrity.
     */
    function createObservation(address mintTo, bytes32 metadataChecksum) public {
        //make sure user has a garden
        require(gardenExplorerContract.balanceOf(mintTo) > 0, "You must own a Garden Explorer token to mint an observation");
       //ensure this contract has permission to transfer badges on behalf of the minter

        _safeMint(mintTo, _nextTokenId);
        checksums[_nextTokenId] = metadataChecksum;
         checkBadgeMilestone(mintTo);
        _nextTokenId++;
    }


    /**
     * 
     * @notice Internal function. Checks if the account has reached a balance milestone and transfers the badge if so.
     * Balance milestones are: 1, 3, 5, 10, 20, 30, 50, 75 and 100.
     * @param minter address of the account to check
     */
    function checkBadgeMilestone(address minter) private {
        uint256 observationCount = balanceOf(minter);
        console.log("Observation count: ", observationCount);
        if(observationCount == 1) {
            if(!badgesContract.hasBadge(minter,1)) {
                console.log("awarding badge 1");
                badgesContract.awardBadge(minter,1);
            }
        } else if(observationCount == 3) {
            if(!badgesContract.hasBadge(minter,2)) {
                console.log("awarding badge 2");
                badgesContract.awardBadge(minter,2);
            }
        } else if(observationCount == 5) {
            if(!badgesContract.hasBadge(minter,3)) {
                console.log("awarding badge 3");
                badgesContract.awardBadge(minter,3);
            }
        } else if(observationCount == 10) {
            if(!badgesContract.hasBadge(minter,4)) {
                badgesContract.awardBadge(minter,4);
            }
        } else if(observationCount == 20) {
            if(!badgesContract.hasBadge(minter,5)) {
                badgesContract.awardBadge(minter,5);
            }
        } else if(observationCount == 30) {
            if(!badgesContract.hasBadge(minter,6)) {
                badgesContract.awardBadge(minter,6);
            }
        } else if(observationCount == 50) {
            if(!badgesContract.hasBadge(minter,7)) {
                badgesContract.awardBadge(minter,7);
            }
        } else if(observationCount == 75) {
            if(!badgesContract.hasBadge(minter,8)) {
                badgesContract.awardBadge(minter,8);
            }
        } else if(observationCount == 100) {
            if(!badgesContract.hasBadge(minter,9)) {
                badgesContract.awardBadge(minter,9);
            }
        }
    }

    /**
     * 
     * @notice Owner/Admin function. Updates the base URI for the metadata.
     * @param newBaseURI - new base URI to set
     */
    function setBaseUri(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    /**
     * 
     * @notice User function. Returns the base URI for the metadata.
     * @return baseURI for the metadata
     */
    function getBaseUri() public view returns (string memory) {
        return baseURI;
    }

    /**
     * 
     * @notice Owner/Admin function. Updates the Garden Explorer contract address.
     * @param newGardenExplorer - new Garden Explorer contract address
     */
    function updateGardenExplorer(address newGardenExplorer) public onlyOwner {
        gardenExplorerContract = GardenExplorer(newGardenExplorer);
    }

    /**
     * 
     * @notice Owner/Admin function. Updates the Garden Badges contract address.
     * @param newMintPrice - new Garden Badges contract address
     */
    function setMintPrice(uint256 newMintPrice) public onlyOwner {
        mintPrice = newMintPrice;
    }

    /**
     * 
     * @notice user function. when metadata updates, the checksum can be updated to verify the metadata integrity.
     * @param tokenId - token ID that the checksum is associated with
     * @param newChecksum - new checksum to set. 
     */
    function updateChecksum(uint256 tokenId, bytes32 newChecksum) public {
        require(_ownerOf(tokenId) == msg.sender, "Caller is not the owner of this ID. Cannot update checksum.");
        checksums[tokenId] = newChecksum;
    }

    /**
     * 
     * @notice User function. Returns the checksum for a given token ID.
     * This can be used to verify the metadata integrity from the storage location.
     * @param tokenId - token ID to get the checksum for
     * @return checksum for the token ID
     */
    function getChecksum(uint256 tokenId) public view returns (bytes32) {
        return checksums[tokenId];
    }

    /**
     * 
     * @notice User function. Checks if the checksum for a given token ID matches the provided checksum.
     * @param tokenId - token ID to check associated checksum
     * @param checksum - checksum to compare
     * @return true if the checksums match
     */
    function doesChecksumMatch(uint256 tokenId, bytes32 checksum) public view returns (bool) {
        return checksums[tokenId] == checksum;
    }

    /**
     * 
     * @notice User function. Returns token IDs owned by an address.
     * @param owner - address of the owner to get the tokens for
     * @return array of token IDs owned by the address
     */
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

    /**
     * 
     * @notice Owner/Admin function. Updates the Garden Badges contract address.
     * @param newGardenExplorerAddress - address of the new Garden Badges contract
     */
    function setGardenAuthContractAddress(address newGardenExplorerAddress) public onlyOwner {
        gardenExplorerContract = GardenExplorer(newGardenExplorerAddress);
    }

    /**
     * 
     * @notice Owner/Admin function. Updates the Garden Badges contract address.
     * @param newBadgeContract - address of the new Garden Badges contract
     */
    function setBadgeContractAddress(address newBadgeContract) public onlyOwner {
        badgesContract = GardenExplorerBadges(newBadgeContract);
    }

    /**
     * 
     * @notice Internal function. Required for ERC721Enumerable. 
     * @param to - address to transfer to
     * @param tokenId - token ID to transfer
     * @param auth - address of the account to check
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /**
     * 
     * @notice Internal function. Required for ERC721Enumerable.
     * @param account - address of the account to check
     * @param value - value to increase the balance by
     */
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /**
     * 
     * @notice Required for ERC721Enumerable.
     * @param interfaceId - interface ID to check
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}