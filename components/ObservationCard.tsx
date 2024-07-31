import React, { useState, useEffect } from 'react'
import styles from '../styles/ObservationCard.module.css';

interface ObservationType {
    common_name: string
    scientific_name: string
    kingdom: string
    phylum: string
    class: string
    order: string
    family: string
    genus: string
    species: string
    description: string
    id_confidence_level: string
    mediaUrl: string
    tokenId: string
}

const ObservationCard = ({ nftUri }: { nftUri: string }) => {
    const [observationData, setObservationData] =
        useState<ObservationType | null>(null)

    useEffect(() => {
        fetch(nftUri)
            .then((response) => response.json())
            .then((data) => setObservationData(data))
    }, [])

    return (
        <div className={styles.card}>
            {observationData && (
                <div>
                    <h1>{observationData?.common_name}</h1>
                    <p>{observationData?.description}</p>
                    <img className={styles.observationMedia}
                        src={observationData.mediaUrl}
                        alt={observationData.common_name}
                    />
                </div>
            )}
        </div>
    )
}

export default ObservationCard
