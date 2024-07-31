import hre, { ethers } from "hardhat";
import { expect } from "chai";

describe("GardenExplorer", function () {
    // set up the contract and the accounts before each test
    async function deployGardenExplorerBadges () {
         const [owner, otherAccount] = await hre.ethers.getSigners();
         const baseUri = "https://gardenExplorerBadges.blob.core.windows.net/badges/";
         const GardenExplorerBadges = await hre.ethers.getContractFactory("GardenExplorerBadges");
         const gardenExplorerBadges = await GardenExplorerBadges.deploy(owner.address, baseUri);

        return { gardenExplorerBadges, owner, otherAccount };
    }
    it("Should set the right owner", async function () {
        const { gardenExplorerBadges, owner } = await deployGardenExplorerBadges();

        expect(await gardenExplorerBadges.owner()).to.equal(owner.address);
    });

    it("Should check that the user does not have a badge", async function () {
        const { gardenExplorerBadges, owner } = await deployGardenExplorerBadges();
        const [_, otherAccount] = await hre.ethers.getSigners();

        expect(await gardenExplorerBadges.hasBadge(otherAccount.address, 1)).to.equal(false);
    });

    it("Should transfer a badge", async function () {
        const { gardenExplorerBadges, owner } = await deployGardenExplorerBadges();
        const [_, otherAccount] = await hre.ethers.getSigners();
        await gardenExplorerBadges.awardBadge(otherAccount.address, 1);
        expect(await gardenExplorerBadges.hasBadge(otherAccount.address, 1)).to.equal(true);
    });


});