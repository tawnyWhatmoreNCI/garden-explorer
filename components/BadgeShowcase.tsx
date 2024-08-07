import React, { useState, useEffect } from 'react'
import useBadgesTokens from '../pages/hooks/useBadgesToken'
import useBadgesUri from '../pages/hooks/useBadgesUri'
import styles from '../styles/Badges.module.css'
import { Tooltip } from 'react-tooltip'
import { Badge } from '../pages/hooks/useBadgesToken'
import Image from 'next/image'

interface BadgeMetadata {
    name: string
    image: string
    description: string
}

const BadgeView = ({
    uri,
    blockchainBadge,
}: {
    uri: string
    blockchainBadge: Badge
}) => {
    const [badgeMetadata, setBadgeMetadata] = useState<BadgeMetadata>()

    useEffect(() => {
        const updatedUri = uri.replace('{id}', blockchainBadge.tokenId.toString())
         fetch(updatedUri)
            .then((response) => response.json())
            .then((data) => {
                console.log(`badge: ${data}`)
                setBadgeMetadata(data)
            })
    }, [uri, blockchainBadge.tokenId])

    return (
        <div>
            <Tooltip
                id={`badge${blockchainBadge.tokenId}`}
                place="top"
                content={`${blockchainBadge.name}: ${badgeMetadata?.description}`}
            />
            <Image
                data-tooltip-id={`badge${blockchainBadge.tokenId}`}
                className={styles.badge}
                src={badgeMetadata?.image ?? ""}
                alt={badgeMetadata?.name ?? ""}
            />
        </div>
    )
}

const BadgesShowcase = () => {
    const { badges, error, isLoading } = useBadgesTokens()
    const { uri, isLoading: uriLoading } = useBadgesUri(BigInt(1)) //dummy token id to fetch uri format

    return (
        <div className="row">
            {isLoading && <p>Loading badges...</p>}
            {badges && badges.length > 0 && (
                <h4 className={styles.heading}>Your Badges:</h4>
            )}
            {badges &&
                badges.length > 0 &&
                badges.map((badge) => {
                    return (
                        <BadgeView
                            key={badge.tokenId}
                            uri={uri as string}
                            blockchainBadge={badge}
                        />
                    )
                })}
        </div>
    )
}

export default BadgesShowcase
