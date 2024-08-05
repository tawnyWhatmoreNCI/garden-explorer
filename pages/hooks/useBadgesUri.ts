import { useReadContract, useAccount } from 'wagmi'
import BadgesContract from '../../src/lib/GardenBadges.json'


const useBadgesUri = () => {
    const badgesContractAddress = process.env
        .NEXT_PUBLIC_CONTRACT_BADGES as `0x${string}`
    const { data, error, isLoading } = useReadContract({
        address: badgesContractAddress,
        abi: BadgesContract.abi,
        functionName: 'uri'
    })
    console.log(`useBadgesUri data: ${data}`)
    return { uri: data as string, error, isLoading }
}

export default useBadgesUri
