import type { NextPage } from 'next';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {gardens, iGarden } from '../services/garden';
import styles from '../styles/Community.module.css';
import Footer from '../components/Footer';

const Community: NextPage = () => {

    const searchParams = useSearchParams()
    const [gardenData, setGardenData] = useState<iGarden[]>([]);

    const searchQuery = searchParams.get('q')
    useEffect(() => {
        const handleSearch = () => {
            //TODO: implement search filtering
            const matchedGardens:iGarden[] = gardens.filter((garden) => {
                //TODO: implement search filtering, currently returns all
                return garden;
            });

            setGardenData(matchedGardens);
        }

        handleSearch(); 
    }, [searchQuery]); //re-run effect when searchQuery changes

    return (
        <div className="container">
            <h1>Get Involved!</h1>
            <p> 
                Within the Garden Explorer community you can visit other gardens and see what other users have discovered.
                Give observations ratings for the accuracy of their identifications.
                Notice something that is misidentified? Share your expertise with us by submitting corrections and earn a badges for your contributions.
            </p>
            <SearchBar defaultValue={searchQuery}/>
            { gardenData.length === 0 ? (
                 searchQuery ? (
                    <p className="searchResults"> 
                        No gardens found for &apos;{searchQuery}&apos;.
                    </p>) : (
                    <p className="searchResults">
                        No gardens found.
                    </p>
                    )
             ) : (
                <div>
                    {gardenData.map((garden) => (
                        <div key={garden.id}>
                            <h2>{garden.owner}</h2>
                        </div>
                    ))}
                </div>
            )}
            <Footer/>
        </div>
    )
}

export default Community