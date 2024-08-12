import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import useNextObservationId from '../hooks/useNextObservationId'
import ObservationContract from '../src/lib/Observation.json'
import { useReadContract } from 'wagmi'
import ObservationCard from '../components/ObservationCard'

const Community: NextPage = () => {
    const [allTokenIds, setAllTokenIds] = useState<number[]>([])
    const [nextTokenId, setNextTokenId] = useState<number | undefined>(undefined)
    const fetchedNextTokenId = useNextObservationId()

    useEffect(() => {
        console.log("fetch token id")
        if (fetchedNextTokenId !== undefined) {
            const nextId = parseInt(fetchedNextTokenId.toString())
            setNextTokenId(nextId)
            setAllTokenIds(Array.from({ length: nextId }, (_, i) => i))
        }
    }, [fetchedNextTokenId])


    useEffect(() => {
        console.log(`contract address: ${process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER}`)
          if(fetchedNextTokenId) {
                console.log(`token id: ${fetchedNextTokenId}`)
          }
      })
      
    const { data: baseUri } = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`,
        abi: ObservationContract.abi,
        functionName: 'getBaseUri'
    })

    const allBaseUris = allTokenIds.map((tokenId) => `${baseUri}${tokenId}.json`)

    return (
        <div className="container">
            <h1>Community Observations</h1>
            <p>Here you can browse all of the observations minted by the community</p>
            <div className="cardContainer">
            {allBaseUris.map((nftUri) => (
                <ObservationCard key={nftUri} nftUri={nftUri} />
            ))}
            </div>
            
        </div>
    )
}

export default Community