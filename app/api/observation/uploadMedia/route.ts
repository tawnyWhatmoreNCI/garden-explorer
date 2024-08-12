import { BlobServiceClient } from '@azure/storage-blob';
import * as dotenv from 'dotenv';
dotenv.config();

export async function POST(request: Request) {
  console.log('Received request:', request.method);

  if (request.method !== 'POST') {
      console.log('Method not allowed');
      return new Response('Method not allowed', { status: 405 });
  }

  try {
      const formData = await request.formData();
      const file = formData.get('file') as File;

      if (!file) {
          console.log('File not found in the request');
          return new Response('File not found in the request', { status: 400 });
      }

      const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
      const sasToken = process.env.AZURE_STORAGE_SAS_TOKEN;
      if (!accountName || !sasToken) {
          console.log('Azure Storage configuration not found');
          return new Response('Azure Storage configuration not found', { status: 500 });
      }

      const blobServiceUri = `https://${accountName}.blob.core.windows.net/observations?${sasToken}`;
      const blobServiceClient = new BlobServiceClient(blobServiceUri);

      const containerName = 'media';
      const blobName = file.name;

      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(blobName);

      const fileBuffer = await file.arrayBuffer();
      await blobClient.uploadData(fileBuffer);

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