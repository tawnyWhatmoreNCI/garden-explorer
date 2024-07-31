import React, { useState, useEffect } from 'react'
import observationAbi from '../src/lib/Observation.json'
import gardenAbi from '../src/lib/GardenExplorer.json'
import Notification, { NotificationType } from '../components/Notification'
import {
    useReadContract,
    useWriteContract,
    useAccount,
    useWaitForTransactionReceipt,
} from 'wagmi'


export enum ObservationApiStatus {
    IDLE,
    PREPARING,
    UPLOADING_MEDIA,
    IDENTIFYING,
    UPLOADING_METADATA,
    MINTING,
    DONE,
    ERROR
}

function isStringNotNullOrEmpty(value: string | null | undefined): boolean {
    return value !== null && value !== undefined && value.trim() !== '';
}

const UploadObservation = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [apiStatus, setApiStatus] = useState<{apiStatus: ObservationApiStatus, error?: string}>({
        apiStatus: ObservationApiStatus.IDLE
    })
    //contract addresses
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`
    const gardenContract = process.env
        .NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`

    //web3
    const { data: hash, error, isPending, writeContract } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

        const { data: tokenId} = useReadContract({
            abi: observationAbi.abi,
            address: observationContract,
            functionName: 'getNextTokenId',
        })
    
        const { data: gardenBalance } = useReadContract({
            abi: gardenAbi.abi,
            address: gardenContract,
            functionName: 'balanceOf',
        })
        
    const { address, isConnected } = useAccount()

    async function mintObservation(metadataChecksum: string) {
        if (isConnected) {
            console.log(`Minting observation for address: ${address}, checksum ${metadataChecksum}`)

            if (isStringNotNullOrEmpty(metadataChecksum)) {
                writeContract({
                    address: observationContract,
                    abi: observationAbi.abi,
                    functionName: 'safeMint',
                    args: [address, metadataChecksum],
                })
            } else {
                alert('could not get checksum of metadata')
            }
        } else {
            alert('Please connect your wallet')
        }
    }

    const onFileChange = (event: any) => {
        setSelectedFile(event.target.files[0])
    }

    const onFileUpload = async () => {
        setApiStatus({apiStatus: ObservationApiStatus.PREPARING, error: ''})//clear the error
        // Guard against no file
        if (!selectedFile) {
            setApiStatus({apiStatus: ObservationApiStatus.ERROR, error: 'No file selected'})
            return
        }
        // guard against no garden explorer NFT
        console.log(`Garden Balance: ${gardenBalance}`)
        if (gardenBalance === 0) {
            setApiStatus({apiStatus: ObservationApiStatus.ERROR, error: 'You need to mint a Garden Explorer NFT before you can upload an observation'})
            return
        }

        // Create formData
        const formData = new FormData()
        // Update the formData object
        formData.append('file', selectedFile, selectedFile.name)

        //1: Make a POST request to upload the media
        console.log(`formData: ${JSON.stringify(formData)}`)
        setApiStatus({apiStatus: ObservationApiStatus.UPLOADING_MEDIA})
        const response = await fetch('/api/observation/uploadMedia', {
            method: 'POST',
            body: formData, // Send formData directly without JSON.stringify
        })
        const uploadMediaResponse = await response.text()
        console.log(`UploadMedia Response: ${uploadMediaResponse}`)
        //if success hit recognition api
        if (response.ok) {
            const mediaUrl = JSON.parse(uploadMediaResponse).mediaUrl
            console.log(`sending mediaUrl to open ai: ${mediaUrl}`)
            //2: Call the recognition API
            setApiStatus({apiStatus: ObservationApiStatus.IDENTIFYING})
            const recognitionResponse = await fetch(
                '/api/observation/identify',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ mediaUrl }),
                }
            )
            const recognitionData = await recognitionResponse.text()
            console.log(`Recognition response from server: ${recognitionData}`)
            //check for error
            if (!recognitionResponse.ok) {
                setApiStatus({apiStatus: ObservationApiStatus.ERROR, error: "Error identifying the observation"})
            } else {
                //parse the AI response to json and upload to blob
                //use tokenid as name of json file to integrate with the baseURI of the token.
                console.log('trying to parse metadata...')

                // Parse the recognition data
                const metadata = JSON.parse(recognitionData);

                //Add the media url 
                metadata.mediaUrl = mediaUrl;
                // Add tokenId to metadata
                metadata.tokenId = tokenId;

                // Convert BigInt properties to strings
                const replacer = (key: string, value: any) => {
                return typeof value === 'bigint' ? value.toString() : value;
                };

                console.log(`Metadata parsed: ${JSON.stringify(metadata, replacer, 2)}`);

                console.log('uploading metadata to blob...')
                //3: Upload metadata to blob storage
                setApiStatus({apiStatus: ObservationApiStatus.UPLOADING_METADATA})
                const metadataResponse = await fetch(
                    '/api/observation/uploadMetadata',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ metadata }, replacer),
                    }
                )

                //metadata response should contain the url of the uploaded metadata json file.
                const uploadMetadataReponseData = await metadataResponse.text()
                const metadataUrl = JSON.parse(uploadMetadataReponseData).mediaUrl
                const metadataHash = JSON.parse(uploadMetadataReponseData).metadataHash
                console.log(`Metadata hash: ${metadataHash}`)
                console.log(`Metadata url: ${metadataUrl}`)

                //4: Mint the observation NFT
                setApiStatus({apiStatus: ObservationApiStatus.MINTING})
                mintObservation(metadataHash)
            }
        }
    }

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            <button type="submit" onClick={onFileUpload}>
                Upload Observation
            </button>
            <p>Next Token Id: {tokenId?.toString()}</p>
            {hash && (
                <Notification
                    message={`Transaction Hash: ${hash}`}
                    type={NotificationType.INFO}
                />
            )}
            <p>{apiStatus.apiStatus}</p>
            <p>{apiStatus.error}</p>
            {isConfirming && (
                <Notification
                    message={'Waiting for confirmation'}
                    type={NotificationType.INFO}
                />
            )}
            {isConfirmed && (
                <Notification
                    message={'Transaction Confirmed'}
                    type={NotificationType.SUCCESS}
                />
            )}
            {error && (
                <Notification
                    message={`Error: ${error.message}`}
                    type={NotificationType.ERROR}
                />
            )}
        </div>
    )
}

export default UploadObservation
