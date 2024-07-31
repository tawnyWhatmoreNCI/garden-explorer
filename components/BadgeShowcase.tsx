import React, {useState, useEffect} from 'react'
import useBadgesTokens from '../pages/hooks/useBadgesToken'

const BadgesShowcase = () => { 

    const { badges, error, isLoading } = useBadgesTokens()


    return (
        <div>
            <h1>Badges Showcase</h1>
            <p>Badges: { badges }</p>
        </div>
    )

}

export default BadgesShowcase;