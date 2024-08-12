// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title Garden Explorer
 * @author x23202556
 * @notice ERC721 contract used as an authentication token for the Garden Explorer platform.
 * A user must own one of these tokens to be able to mint observation tokens.
 * The token is minted to the user when they pay the minting fee.
 */
contract GardenExplorer is ERC721, Ownable {
    uint256 private _nextTokenId;
     uint256 public mintPrice = 0.05 ether;
     string private baseURI;


    /**
     * @notice Constructor.
     * @param initialOwner  - owner of the contract
     * @param initialBaseURI - base uri for the metadata
     */
    constructor(address initialOwner, string memory initialBaseURI)
        ERC721("Garden Explorer", "EXPLORE")
        Ownable(initialOwner)
    {
        baseURI = initialBaseURI;
    }

    /**
     * @notice Internal function. Returns the base URI for the metadata.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @notice User function. Mints a new token to the sender.
     * Requires that the sender has not already minted a token.
     * Requires that the sender has sent enough ether to cover the minting cost.
     */
    function safeMint() public payable {
        //make sure emough is sent before minting
        require(msg.value >= mintPrice, "Insufficient Ether sent");
        //make sure user doesnt own any
        require(balanceOf(msg.sender) == 0, "You already own a garden");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    /**
     * @notice Owner/Admin function. Updates the base URI for the metadata.
     * @param newBaseURI - new base URI to set
     */
    function updateBaseUri(string memory newBaseURI) public onlyOwner { 
        baseURI = newBaseURI;
    }
}