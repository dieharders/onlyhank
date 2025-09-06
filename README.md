# OnlyHank - Next.js 15 Cat Content Platform

A fun and playful cat-focused content platform built with Next.js 15, featuring Hank the Cat!

## Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
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
- [ ] Image upload functionality
- [ ] Payment integration
- [ ] Real-time messaging
