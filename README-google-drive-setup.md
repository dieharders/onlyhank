## Create Service Account:

1. Google Cloud Console → "APIs & Services" → "Credentials"
2. "Create Credentials" → "Service account"
3. Name: onlyhank-drive-reader
4. Click "Create and Continue"
5. Skip roles (click "Continue" → "Done")
6. Click on the service account
7. "Keys" tab → "Add Key" → "Create new key" → JSON
8. Download and save the JSON file

## Share Your Drive Folder:

1. Open the downloaded JSON file
2. Copy the client_email (looks like: onlyhank-drive-reader@your-project.iam.gserviceaccount.com)
3. In Google Drive, right-click your onlyhank folder
4. Click "Share"
5. Paste the service account email
6. Set permission to "Viewer"
7. Uncheck "Notify people"
8. Click "Share"

## Add Service Account Key and Folder Location as env variables:

### 1. For Local Development:

Keep using the service-account-key.json file
Add it to .gitignore so it's never committed

### 2. For Vercel Production:

Copy the entire JSON content from your key file
Paste it as an environment variable in Vercel dashboard
The code automatically detects which method to use

## Quick Vercel Setup:

### Step 1: Get Your JSON Content

1. Open your service-account-key.json file
2. Copy everything (the entire JSON object on one line)

### Step 2: Add to Vercel

1. Go to Vercel Dashboard
2. Select your project → Settings → Environment Variables
3. Click "Add New"
4. Name: GOOGLE_SERVICE_ACCOUNT_KEY
5. Value: Paste the entire JSON content
6. Environments: Select all (Production, Preview, Development)
7. Click "Save"
8. Add second variable:
9. Name: GOOGLE_DRIVE_PARENT_FOLDER_ID
10. Value: Your folder ID from Drive URL
11. Click "Save"

### Step 3: Redeploy

1. Go to Deployments tab
2. Click "Redeploy" on your latest deployment
