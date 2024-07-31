import React, {useState, useEffect} from 'react'
import {useReadContract, useAccount} from 'wagmi'
import ObservationCard from './ObservationCard'
import ObservationContract from '../src/lib/Observation.json'
import useObservationTokens from '../pages/hooks/useObservationToken'

const ShowUserObservations = () => {
    const { address, isConnected } = useAccount()
    const { tokens, error, isLoading } = useObservationTokens(address)
    const { data: baseUri } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`,
        abi: ObservationContract.abi,
        functionName: 'getBaseUri'
    })
    const [nftUris, setNftUris] = useState<string[]>([])
    

    useEffect(() => {
        if (baseUri && tokens) {
            //we have the base uri, resolve the token uris with baseUri and tokenId
            const uris = tokens.map((tokenId: number) => `${baseUri}${tokenId}.json`)
            setNftUris(uris)
        }
    }, [tokens, baseUri])

    return (
        <div className="container">
            <h1>Your Observation Tokens</h1>
            {isLoading && <p>Loading...</p>}
            {nftUris.map((nftUri) => (
                <ObservationCard nftUri={nftUri} />
            ))}
        </div>
    )
}

export default ShowUserObservations;