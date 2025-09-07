# OnlyHank.com - Cat Content Platform

A fun and playful cat-focused content platform built with Next.js 15, featuring Hank the Cat!

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Features

- ✨ Modern Next.js 15 with App Router
- 🐱 Cat-focused content platform
- 📱 Responsive design
- 🎨 Interactive components
- 💖 Real-time "purr" counter updates
- 🔒 Premium content simulation

## Project Structure

```
app/
├── components/
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── ProfileSection.tsx
│   ├── PremiumBanner.tsx
│   ├── ContentGrid.tsx
│   └── Footer.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

## Customization

Replace emoji placeholders with actual photos of Hank by:

1. Adding images to `public/images/`
2. Updating the content data in `ContentGrid.tsx`
3. Replacing emoji in `content-image` divs with `<img>` tags

## Future Features

- [ ] User authentication
- [ ] Multiple cat profiles
- [ ] Image upload functionality (via Google Drive)
- [ ] Payment integration
- [ ] Real-time messaging (Subs only!)

## ⚙️ Google Drive Integration Process:

### 1. Google Drive API Setup:

You'll need to:

- Create a Google Cloud project
- Enable Google Drive API
- Create OAuth 2.0 credentials
- Get a refresh token

### 2. Environment Setup

Create `.env.local` with your credentials:

```env
GOOGLE_SERVICE_ACCOUNT_KEY_PATH=./service-account-key.json
GOOGLE_DRIVE_PARENT_FOLDER_ID=your_onlyhank_folder_id
```

### 3. Google Drive Folder Structure

Create this structure in your Google Drive:

```
onlyhank/
├── photos/
│   ├── Morning Stretches/
│   ├── Sunbeam Naps/
│   └── Treat Reactions/
└── videos/
    ├── Zoomies/
    ├── Box Adventures/
    └── Toe Bean Close-ups/
```

### 4. Add Folder Descriptions

1. Right-click each content folder (Morning Stretches, etc.)
2. Select "View details" or "Manage"
3. Add descriptions in the folder's metadata/description field

## How It Works

1. **Server Actions**: Fetch folder data from Google Drive API
2. **Dynamic Content**: Cards generated from folder names and descriptions
3. **Content Types**: Navigation switches between photos and videos folders
4. **Real-time Updates**: Purr counters update periodically
5. **Error Handling**: Graceful handling of API errors and missing folders

## Folder Management

- **Folder Name** → Card Title
- **Folder Description** → Card Description
- **Creation Date** → Time ago display
- **Folder Location** → Content type (photos/videos)
