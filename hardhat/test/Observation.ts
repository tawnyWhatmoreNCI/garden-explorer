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
            observation.safeMint(otherAccount.address, dummyChecksum)
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

            await badges.setApprovalForAll(observationAddress, true);

        // Ensure otherAccount owns a Garden Explorer token
        await gardenExplorer
            .connect(otherAccount)
            .safeMint({ value: ethers.parseEther('0.05') })

        const mintTx = await observation.safeMint(
            otherAccount.address,
            dummyChecksum
        )

        await mintTx.wait()
        

        expect(await badges.hasBadge(otherAccount.address, 1)).to.equal(
            true
        )
    })
})
