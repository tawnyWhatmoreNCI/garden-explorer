import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("GardenExplorerModule", (m) => {
  const initialOwner = m.getAccount(0);
  const gardenExplorer = m.contract("GardenExplorer", [initialOwner]);

  return { gardenExplorer }; 
});