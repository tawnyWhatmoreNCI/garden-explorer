import React, {useState, useEffect} from 'react'
import {useReadContract, useAccount} from 'wagmi'
import ObservationCard from './ObservationCard'
import ObservationContract from '../src/lib/Observation.json'
import useObservationTokens from '../hooks/useObservationToken'
import styles from '../styles/ShowUserObservation.module.css'

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
        <div className="cardContainer">
            {isLoading && <p className="textCenter">Loading...</p>}
            {error && <p className="textCenter">Error: {error.toString()}</p>}
            {nftUris.length === 0 && <p className="textCenter">You have 0 observations. Upload an observation to get started!</p>}
            {[...nftUris].reverse().map((nftUri) => (
                <ObservationCard key={nftUri} nftUri={nftUri} />
            ))}
        </div>
    )
}

export default ShowUserObservations;