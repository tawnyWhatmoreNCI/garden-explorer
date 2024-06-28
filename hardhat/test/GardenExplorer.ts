import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { GardenExplorer } from "../typechain-types";

describe("GardenExplorer", function () {
    // set up the contract and the accounts before each test
    async function deployGardenExplorer () {
         const [owner, otherAccount] = await hre.ethers.getSigners();
         const GardenExplorer = await hre.ethers.getContractFactory("GardenExplorer");
         const gardenExplorer = await GardenExplorer.deploy(owner.address);

        return { gardenExplorer, owner, otherAccount };
    }
    it("Should set the right owner", async function () {
        const { gardenExplorer, owner } = await deployGardenExplorer();

        expect(await gardenExplorer.owner()).to.equal(owner.address);
    });

    it("Should check that the user does not have a token", async function () {
        const { gardenExplorer, owner } = await deployGardenExplorer();

        expect(await gardenExplorer.balanceOf(owner.address)).to.equal(0);
    });

    it("Should mint a token to caller address if sufficient funds are sent", async function () {
        const { gardenExplorer, owner } = await deployGardenExplorer();
        const mintPrice = ethers.parseEther("0.05");
        const mintTx = await gardenExplorer.safeMint({ value: mintPrice }); 

        await mintTx.wait();

        expect(await gardenExplorer.ownerOf(0)).to.equal(owner.address);
    });

    it("Should not mint a token if lower funds are sent", async function () {
        const { gardenExplorer } = await deployGardenExplorer();
        const invalidPrice = ethers.parseEther("0.01");
        const mintTx = gardenExplorer.safeMint({ value: invalidPrice }); 

        await expect(mintTx).to.be.revertedWith("Insufficient Ether sent");
    });

    it("Should  mint a token if higher funds are sent", async function () {
        const { gardenExplorer, owner } = await deployGardenExplorer();
        const higherPrice = ethers.parseEther("0.1");
        const mintTx = await gardenExplorer.safeMint({ value: higherPrice }); 
        await mintTx.wait(); // wait for the transaction to be mined
        expect(await gardenExplorer.ownerOf(0)).to.equal(owner.address);
    });

    it("Should not mint and revert if thte user already has a token", async function () {
        const { gardenExplorer } = await deployGardenExplorer();
        const mintPrice = ethers.parseEther("0.05");
        //minting the first token 
        await gardenExplorer.safeMint({ value: mintPrice }); 
        //trying to mint a second token
        const mintTx = gardenExplorer.safeMint({ value: mintPrice }); 

        await expect(mintTx).to.be.revertedWith("You already own a garden");
    });
});