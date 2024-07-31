import { useReadContract } from 'wagmi'
import observationAbi from '../../src/lib/Observation.json'

const useNextObservationId = () => {
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`
    const { data: tokenId } = useReadContract({
        abi: observationAbi.abi,
        address: observationContract,
        functionName: 'getNextTokenId',
    })
    return tokenId as number
}

export default useNextObservationId
