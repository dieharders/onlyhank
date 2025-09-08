import { google } from "googleapis";
import * as path from "path";

export interface DriveFolder {
  id: string;
  name: string;
  description?: string;
  createdTime: string;
}

class GoogleDriveService {
  public drive: any = null; // Initialize as null
  private auth: any = null;
  private initialized = false;

  constructor() {
    // Initialize immediately in constructor
    this.initialize();
  }

  private initialize() {
    if (this.initialized) return;

    // Validate environment variables
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH;
    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    if (!keyPath) {
      throw new Error(
        "Missing required environment variable: GOOGLE_SERVICE_ACCOUNT_KEY_PATH"
      );
    }

    if (!parentFolderId) {
      throw new Error(
        "Missing required environment variable: GOOGLE_DRIVE_PARENT_FOLDER_ID"
      );
    }

    try {
      // Create service account auth
      this.auth = new google.auth.GoogleAuth({
        keyFile: path.resolve(keyPath),
        scopes: [
          "https://www.googleapis.com/auth/drive.readonly",
          // Add 'https://www.googleapis.com/auth/drive' for full access if needed
        ],
      });

      this.drive = google.drive({ version: "v3", auth: this.auth });

      console.log("Google Drive service initialized with service account");
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize Google Drive service:", error);
      throw new Error(
        `Failed to load service account key from ${keyPath}: ${error}`
      );
    }
  }

  // Ensure initialization before any method call
  private ensureInitialized() {
    if (!this.initialized || !this.drive) {
      this.initialize();
    }
  }

  private extractFolderIdFromUrl(urlOrId: string): string {
    // Handle both folder URLs and direct folder IDs
    if (urlOrId.includes("drive.google.com")) {
      const match = urlOrId.match(/\/folders\/([a-zA-Z0-9-_]+)/);
      if (match) {
        return match[1];
      }
      throw new Error(`Could not extract folder ID from URL: ${urlOrId}`);
    }
    return urlOrId;
  }

  async getFoldersByType(
    folderType: "photos" | "videos"
  ): Promise<DriveFolder[]> {
    this.ensureInitialized(); // Ensure initialization

    try {
      // Extract folder ID from URL if needed
      const parentFolderUrl = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!;
      const parentFolderId = this.extractFolderIdFromUrl(parentFolderUrl);

      console.log(`Using parent folder ID: ${parentFolderId}`);

      // First, find the photos or videos subfolder
      const subfolderQuery = `'${parentFolderId}' in parents and name='${folderType}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

      console.log(
        `Searching for ${folderType} folder with query:`,
        subfolderQuery
      );

      const subfolderResponse = await this.drive.files.list({
        q: subfolderQuery,
        fields: "files(id, name)",
      });

      if (
        !subfolderResponse.data.files ||
        subfolderResponse.data.files.length === 0
      ) {
        console.warn(`No ${folderType} folder found in parent folder`);
        return [];
      }

      const targetFolderId = subfolderResponse.data.files[0].id;
      console.log(`Found ${folderType} folder with ID:`, targetFolderId);

      // Get all folders within the photos/videos folder
      const foldersQuery = `'${targetFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`;

      console.log(`Searching for subfolders with query:`, foldersQuery);

      const response = await this.drive.files.list({
        q: foldersQuery,
        fields: "files(id, name, description, createdTime)",
        orderBy: "createdTime desc",
      });

      const folders: DriveFolder[] =
        response.data.files?.map((file: any) => ({
          id: file.id!,
          name: file.name!,
          description: file.description || "",
          createdTime: file.createdTime!,
        })) || [];

      console.log(`Found ${folders.length} folders in ${folderType}`);
      return folders;
    } catch (error: any) {
      console.error("Error fetching folders from Google Drive:", {
        message: error.message,
        code: error.code,
        status: error.status,
        details: error.errors,
      });

      // Provide more specific error messages
      if (error.code === 403) {
        throw new Error(
          `Access denied. Make sure the service account has access to the Google Drive folder. Error: ${error.message}`
        );
      } else if (error.code === 404) {
        throw new Error(
          `Folder not found. Check that the parent folder ID is correct and accessible. Error: ${error.message}`
        );
      } else if (error.message?.includes("keyFile")) {
        throw new Error(
          `Service account key file not found or invalid. Check GOOGLE_SERVICE_ACCOUNT_KEY_PATH. Error: ${error.message}`
        );
      }

      throw new Error(`Google Drive API error: ${error.message}`);
    }
  }

  // Test method to verify connection and permissions
  async testConnection(): Promise<boolean> {
    this.ensureInitialized(); // Ensure initialization

    try {
      // Test basic API access
      const about = await this.drive.about.get({ fields: "user" });
      console.log(
        "Google Drive connection successful. Service account email:",
        about.data.user?.emailAddress
      );

      // Test access to parent folder
      const parentFolderUrl = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID!;
      const parentFolderId = this.extractFolderIdFromUrl(parentFolderUrl);

      const folderInfo = await this.drive.files.get({
        fileId: parentFolderId,
        fields: "id, name, permissions",
      });

      console.log(
        `Successfully accessed parent folder: ${folderInfo.data.name} (${folderInfo.data.id})`
      );
      return true;
    } catch (error: any) {
      console.error("Google Drive connection test failed:", {
        message: error.message,
        code: error.code,
        status: error.status,
      });

      if (error.code === 403) {
        console.error(
          "PERMISSION ERROR: The service account does not have access to the specified folder."
        );
        console.error("To fix this:");
        console.error("1. Open the Google Drive folder in your browser");
        console.error(
          '2. Click "Share" and add the service account email with Viewer permission'
        );
        console.error(
          `3. Service account email can be found in your ${process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH} file`
        );
      }

      return false;
    }
  }
}

export default GoogleDriveService;
