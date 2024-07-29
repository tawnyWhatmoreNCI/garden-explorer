// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenExplorer is ERC721, Ownable {
    uint256 private _nextTokenId;
     uint256 public mintPrice = 0.05 ether;
     string private baseURI;

    constructor(address initialOwner, string memory initialBaseURI)
        ERC721("Garden Explorer", "EXPLORE")
        Ownable(initialOwner)
    {
        baseURI = initialBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function safeMint() public payable {
        //make sure emough is sent before minting
        require(msg.value >= mintPrice, "Insufficient Ether sent");
        //make sure user doesnt own any
        require(balanceOf(msg.sender) == 0, "You already own a garden");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function updateBaseUri(string memory newBaseURI) public onlyOwner { 
        baseURI = newBaseURI;
    }

     //TODO: Disable transfers
}