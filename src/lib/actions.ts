"use server";

import { googleDriveService, type DriveFolder } from "./google-drive";

export async function getContentByType(
  contentType: "photos" | "videos"
): Promise<DriveFolder[]> {
  try {
    const folders = await googleDriveService.getFoldersByType(contentType);
    return folders;
  } catch (error) {
    console.error(`Error fetching ${contentType} content:`, error);
    return [];
  }
}
