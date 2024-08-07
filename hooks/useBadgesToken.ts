import { useReadContract, useAccount } from 'wagmi';
import BadgesContract from '../src/lib/GardenBadges.json';

export interface Badge {
    name: string;
    tokenId: bigint;
}

const useBadgesTokens = () => {
    const badgesContractAddress = process.env.NEXT_PUBLIC_CONTRACT_BADGES as `0x${string}`;
    const { address, isConnected } = useAccount();
    const { data, error, isLoading } = useReadContract({
        address: badgesContractAddress,
        abi: BadgesContract.abi,
        functionName: 'getBadgesAwarded',
        args: [address],
    });
    console.log(`useBadgesTokens data: ${data}`);
    return { badges: data as Badge[], error, isLoading };
};

export default useBadgesTokens;