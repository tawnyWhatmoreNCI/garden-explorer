import type { NextPage } from 'next';
import { useAccount, useReadContract,  }from 'wagmi';
import styles from '../styles/UserSpace.module.css';
import MintGarden from "../components/MintGarden";
import GardenMedia from "../src/images/GardenNFT.svg";
import gardenContract from '../src/lib/GardenExplorer.json';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import { Tooltip } from 'react-tooltip';
import  useObservationTokens  from './hooks/useObservationToken';

function UploadBar() {
    return (
        <div className="container">
        <div className={styles.row}>
            <button className="actionButton" data-tooltip-id="upload-tooltip" disabled>Upload Observation</button>
            
            <Tooltip id="upload-tooltip" place="top" content="This feature is not yet available."/>
            <p>Address: {process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER}</p>
        </div>
        <p>
            You have 0 observations in your garden collection.
        </p>
        </div>
    )
}

function MintGardenLayout({ isConnected }: { isConnected: boolean }) {
    return (
        <div> 
            <h1>Mint your Garden & Start Exploring!</h1>
           <p>
                Mint your garden and unlock the ability to upload your observations to the Garden Explorer platform. Grow your collection, share it with others and learn about the wild world around you.
                Complete challenges to earn badges. Participate in the community and help us build a global dataset for ecological research.
           </p>
           {!isConnected && (
              <p>
                To get started, connect your wallet! 
                </p>
           )}
            <div className={`${styles.gardenMedia}  ${!isConnected ? styles.hint : ""}`} >
            {!isConnected && (
            <Tooltip
            id="mint-tooltip"
            place="top"
            content={"Connect your wallet to mint this NFT."}/>
            )}
            <GardenMedia data-tooltip-id="mint-tooltip"  />
            </div>

            <MintGarden />
            <p>
                Enter a name for your Garden. Remember, this name will be public and visible to others so do not include any personal information, just keep it fun!
                If you choose not to enter a custom name we will use your wallet address as the name of your garden.
            </p>
        </div>
    );
};

const UserSpace: NextPage = () => {
    const { address, isConnected } = useAccount()

      const {data: balance, error, isPending} = useReadContract({ 
        abi: gardenContract.abi,
        address: process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`,
        functionName: 'balanceOf',
        args: [address]
      })
      const { tokens, error: tokensError, isLoading: tokensLoading } = useObservationTokens(address);

      useEffect(() => {
        console.log(`contract address: ${process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER}`)
          if(isPending) {
                console.log("Pending Balance")
          }

          if(error) {
            console.log(`Error getting balance: ${error}`)
          }

          if(balance) {
            console.log(`Balance: ${balance}`)
          }

          if (tokensError) {
            console.log(`Error getting tokens: ${tokensError}`);
        }

        if (tokens) {
            console.log(`Tokens: ${tokens}`);
        }
      })

      return (
        <div className="container">
            {isConnected && balance ? (
                <div>
                    <UploadBar />
                    {tokensLoading ? (
                        <p>Loading tokens...</p>
                    ) : (
                        <div>
                            <h2>Your Observation Tokens</h2>
                            <ul>
                                {tokens.map((tokenId: number) => (
                                    <li key={tokenId}>Token ID: {tokenId}</li>   
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <MintGardenLayout isConnected={isConnected} />
            )}
            <Footer />
        </div>
    );
};

export default UserSpace