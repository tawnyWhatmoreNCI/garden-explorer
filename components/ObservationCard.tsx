import React, { useState, useEffect } from 'react'
import useObservationChecksum from '../pages/hooks/useObservationChecksum'
import styles from '../styles/ObservationCard.module.css'
import { useAccount } from 'wagmi'
import { sha256 } from 'js-sha256'
import StatusChip, { StatusChipType } from './StatusChip'

export interface ObservationType {
    observer: string
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
    identifications: string[]
}

export interface ObservationProposal {
    proposer: string,
    common_name: string,
    description: string
    ,id_confidence_level: string
}



function showProposedModal() {
    alert("Propose Observation Correction Modal");
}

const ObservationCard = ({ nftUri }: { nftUri: string }) => {
    const { address, isConnected } = useAccount()
    const [observationData, setObservationData] =
        useState<ObservationType | null>(null)

    const [remoteChecksum, setRemoteChecksum] = useState<string | null>(null)
    const checksum = useObservationChecksum(
        parseInt(observationData?.tokenId ?? '0')
    )

    useEffect(() => {
        fetch(nftUri)
            .then((response) => response.json())
            .then((data) => {
                setObservationData(data)

                const jsonBytes = Buffer.from(JSON.stringify(data))
                var hash = sha256.create()
                hash.update(jsonBytes)
                const hashAsHex = `0x${hash.hex()}`
                setRemoteChecksum(hashAsHex)
            })
    }, [])

    return (
        <div className={styles.card}>
            {observationData && (
                <div>
                    <a
                        href={observationData.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <img
                            className={styles.observationMedia}
                            src={observationData.mediaUrl}
                            alt={observationData.common_name}
                        />
                    </a>
                    <div className={styles.observationDetails}>
                        <h2>{observationData.common_name}</h2>
                        <p className={styles.attributes}>
                            ID Rating:{' '}
                            {observationData.id_confidence_level != 'AI'
                                ? `${observationData.id_confidence_level}/5`
                                : ' AI'}
                        </p>
                        <p>{observationData.description}</p>

                        <p className={styles.attributes}>
                            <b>Scientific Name:</b> {observationData.scientific_name}
                        </p>
                        <p className={styles.attributes}>
                            <b>Kingdom:</b> {observationData.kingdom}
                        </p>
                        <p className={styles.attributes}>
                            <b>Phylum:</b> {observationData.phylum}
                        </p>
                        <p className={styles.attributes}>
                            <b>Class:</b> {observationData.class}
                        </p>
                        <p className={styles.attributes}>
                            <b>Order:</b> {observationData.order}
                        </p>
                        <p className={styles.attributes}>
                            <b>Family:</b> {observationData.family}
                        </p>
                        <p className={styles.attributes}>
                            <b>Species:</b> {observationData.species}
                        </p>

                        <div className={styles.chipContainer}>
                            {checksum && remoteChecksum ? (
                                <div>
                                    <StatusChip
                                        message={
                                            checksum === remoteChecksum
                                                ? '✓ Checksum Matches'
                                                : '⚠ Checksum Mismatch'
                                        }
                                        type={
                                            checksum === remoteChecksum
                                                ? StatusChipType.SUCCESS
                                                : StatusChipType.ERROR
                                        }
                                    />
                                </div>
                            ) : null}
                        </div>
                        {/*<div>
                            <a className="actionButton" href="/proposeIdentification">Propose Observation Correction</a>
                        </div>*/}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ObservationCard
