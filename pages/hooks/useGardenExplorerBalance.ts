import { useReadContract } from 'wagmi';
import observationContract from '../../src/lib/Observation.json';
import { useAccount } from 'wagmi';
import gardenContract from '../../src/lib/GardenExplorer.json';

const useGardenExplorerBalance = () => {
const { address: userAddress } = useAccount();

    console.log(`useGardenExplorerBalance userAddress: ${userAddress}`);
    const {data: balance, error: balanceError, isPending: isPendingBalance} = useReadContract({ 
        abi: gardenContract.abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`,
        functionName: 'balanceOf',
        args: [userAddress]
      })
    console.log(`useGardenExplorerBalance data: ${balance}`);
    const hasGardenBalance = balance as number > 0;
    return { hasGardenBalance, balance, isPendingBalance, balanceError };
};

export default useGardenExplorerBalance;