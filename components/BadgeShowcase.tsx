import React, {useState, useEffect} from 'react'
import useBadgesTokens from '../pages/hooks/useBadgesToken'
import useBadgesUri from '../pages/hooks/useBadgesUri'

const BadgesShowcase = () => { 

    const { badges, error, isLoading } = useBadgesTokens()
    const {uri, isLoading: uriLoading } = useBadgesUri()

    return (
        <div>
            <h1>Badges Showcase</h1>
            {uriLoading && <p>Badges URI Loading...</p>}
            {uri && <p>Badges URI: {uri}</p>}
            {isLoading && <p>Badges Loading...</p>}
            {(badges && badges.length > 0) && badges.map((badge) => (
                <div key={badge.tokenId}>
                    <h2>{badge.name}</h2>
                    <p>Token ID: {badge.tokenId}</p>
                </div>
            ))}
            
        </div>
    )

}

export default BadgesShowcase;