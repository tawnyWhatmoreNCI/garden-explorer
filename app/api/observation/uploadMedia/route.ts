import { BlobServiceClient } from '@azure/storage-blob';
import * as dotenv from 'dotenv';
dotenv.config();


//reference:
//https://learn.microsoft.com/en-us/azure/storage/blobs/storage-blob-upload-typescript
export async function POST(request: Request) {
  // Ensure the request is of type POST and contains FormData
  if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
  }

  // Extract FormData from the request
  const formData = await request.formData();
  const file = formData.get('file') as File;

  // Validate file existence
  if (!file) {
      return new Response('File not found in the request', { status: 400 });
  }

  // Azure Storage Configuration
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
  if (!accountName || !sasToken) {
      return new Response('Azure Storage configuration not found', { status: 500 });
  }

  const blobServiceUri = `https://${accountName}.blob.core.windows.net/observations?${sasToken}`;

  // Initialize BlobServiceClient
  const blobServiceClient = new BlobServiceClient(blobServiceUri);

  const containerName = 'media';
  const blobName = file.name;

  try {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(blobName);

      // Convert file to ArrayBuffer and upload
      const fileBuffer = await file.arrayBuffer();
      await blobClient.uploadData(fileBuffer);

      // Success response
      return new Response(JSON.stringify({ 
        success: true,
        mediaUrl: blobClient.url
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
      
  } catch (error) {
      console.error('Upload error:', error);
      return new Response('Error uploading file', { status: 500 });
  }
}