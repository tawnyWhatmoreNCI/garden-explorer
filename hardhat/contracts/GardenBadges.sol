// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GardenExplorerBadges is ERC1155, Ownable {
    //max badge id - used for validation
    uint256 public constant MAX_BADGE_ID = 5;

    //oBadge collection - for Observations 
   //Badges for observations made
    uint256 public constant OBADGE_ROOKIE_OBSERVER = 0;
    //a badge for 10 observations made 
    uint256 public constant OBADGE_KEEN_WATCHER = 1;
    //a badge for 25 observations made
    uint256 public constant OBADGE_SHARP_EYED = 2;
    //a badge for 50 observations made
    uint256 public constant OBADGE_SEASON_SPOTTER = 3;
    //a badge for 100 observations made
    uint256 public constant OBADGE_EXPERIENCED_TRACKER = 4;
    //a badge for 250 observations made
    uint256 public constant OBADGE_MASTER_OBSERVER = 5;

    //iBadge collection - for Identification 
    //TODO: Badges for identification efforts

    //rBadge collection - for Rating
    //TODO: Badges for rating efforts

    constructor(address initialOwner) ERC1155("") Ownable(initialOwner) {
        _mint(initialOwner, OBADGE_ROOKIE_OBSERVER, 10**5 , "");
        _mint(initialOwner, OBADGE_KEEN_WATCHER, 10**5, "");
        _mint(initialOwner, OBADGE_SHARP_EYED, 10**5, "");
        _mint(initialOwner, OBADGE_SEASON_SPOTTER, 10**5, "");
        _mint(initialOwner, OBADGE_EXPERIENCED_TRACKER, 10**5, "");
    }

    //mint more badges to the owner - could. do this if supply theoritically became low.
    function mint(uint256 id, uint256 amount, bytes memory data) public onlyOwner {
        require(id <= OBADGE_MASTER_OBSERVER, "GardenExplorerBadges: Invalid badge id");
        _mint(owner(), id, amount, data);
    }

}