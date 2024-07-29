import { useContractRead, useReadContract } from 'wagmi';
import gardenContract from '../../src/lib/GardenExplorer.json';

const useObservationTokens = (address: string) => {
    const { data, error, isLoading } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_OBSERVATION as `0x${string}`,
        abi: gardenContract.abi,
        functionName: 'ownersTokens',
        args: [address],
    });

    return { tokens: data, error, isLoading };
};

export default useObservationTokens;