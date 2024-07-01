// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenExplorer is ERC721, Ownable {
    uint256 private _nextTokenId;
     uint256 public mintPrice = 0.05 ether;

    constructor(address initialOwner)
        ERC721("Garden Explorer", "EXPLORE")
        Ownable(initialOwner)
    {
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://QmZ6G4H4wjfx8gqEW6DwP6Ax1pfBCEUGGqheMwBic58EMj/gardenMetadata.json?nftId=";
    }
    
    function _transfer(from, to, tokenId) internal override {
        revert("Transfers are disabled");
        super._transfer(from, to, tokenId);
    }

    function safeMint() public payable {
        //make sure emough is sent before minting
        require(msg.value >= mintPrice, "Insufficient Ether sent");
        //make sure user doesnt own any
        require(balanceOf(msg.sender) == 0, "You already own a garden");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }
}
