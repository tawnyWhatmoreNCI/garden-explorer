
import { type BaseError, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem'
import {useState} from 'react';
import { Tooltip } from "react-tooltip";
import styles from '../styles/MintGarden.module.css';
import gardenContract from '../hardhat/artifacts/contracts/GardenExplorer.sol/GardenExplorer.json'
import Notification, { NotificationType } from '../components/Notification';

const MintGarden = () => {
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { address, isConnected } = useAccount()

  async function mint() {
    console.log(address)
    if(address) {
      //payable function, send 0.05 eth to mint a garden
      console.log("Contract Address: ", process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER)
        writeContract({
            address: process.env.NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`,
            abi: gardenContract.abi,
            functionName: 'safeMint',
            value: parseEther('0.05') 
          })
    } else {
        console.error(`Account not connected, ${address}`)
    }
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash, 
    })

const [inputName, setInputName] = useState<string>("")

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputName(event.target.value) 
}

  return (
    <div>
      <div className={styles.mintRow}>
        <input disabled data-tooltip-id="input-tooltip" type="text" className="inputBar" value={inputName ?? ""} placeholder="(Optional) Enter your garden name" onChange={handleChange} />
          <button data-tooltip-id="button-tooltip"  className="actionButton" disabled={isPending || !isConnected} onClick={mint}>
            {isPending ? 'Confirming...' : 'Mint'}
          </button>
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
        content={"You must connect a wallet to mint."}/>
        )}

<Tooltip
        id="input-tooltip"
        place="top"
        content={"The naming feature is not yet available, but you can still mint!"}/>
      </div>
  )
}

export default MintGarden;
