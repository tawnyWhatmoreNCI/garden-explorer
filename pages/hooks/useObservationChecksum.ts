import { useReadContract } from 'wagmi'
import observationAbi from '../../src/lib/Observation.json'

const useObservationChecksum = (tokenId: number) => {
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`
    const { data: checksum } = useReadContract({
        abi: observationAbi.abi,
        address: observationContract,
        functionName: 'getChecksum',
        args: [tokenId],
    })
    return checksum  as `0x${string}`
}

export default useObservationChecksum
