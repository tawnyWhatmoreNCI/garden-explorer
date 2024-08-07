import type { NextPage } from 'next'
import {
    useWriteContract,
    useAccount,
} from 'wagmi'
import useGardenExplorerBalance from '../hooks/useGardenExplorerBalance'
import { useRouter } from 'next/router'
import { ObservationProposal } from '../components/ObservationCard';
import ObservationAbi from '../src/lib/Observation.json'

{/**
     This page is a form that allows users to propose what they think a certain observation might be.
     Because AI often gets it wrong, it's important a community of people have the means to step in to correct it's mistakes.
     This form talks to an API that will update the json metadata with the form results in the blob storage, 
     and update the blockchain with the newest checksum of that data.
     Then when the client downloads the latest metadata it can compare with the latest blockchain store to validate it's integrity.
    */}
export const ProposeIdentification: NextPage = () => {
    const router = useRouter()
    const { address, isConnected } = useAccount()
    const { hasGardenBalance, balance, isPendingBalance, balanceError } =
        useGardenExplorerBalance()
    //contract addresses
    const observationContract = process.env
        .NEXT_PUBLIC_CONTRACT_OBSERVATIONS as `0x${string}`

    //web3
    const { data: hash, error, isPending, writeContract } = useWriteContract()
    const tokenId = router.query.slug as string

    const updateObservation = async (event: React.FormEvent) => {
        event.preventDefault();
    
        // Step 1: Get form data
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const commonName = formData.get('commonName') as string;
        const speciesDescription = formData.get('speciesDescription') as string;
        const confidence = formData.get('confidence') as string;
    
        // Step 2: Convert form data to JSON
        const proposal: ObservationProposal = {
            proposer: address,
            common_name: commonName,
            description: speciesDescription,
            id_confidence_level: confidence || '1',
        };
    
        try {
            // Step 3: Fetch metadata for token id from blob using base uri from contract
            const baseUri = await fetchBaseUriFromContract(observationContract, tokenId);
            const metadataUrl = `${baseUri}/${tokenId}.json`;
            const response = await fetch(metadataUrl);
            const metadata = await response.json();
    
            // Step 4: Update fetched metadata with new identification
            metadata.proposals = metadata.proposals || [];
            metadata.proposals.push(proposal);
    
            // Step 5: Upload and overwrite updated metadata to blob storage
            const updatedMetadata = JSON.stringify(metadata);
            await uploadToBlobStorage(metadataUrl, updatedMetadata);
    
            // Step 6: Update blockchain with the new checksum
            const checksum = calculateChecksum(updatedMetadata);
            await writeContract({
                abi: ObservationAbi.abi,
                address: observationContract,
                functionName: 'updateChecksum',
                args: [tokenId, checksum],
            });
    
            alert('Observation updated successfully!');
        } catch (error) {
            console.error('Error updating observation:', error);
            alert('Failed to update observation.');
        }
    };
    
    // Helper functions (you need to implement these)
    async function fetchBaseUriFromContract(contractAddress: string, tokenId: string): Promise<string> {
        // Implement the logic to fetch the base URI from the contract
        return 'https://example.com/metadata';
    }
    
    async function uploadToBlobStorage(url: string, data: string): Promise<void> {
        // Implement the logic to upload data to blob storage
    }
    
    function calculateChecksum(data: string): string {
        // Implement the logic to calculate the checksum of the data
        return 'checksum';
    }

    return (
        <div className="container">
            <p>Post: {router.query.slug}</p>
            <h1>Propose an Identification</h1>
            <p>Tell us what you think this Observation is.</p>
            <form onSubmit={updateObservation}>
                <label>
                    Common Name:
                    <input type="text" name="commonName" />
                </label>
                <label>
                    Description of species:
                    <input type="text" name="speciesDescription" />
                </label>
                <label>
                    Confidence of your identification
                    <input type="range" min="1" max="5" value="1" className="confidenceSlider" id="confidence"/>
                </label>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default ProposeIdentification
