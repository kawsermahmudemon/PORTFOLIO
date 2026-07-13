# 🚀 Deployment Guide

Your cinematic portfolio is 100% complete and ready to be deployed to the world! Follow these steps to push your code to GitHub and host it live on Vercel.

## 1. Push to GitHub

Open your terminal or command prompt, navigate to your portfolio folder (`c:\PORTFOLIO`), and run these commands one by one:

```bash
# Initialize git repository
git init

# Add all your files
git add .

# Commit your files
git commit -m "Initial commit: World-class cinematic portfolio"

# Create a new repository on GitHub and link it
# (Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual GitHub details)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push your code to GitHub
git push -u origin main
```

## 2. Deploy to Vercel

Once your code is on GitHub, deploying to Vercel is extremely simple:

1. Go to [Vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** and select **"Project"**.
3. You will see your new GitHub repository in the list. Click **"Import"**.
4. Leave all the default settings as they are (Vercel will automatically detect our `vercel.json` and static files).
5. Click **"Deploy"**.

Wait about 30 seconds for Vercel to build your site. Once done, they will provide you with a live URL (e.g., `https://your-portfolio.vercel.app`).

## 3. Customize Your Content

Whenever you are ready to change the placeholder data to your real information:
1. Open `index.html` in a code editor.
2. Search for "Emon" and replace it with your details.
3. Replace the placeholder emojis in the project sections with actual screenshots of your work inside the `assets` or `images` folder.
4. Run `git add .`, `git commit -m "update content"`, and `git push` to see your changes instantly go live on Vercel!
