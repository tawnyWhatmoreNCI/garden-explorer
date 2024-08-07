import { useReadContract } from 'wagmi'
import observationAbi from '../src/lib/Observation.json'

const useNextObservationId = () => {
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`
    console.log(`useNextObservationID ${observationContract}`);

    const { data: tokenId, error } = useReadContract({
        abi: observationAbi.abi,
        address: observationContract,
        functionName: 'getNextTokenId',
    })

    if (error) {
        console.error(`Error fetching next token ID: ${error.message}`)
    } else {
        console.log(`useNextObservationID tokenId: ${tokenId}`);
    }

    return tokenId as number
}

export default useNextObservationId