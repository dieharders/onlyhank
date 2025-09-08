'use server'

import GoogleDriveService, { type DriveFolder } from './google-drive'

export async function getContentByType(
  contentType: 'photos' | 'videos',
): Promise<DriveFolder[]> {
  try {
    const gdrive = new GoogleDriveService()
    const folders = await gdrive.getFoldersByType(contentType)
    return folders
  } catch (error) {
    console.error(`Error fetching ${contentType} content:`, error)
    return []
  }
}

interface DriveFile {
  id: string
  name: string
  thumbnailLink?: string
  webViewLink?: string
  mimeType: string
}

export async function getFolderFiles(folderId: string): Promise<DriveFile[]> {
  try {
    // console.log("=== getFolderFiles Debug ===");
    console.log('Folder ID:', folderId)

    const googleDriveService = new GoogleDriveService()
    // console.log('Google Drive service created')

    // First, let's verify the folder exists and we can access it
    try {
      const folderInfo = await googleDriveService.drive.files.get({
        fileId: folderId,
        fields: 'id, name, mimeType, parents',
      })
      console.log('Folder info:', folderInfo.data)
    } catch (folderError: any) {
      console.error('Cannot access folder:', folderError)
      throw new Error(`Cannot access folder ${folderId}: ${folderError.message}`)
    }

    // Now try to list the contents
    const query = `'${folderId}' in parents and trashed=false`
    // console.log("Query:", query);

    const response = await googleDriveService.drive.files.list({
      q: query,
      fields:
        'nextPageToken, files(id, name, thumbnailLink, webViewLink, mimeType, createdTime)',
      orderBy: 'createdTime desc',
      pageSize: 100,
    })

    // console.log("Raw API response:", JSON.stringify(response.data, null, 2));
    console.log('Files found:', response.data.files?.length || 0)

    // if (response.data.files) {
    //   response.data.files.forEach((file: any, index: number) => {
    //     console.log(`File ${index + 1}:`, {
    //       id: file.id,
    //       name: file.name,
    //       mimeType: file.mimeType,
    //       hasThumbnail: !!file.thumbnailLink,
    //     });
    //   });
    // }

    const files: DriveFile[] =
      response.data.files?.map((file: any) => ({
        id: file.id!,
        name: file.name!,
        thumbnailLink: file.thumbnailLink || undefined,
        webViewLink: file.webViewLink || undefined,
        mimeType: file.mimeType!,
      })) || []

    // console.log(`Returning ${files.length} files`);
    // console.log("=== End Debug ===");

    return files
  } catch (error: any) {
    console.error('=== getFolderFiles ERROR ===')
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.errors,
      stack: error.stack,
    })
    console.error('=== End ERROR ===')

    // Provide more specific error messages
    if (error.code === 403) {
      throw new Error(
        'Access denied to folder. Make sure the service account has permission to access this folder.',
      )
    } else if (error.code === 404) {
      throw new Error('Folder not found. The folder may have been moved or deleted.')
    } else if (error.message?.includes('keyFile')) {
      throw new Error(
        'Google Drive authentication failed. Check your service account key.',
      )
    }

    throw new Error(`Failed to fetch folder files: ${error.message || 'Unknown error'}`)
  }
}
