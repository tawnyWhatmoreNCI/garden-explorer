import { useReadContract } from 'wagmi';
import observationContract from '../../src/lib/Observation.json';

const useObservationTokens = (userAddress: `0x${string}` | undefined) => {
    console.log(`useObservationTokens userAddress: ${userAddress}`);
    const { data, error, isLoading } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`,
        abi: observationContract.abi,
        functionName: 'ownersTokens',
        args: [userAddress],
    });
    console.log(`useObservationTokens data: ${data}`);
    return { tokens: data as number[], error, isLoading };
};

export default useObservationTokens;