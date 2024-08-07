import { useReadContract } from 'wagmi';
import BadgesContract from '../../src/lib/GardenBadges.json';

const useBadgesUri = (tokenId: bigint) => {
    const badgesContractAddress = process.env.NEXT_PUBLIC_CONTRACT_BADGES as `0x${string}`;
    const { data, error, isLoading } = useReadContract({
        address: badgesContractAddress,
        abi: BadgesContract.abi,
        functionName: 'uri',
        args: [tokenId],
    });
    return { uri: data, error, isLoading };
};

export default useBadgesUri;