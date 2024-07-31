// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title Garden Explorer Badge Collection 
 * @author x23202556
 * @notice ERC1155 contract for minting and managing badges. 
 * These are used as a reward for users who have made a certain number of 
 * observations on the Garden Explorer platform.
 */  
contract GardenExplorerBadges is ERC1155, Ownable {
    //last badge id
    uint256 public NEXT_BADGE_ID = 0;
    //badge names
    mapping(uint256 => string) public badgeNames;

    /**
     * 
     * @notice Constructor. Mints 10000 of each of 
     * an initial set of badges. 
     * 
     * @param initialOwner - owner of the contract
     * @param uri - base uri for the metadata
     * 
     * Mint initial badge supplies to the owner. 
     * Map badge id to badge name in public mapping. 
     */
    constructor(address initialOwner, string memory uri) ERC1155(uri) Ownable(initialOwner) {
        uint256 initialSupply = 10000;
        addNewBadge(initialSupply, "Getting Started");
        addNewBadge(initialSupply, "Sprouting an Interest");
        addNewBadge(initialSupply, "Budding Naturalist");
        addNewBadge(initialSupply, "Trail Tracker");
        addNewBadge(initialSupply, "Keen Watcher");
        addNewBadge(initialSupply, "Sharp Eyed");
        addNewBadge(initialSupply, "Seasoned Spotter");
        addNewBadge(initialSupply, "Experienced Tracker");
        addNewBadge(initialSupply, "The Art of Sitting Quietly");
        addNewBadge(initialSupply, "Master Observer");
    }

    /**
     * 
     * @notice User function. Checks if the account has the badge already.
     * 
     * @param account address of the account to check
     * @param badgeId id of the badge to check
     * 
     * @return true if the account has the badge
     */
    function hasBadge(address account, uint256 badgeId) public view returns (bool) {
        return balanceOf(account, badgeId) > 0 ;
    }

    /**
     * 
     * @notice User function. Awards a badge to an account. 
     * Requires that the badge has not already been awarded to the account. 
     * 
     * @param to address of the account to award the badge to
     * @param badgeId id of the badge to award
     * 
     */
    function awardBadge(address to, uint256 badgeId) external {
        require(hasBadge(to, badgeId) == false, "Badge already awarded");
        //using internal _safeTransferFrom as safeTransformFrom which is the public function and requires that msg.sender has permission to transfer these tokens
        //The internal _safeTransferFrom function transfers without checking that msg.sender has permissions, ideal as the observation contract is transferring the tokens on behalf of the sender.
        _safeTransferFrom(address(this), to, badgeId, 1, "");
    }

    /**
     * 
     * @notice Owner/Admin function
     * 
     * @param supply how many badges to mint
     * @param name  name of the badge, stored to mapping
     */
    function addNewBadge( uint256 supply, string memory name) public onlyOwner {
        _mint(address(this), NEXT_BADGE_ID, supply, "");
        badgeNames[NEXT_BADGE_ID] = name;
        NEXT_BADGE_ID++;
    }

    /**
     * 
     * @notice Owner/Admin function
     * @param badgeId id of the badge to update
     * @param newName new name of the badge
     */
    function updateBadgeName(uint256 badgeId, string memory newName) public onlyOwner {
        badgeNames[badgeId] = newName;
    }

    /**
     * 
     * @notice Owner/Admin function
     * 
     * @param badgeId id of the badge to update
     * @param newSupply new supply of the badge
     */
    function updateSupply(uint256 badgeId, uint256 newSupply) public onlyOwner {
        _mint(msg.sender, badgeId, newSupply, "");
    }

}