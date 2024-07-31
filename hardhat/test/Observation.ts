import hre, { ethers, } from 'hardhat'
import { expect } from 'chai'

    describe('Observation', function () {
    const dummyChecksum =
        '0xe83ae6950811762e72cb37c1f84f8d2ebadf8a666ed2f1e6ce8236a68e24a44d'
    // set up the contract and the accounts before each test
    async function deployGardenExplorerBadges() {
        const [owner, otherAccount] = await hre.ethers.getSigners()
        const observationUri =
            'https://gardenExplorerBadges.blob.core.windows.net/metadata/'
        const gardenUri =
            'https://gardenExplorerBadges.blob.core.windows.net/garden/Artwork_01.png?nftId='
        const badgeUri =
            'https://gardenExplorerBadges.blob.core.windows.net/badge/'

        //deploy garden explorer contract
        const GardenExplorer =
            await hre.ethers.getContractFactory('GardenExplorer')
        const gardenExplorer = await GardenExplorer.deploy(
            owner.address,
            gardenUri
        )

        //deploy badge contract
        const GardenExplorerBadges = await hre.ethers.getContractFactory(
            'GardenExplorerBadges'
        )
        const badges = await GardenExplorerBadges.deploy(
            owner.address,
            badgeUri
        )

        //deploy observation contract
        const Observation = await hre.ethers.getContractFactory('Observation')
        const observation = await Observation.deploy(
            owner.address,
            observationUri,
            gardenExplorer.getAddress(),
            badges.getAddress()
        )

        badges.connect(owner).setApprovalForAll(observation, true);

        return { observation, badges, gardenExplorer, owner, otherAccount }
    }
    it('Should set the right owner', async function () {
        const { observation, owner } = await deployGardenExplorerBadges()

        expect(await observation.owner()).to.equal(owner.address)
    })

    it('Should check that the user cannot mint without owning a Garden Explorer token', async function () {
        const { observation, badges, gardenExplorer, owner, otherAccount } =
            await deployGardenExplorerBadges()

        await expect(
            observation.createObservation(otherAccount.address, dummyChecksum)
        ).to.be.revertedWith(
            'You must own a Garden Explorer token to mint an observation'
        )
    })

    it('should mint an observation', async function () {
        const { observation, badges, gardenExplorer, owner, otherAccount } =
            await deployGardenExplorerBadges()
            const observationAddress = await observation.getAddress();
            const gardenExplorerAddress = await gardenExplorer.getAddress();
            const badgesAddress = await badges.getAddress();
            console.log('Observation deployed to:', observationAddress);
            console.log('Garden Explorer deployed to:', gardenExplorerAddress);
            console.log('Badges deployed to:', badgesAddress);
            
            console.log('Owner:', owner.address);
            console.log('Other Account:', otherAccount.address);

        // Ensure otherAccount owns a Garden Explorer token
        await gardenExplorer
            .connect(otherAccount)
            .safeMint({ value: ethers.parseEther('0.05') })

        const mintTx = await observation.createObservation(
            otherAccount.address,
            dummyChecksum
        )

        await mintTx.wait()
        

        expect(await badges.hasBadge(otherAccount.address, 1)).to.equal(
            true
        )
    })

    it('should show an array of ids owned', async function () {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges()
        //get our required garden explorer token - connect with otherAccount as thats the one minting observations. 
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        //then mint an observation
        await observation.createObservation(otherAccount.address, dummyChecksum);
        //or two
        await observation.createObservation(otherAccount.address, dummyChecksum);
        //now let a different account mint an observation -he'll need his garden explorer token first too
        await gardenExplorer.connect(owner).safeMint({ value: ethers.parseEther('0.05') });
        await observation.createObservation(owner.address, dummyChecksum);
        //the other account mints another observation - should have skipped an id in the array because different account minted 2
        await observation.createObservation(otherAccount.address, dummyChecksum);
        //then check the array of ids owned
        const ids = await observation.ownersTokens(otherAccount.address);
        console.log(ids)
        //deep was a requirement for equalling arrays of big numbers
        expect(await ids).to.be.deep.equal([0n,1n,3n]);
    })

    it("should return empty array if the user doesn't own any tokens", async function () {
        const {observation, owner, otherAccount } = await deployGardenExplorerBadges();
        const ids = await observation.ownersTokens(owner.address);
        expect(await ids).to.be.deep.equal([]);
    })
})
