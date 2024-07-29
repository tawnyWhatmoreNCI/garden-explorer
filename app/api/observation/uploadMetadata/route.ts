import { BlobServiceClient } from '@azure/storage-blob'
import * as dotenv from 'dotenv'
import { sha256 } from 'js-sha256'
dotenv.config()

interface UploadMetadata {}

//reference:
//https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-upload-typescript
export async function POST(request: Request) {
    // Ensure the request is of type POST and contains FormData
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }

    //get tokenid from the request
    const requestBody = await request.json()
    const metadata = requestBody.metadata
    const tokenId = metadata.tokenId

    //validate tokenId
    if (!tokenId) {
        return new Response('TokenId not found in the request', { status: 400 })
    }

    //validate metadata
    if (!metadata) {
        return new Response('Metadata not found in the request', {
            status: 400,
        })
    }

    // Azure Storage Configuration
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
    const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN
    if (!accountName || !sasToken) {
        return new Response('Azure Storage configuration not found', {
            status: 500,
        })
    }

    const blobServiceUri = `https://${accountName}.blob.core.windows.net/observations?${sasToken}`

    // Initialize BlobServiceClient
    const blobServiceClient = new BlobServiceClient(blobServiceUri)

    const containerName = 'metadata'
    const blobName = `${tokenId}.json`

    try {
        const containerClient =
            blobServiceClient.getContainerClient(containerName)
        const blobClient = containerClient.getBlockBlobClient(blobName)

        //upload the request body json to blob
        const jsonBytes = Buffer.from(JSON.stringify(requestBody))
        await blobClient.uploadData(jsonBytes)

        //hash the bytes
        var hash = sha256.create()
        hash.update(jsonBytes)
        //prefixing with 0x is a universal identifier for hex values. 
        //without this the contract will not recognise that this is hex and belongs in a bytes32 type variable.
        const hashAsHex = `0x${hash.hex()}`;

        console.log(`Hash: ${hashAsHex}`);
        console.log(`Blob URL: ${blobClient.url}`);

        // Success response
        return new Response(
            JSON.stringify({
                success: true,
                mediaUrl: blobClient.url,
                metadataHash: hashAsHex,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    } catch (error) {
        console.error('Upload error:', error)
        return new Response('Error uploading file', { status: 500 })
    }
}
