
import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { parseEther } from 'viem'
import {useState} from 'react';
import { Tooltip } from "react-tooltip";
import styles from '../styles/MintGarden.module.css';
import gardenContract from '../src/lib/GardenExplorer.json';
import Notification, { NotificationType } from '../components/Notification';
import ContractIcon from '../src/images/contractIcon.svg';


const MintGarden = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract()

  const { address, isConnected } = useAccount()
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`

  const {data: mintPrice} = useReadContract({ 
    abi: gardenContract.abi,
    address: contractAddress,
    functionName: 'mintPrice',
  });

  async function mint() {
    console.log(address)
    if(address) {
      //payable function, send 0.05 eth to mint a garden
      console.log("Contract Address: ", process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER)
        writeContract({
            address: contractAddress,
            abi: gardenContract.abi,
            functionName: 'safeMint',
            value: parseEther(inputAmount.toString() ?? mintPrice) 
          })
    } else {
        console.error(`Account not connected, ${address}`)
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash, 
    })

const [inputAmount, setInputAmount] = useState<number>(0.1)

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(parseFloat(event.target.value)) 
}

  return (
    <div>
      <div className={styles.mintRow}>
        <input type="number" className="inputBar" value={inputAmount ?? ""} min={mintPrice as number} placeholder="Enter mint price" onChange={handleChange} />
          <button data-tooltip-id="button-tooltip"  className="actionButton" disabled={isPending || !isConnected} onClick={mint}>
            {isPending ? 'Confirming...' : 'Mint'}
          </button>
          <a data-tooltip-id="contract-tooltip" href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER}${contractAddress}`} target="_blank" className="icon-button">
               <ContractIcon/>
             </a>
          </div>
          
        {hash && <Notification message={`Transaction Hash: ${hash}`} type={NotificationType.INFO} />}
        {isConfirming && <Notification message={"Waiting for confirmation"} type={NotificationType.INFO} />}
        {isConfirmed && <Notification message={"Transaction Confirmed"} type={NotificationType.SUCCESS} />}
        {error && (
          <Notification message={`Error: ${(error as BaseError).shortMessage || error.message}`} type={NotificationType.ERROR} />
         
        )}
        {!isConnected && (
        <Tooltip
        id="button-tooltip"
        place="top"
        content={"Connect your wallet to mint this NFT."}/>
        )}
        <Tooltip
                id="contract-tooltip"
                place="top"
                content={"View contract in block explorer"}/>
      </div>
  )
}

export default MintGarden;
