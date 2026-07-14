# Deployment Guide

This project is built on **Next.js 15 (App Router)** and optimized for Vercel, which provides the best out-of-the-box performance and global edge delivery for Next.js applications.

## Deploying to Vercel (Recommended)

1. Push this directory (`v2-awwwards`) to a new GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com).
3. Click **Add New** -> **Project**.
4. Import your repository.
5. In the **Framework Preset**, Vercel will automatically detect `Next.js`.
6. Leave the Build Command and Output Directory as their defaults (`npm run build` and `.next`).
7. Click **Deploy**.

## Deploying to Netlify / Cloudflare Pages

This app uses standard Next.js build commands.
- For Netlify, install the `@netlify/plugin-nextjs`.
- For Cloudflare Pages, use the `@cloudflare/next-on-pages` adapter if edge rendering is heavily used.

## Performance Optimization Checks Before Deployment
- Verify Lighthouse scores locally by running `npm run build && npm run start` and using the Chrome DevTools Lighthouse tab.
- All heavy 3D assets (React Three Fiber canvas) are dynamically imported using `next/dynamic` to ensure the Time To Interactive (TTI) is not blocked.
- Ensure all images are optimized using the `<Image />` component from `next/image` if added later.
