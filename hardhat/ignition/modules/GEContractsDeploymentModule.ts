import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GEContractsDeployment", (m) => {
  const initialOwner = m.getAccount(0);
  const initialGardenBaseUri = "https://gardenexplorer.blob.core.windows.net/garden/Artwork_01.png?nftId=";
  const initialObservationBaseUri = 'https://gardenexplorer.blob.core.windows.net/observations/metadata/';
  const initialBadgesBaseUri = "https://gardenexplorer.blob.core.windows.net/badges/{id}.json";

  const gardenExplorerModule = m.contract("GardenExplorer", [initialOwner,initialGardenBaseUri]);
  const badgesModule = m.contract("GardenExplorerBadges", [initialOwner, initialBadgesBaseUri]);
  const observationModule = m.contract("Observation", [
    initialOwner,
    initialObservationBaseUri,
    gardenExplorerModule,
    badgesModule,
  ]);

  return { gardenExplorerModule, badgesModule, observationModule };
});