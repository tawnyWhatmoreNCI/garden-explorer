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

    it('Should set the right base uri', async function () {
        const { observation } = await deployGardenExplorerBadges()

        expect(await observation.getBaseUri()).to.equal(
            'https://gardenExplorerBadges.blob.core.windows.net/metadata/'
        )
    })

    it("should correctly set and retrieve observation metadata", async function() {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        // Mint an observation
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        await observation.createObservation(otherAccount.address, dummyChecksum);
    
        // Check the metadata
        const tokenUri = await observation.tokenURI(0);
        expect(tokenUri).to.equal('https://gardenExplorerBadges.blob.core.windows.net/metadata/0');
    });

    it('Should not allow a mint without owning a Garden Explorer Token', async function () {
        const { observation, badges, gardenExplorer, owner, otherAccount } =
            await deployGardenExplorerBadges()

        await expect(
            observation.createObservation(otherAccount.address, dummyChecksum)
        ).to.be.revertedWith(
            'You must own a Garden Explorer token to mint an observation'
        )
    })

    it('Should allow minting an observation with a Garden Explorer Token', async function () {
        const { observation, badges, gardenExplorer, owner, otherAccount } =
            await deployGardenExplorerBadges()

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

    it('should mint an observation if user has a garden explorer token ', async function () {
        const { observation, badges, gardenExplorer, owner, otherAccount } =
            await deployGardenExplorerBadges()
            const observationAddress = await observation.getAddress();
            const gardenExplorerAddress = await gardenExplorer.getAddress();
            const badgesAddress = await badges.getAddress();

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

    it("should correctly update the observation count", async function() {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        // Mint 3 observations
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        for (let i = 0; i < 3; i++) {
            await observation.createObservation(otherAccount.address, dummyChecksum);
        }
    
        // Check the observation count
        const count = await observation.balanceOf(otherAccount.address);
        expect(count).to.equal(3);
    });

    it("should award a badge if the user has minted 5 observations", async function() {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        //mint 5 observations
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        for (let i = 0; i < 5; i++) {
            await observation.createObservation(otherAccount.address, dummyChecksum);
        }
        //check if the user has the badge
        expect(await badges.hasBadge(otherAccount.address, 3)).to.equal(true);
    })

    it("should have badge id 1,2 and 3 if the user has minted 5 observations", async function() {  
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        //mint 5 observations
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        for (let i = 0; i < 5; i++) {
            await observation.createObservation(otherAccount.address, dummyChecksum);
        }
        //check if the user has the badge
        expect(await badges.hasBadge(otherAccount.address, 1)).to.equal(true);
        expect(await badges.hasBadge(otherAccount.address, 2)).to.equal(true);
        expect(await badges.hasBadge(otherAccount.address, 3)).to.equal(true);
    })

    it("should not award badge id 3 if the user has minted less than 5 observations", async function() {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        //mint 4 observations
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        for (let i = 0; i < 4; i++) {
            await observation.createObservation(otherAccount.address, dummyChecksum);
        }
        //check if the user has the badge
        expect(await badges.hasBadge(otherAccount.address, 3)).to.equal(false);
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
        //deep was a requirement for equalling arrays of big numbers
        expect(await ids).to.be.deep.equal([0n,1n,3n]);
    })

    it("should return true for matching checksum", async function () {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        // Mint an observation
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        await observation.createObservation(otherAccount.address, dummyChecksum);
    
        //pass in dummy checksum to check if it matches
        expect(await observation.doesChecksumMatch(0, dummyChecksum)).to.equal(true);
        
    })

    it("should return false for non-matching checksum", async function () {
        const {observation, badges, gardenExplorer, owner, otherAccount} = await deployGardenExplorerBadges();
        // Mint an observation
        await gardenExplorer.connect(otherAccount).safeMint({ value: ethers.parseEther('0.05') });
        await observation.createObservation(otherAccount.address, dummyChecksum);
    
        ///pass in random checksum to check if it matches
        expect(await observation.doesChecksumMatch(0, "0xeeeeaaaaa000062e72cb37c1f84f8d2ebadf8a666ed2f1e6ce8236a68e24a44d")).to.equal(false);
    })

    it("should return empty array if the user doesn't own any tokens", async function () {
        const {observation, owner, otherAccount } = await deployGardenExplorerBadges();
        const ids = await observation.ownersTokens(owner.address);
        expect(await ids).to.be.deep.equal([]);
    })
    
    it("Should allow the owner to update the base uri", async function () {
        const {observation, owner} = await deployGardenExplorerBadges();
        const newBaseUri = "https://newbaseuri.blob.core.windows.net/metadata/";
        await observation.connect(owner).setBaseUri(newBaseUri);
        expect(await observation.getBaseUri()).to.be.equal(newBaseUri);
    })

})
