import type { NextPage } from 'next'
import {
    useReadContract,
    useWriteContract,
    useAccount,
    useWaitForTransactionReceipt,
} from 'wagmi'
import observationAbi from '../src/lib/Observation.json'
import { useEffect, useState } from 'react'
import useNextObservationId from '../hooks/useNextObservationId'
import useGardenExplorerBalance from '../hooks/useGardenExplorerBalance'
import Notification, { NotificationType } from '../components/Notification'
import styles from '../styles/UploadObservation.module.css'
import Link from 'next/link'

export enum ObservationApiStatus {
    IDLE,
    PREPARING,
    UPLOADING_MEDIA,
    IDENTIFYING,
    UPLOADING_METADATA,
    MINTING,
    DONE,
    ERROR,
}

const UploadObservation: NextPage = () => {
    function isStringNotNullOrEmpty(value: string | null | undefined): boolean {
        return value !== null && value !== undefined && value.trim() !== ''
    }

    const { address, isConnected } = useAccount()
    const { hasGardenBalance, balance, isPendingBalance, balanceError } =
        useGardenExplorerBalance()
    //contract addresses
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`
    const gardenContract = process.env
        .NEXT_PUBLIC_CONTRACT_GARDEN_EXPLORER as `0x${string}`

    //web3
    const { data: hash, error, isPending, writeContract } = useWriteContract()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const onFileChange = (event: any) => {
        setSelectedFile(event.target.files[0])
    }

    const [description, setDescription] = useState<string>('')
    const onDescriptionChange = (event: any) => {
        setDescription(event.target.value)
    }

    const [aiIdCommonName, setAiIdCommonName] = useState<string>('')

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    const tokenId = useNextObservationId()
    const [apiStatus, setApiStatus] = useState<{
        apiStatus: ObservationApiStatus
        error?: string
    }>({
        apiStatus: ObservationApiStatus.IDLE,
    })

    const onFileUpload = async () => {
        setApiStatus({ apiStatus: ObservationApiStatus.PREPARING, error: '' }) //clear the error
        // Guard against no file
        if (!selectedFile) {
            setApiStatus({
                apiStatus: ObservationApiStatus.ERROR,
                error: 'No file selected',
            })
            return
        }
        // guard against no garden explorer NFT
        if (!hasGardenBalance) {
            setApiStatus({
                apiStatus: ObservationApiStatus.ERROR,
                error: 'You need to mint a Garden Explorer NFT before you can upload an observation',
            })
            return
        }

        // Create formData
        const formData = new FormData()
        // Update the formData object
        formData.append('file', selectedFile, selectedFile.name)

        //1: Make a POST request to upload the media
        console.log(`formData: ${JSON.stringify(formData)}`)
        setApiStatus({ apiStatus: ObservationApiStatus.UPLOADING_MEDIA })
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
            const identifyBody = JSON.stringify({
                mediaUrl,
                description,
                hasGardenBalance,
            })
            console.log(`identifyBody: ${identifyBody}`)
            //2: Call the recognition API
            setApiStatus({ apiStatus: ObservationApiStatus.IDENTIFYING })
            const recognitionResponse = await fetch(
                '/api/observation/identify',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: identifyBody,
                }
            )
            const recognitionData = await recognitionResponse.text()
            console.log(`Recognition response from server: ${recognitionData}`)
            //check for error
            if (!recognitionResponse.ok) {
                setApiStatus({
                    apiStatus: ObservationApiStatus.ERROR,
                    error: 'Error identifying the observation',
                })
            } else {
                //parse the AI response to json and upload to blob
                //use tokenid as name of json file to integrate with the baseURI of the token.
                console.log('trying to parse metadata...')

                // Parse the recognition data
                const metadata = JSON.parse(recognitionData)

                //Add the media url
                metadata.mediaUrl = mediaUrl
                // Add tokenId to metadata
                metadata.tokenId = tokenId
                //set the confidence to 'ai' instead of a rating. we can
                metadata.id_confidence_level = 'AI'
                //observer field equals the minter
                metadata.observer = address
                //empty userObservation array - for users to suggest their thougths on the observation
                //userobservation will be observer: address, common_name: string, description: string, id_confidence_level: string
                metadata.userObservations = []

                //save common name as state for use in progress notification later.
                setAiIdCommonName(metadata.common_name)

                // Convert BigInt properties to strings
                const replacer = (key: string, value: any) => {
                    return typeof value === 'bigint' ? value.toString() : value
                }

                console.log(
                    `Metadata parsed: ${JSON.stringify(metadata, replacer, 2)}`
                )

                console.log('uploading metadata to blob...')
                //3: Upload metadata to blob storage
                setApiStatus({
                    apiStatus: ObservationApiStatus.UPLOADING_METADATA,
                })
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
                if (metadataResponse.ok) {
                    //metadata response should contain the url of the uploaded metadata json file.
                    const uploadMetadataReponseData =
                        await metadataResponse.text()
                    const metadataUrl = JSON.parse(
                        uploadMetadataReponseData
                    ).mediaUrl
                    const metadataHash = JSON.parse(
                        uploadMetadataReponseData
                    ).metadataHash
                    console.log(`Metadata hash: ${metadataHash}`)
                    console.log(`Metadata url: ${metadataUrl}`)

                    //4: Mint the observation NFT
                    setApiStatus({ apiStatus: ObservationApiStatus.MINTING })
                    mintObservation(metadataHash)
                } else {
                    setApiStatus({
                        apiStatus: ObservationApiStatus.ERROR,
                        error: 'Error uploading metadata',
                    })
                }
            }
        } else {
            setApiStatus({
                apiStatus: ObservationApiStatus.ERROR,
                error: 'Error uploading media',
            })
        }
    }

    /**
     *
     * @param metadataChecksum hash of sha256
     */
    async function mintObservation(metadataChecksum: string) {
        if (isConnected) {
            console.log(
                `Minting observation for address: ${address}, checksum ${metadataChecksum}`
            )

            if (isStringNotNullOrEmpty(metadataChecksum)) {
                writeContract({
                    address: observationContract,
                    abi: observationAbi.abi,
                    functionName: 'createObservation',
                    args: [address, metadataChecksum],
                })
            } else {
                alert('could not get checksum of metadata')
            }
        } else {
            alert('Please connect your wallet')
        }
    }

    return (
        <div className="container">
            <h1>Upload an Observation</h1>
            <p>
                Upload your observations to the Garden Explorer platform. Share
                your findings with the community and help us build a global
                dataset for ecological research. Earn badges as you upload more.
            </p>
            {!isConnected && (
                <p className={styles.centered}>
                    To get started, connect your wallet!
                </p>
            )}
            {!hasGardenBalance && (
                <p className={styles.centered}>
                    To upload an observation, you first need to mint a Garden
                    Explorer NFT from <Link href="/userSpace">Your Space</Link>
                </p>
            )}

            {hasGardenBalance && (
                <div className={styles.centered}>
                    {selectedFile && (
                        <div>
                            <label htmlFor="refile">
                                <img
                                    className={styles.previewFile}
                                    src={URL.createObjectURL(selectedFile)}
                                />
                            </label>
                            <input
                                type="file"
                                className={styles.fileinput}
                                id="refile"
                                onChange={onFileChange}
                            />

                            <p className="imageName">{selectedFile.name}</p>
                        </div>
                    )}
                    {!selectedFile && (
                        <div className={styles.uploadcontainer}>
                            <input
                                type="file"
                                className={styles.fileinput}
                                id="file"
                                onChange={onFileChange}
                            />
                            <label htmlFor="file" className={styles.filelabel}>
                                First, Upload An Image
                            </label>
                        </div>
                    )}
                    <textarea
                        rows={3}
                        cols={50}
                        placeholder="(Optional) Enter a description of what you saw. This will help AI determine its results more accurately."
                        className={styles.description}
                        disabled={!selectedFile}
                        onChange={onDescriptionChange}
                    />

                    <button
                        className="actionButton"
                        onClick={onFileUpload}
                        disabled={!selectedFile}
                    >
                        Upload Observation
                    </button>
                    {hash && (
                        <Notification
                            message={`Transaction Hash: ${hash}`}
                            type={NotificationType.INFO}
                        />
                    )}
                    {/*API loading status */}
                    {apiStatus.apiStatus === ObservationApiStatus.PREPARING && (
                        <Notification
                            message={'Preparing to upload observation...'}
                            type={NotificationType.INFO}
                        />
                    )}
                    {apiStatus.apiStatus ===
                        ObservationApiStatus.UPLOADING_MEDIA && (
                        <Notification
                            message={'Uploading media...'}
                            type={NotificationType.INFO}
                        />
                    )}
                    {apiStatus.apiStatus ===
                        ObservationApiStatus.IDENTIFYING && (
                        <Notification
                            message={'Identifying observation...'}
                            type={NotificationType.INFO}
                        />
                    )}
                    {apiStatus.apiStatus ===
                        ObservationApiStatus.UPLOADING_METADATA && (
                        <Notification
                            message={'Uploading metadata...'}
                            type={NotificationType.INFO}
                        />
                    )}
                    {apiStatus.apiStatus === ObservationApiStatus.MINTING && (
                        <Notification
                            message={
                                aiIdCommonName
                                    ? `Identified as ${aiIdCommonName}. Minting observation...`
                                    : `Minting observation...`
                            }
                            type={NotificationType.INFO}
                        />
                    )}
                    {apiStatus.apiStatus === ObservationApiStatus.ERROR && (
                        <Notification
                            message={`Error: ${apiStatus.error}`}
                            type={NotificationType.ERROR}
                        />
                    )}
                    {isConfirming && (
                        <Notification
                            message={'Waiting for confirmation...'}
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
            )}
        </div>
    )
}

export default UploadObservation
