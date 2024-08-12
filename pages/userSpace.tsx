import type { NextPage } from 'next';
import { useAccount, useReadContract,  }from 'wagmi';
import styles from '../styles/UserSpace.module.css';
import MintGarden from "../components/MintGarden";
import GardenMedia from "../src/images/GardenNFT.svg";
import ShowUserObservations from "../components/ShowUserObservations";
import ContractIcon from '../src/images/contractIcon.svg';


import { useEffect } from 'react';
import Footer from '../components/Footer';
import { Tooltip } from 'react-tooltip';
import  useObservationTokens  from '../hooks/useObservationToken';
import useGardenExplorerBalance  from '../hooks/useGardenExplorerBalance';
import Link from 'next/link';

function UploadBar() {

    const observationContractAddress = process.env.NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`;
    return (
        <div className="container">
        <div className={styles.row}>
            <Link href="/uploadObservation">
            <button className="actionButton">Add New Observation</button>
            </Link>
            <Tooltip id="contract-tooltip" place="top" content="View contract in block explorer"/>
            <p>Observation Contract: {observationContractAddress}
            <a data-tooltip-id="contract-tooltip" href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}${observationContractAddress}`} target="_blank" className="icon-button">
               <ContractIcon/>
             </a>
            </p>
        </div>
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
                By minting this token and paying the minting fee you will get access to the observation identification and minting features.
            </p>
        </div>
    );
};

const UserSpace: NextPage = () => {
    const { address, isConnected } = useAccount()

      const { hasGardenBalance, balance, isPendingBalance, balanceError } = useGardenExplorerBalance() 
      const { tokens, error: tokensError, isLoading: tokensLoading } = useObservationTokens(address);

      useEffect(() => {
        console.log(`contract address: ${process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER}`)
          if(isPendingBalance) {
                console.log("Pending Balance")
          }

          if(balanceError) {
            console.log(`Error getting balance: ${balanceError}`)
          }

          if(hasGardenBalance) {
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
                    <ShowUserObservations/>
                </div>
            ) : (
                <MintGardenLayout isConnected={isConnected} />
            )}
            <Footer />
        </div>
    );
};

export default UserSpace