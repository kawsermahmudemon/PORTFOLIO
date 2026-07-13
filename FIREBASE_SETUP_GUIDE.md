# 🔥 Firebase Admin Setup Guide

Your Admin Portal is ready! To make it work, we need to connect it to a free database where your images, videos, and texts will be saved.

Follow these simple steps to set up Firebase and connect it to your portfolio.

## Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Click on **Add project**.
3. Name your project (e.g., `emon-portfolio-db`) and click **Continue**.
4. You can disable Google Analytics for now, then click **Create project**.
5. Wait a few seconds for it to finish, then click **Continue**.

## Step 2: Register Your App
1. On your Firebase project dashboard, click the **Web icon (`</>`)** (it's a circle with `</>` inside).
2. Give your app a nickname (e.g., `portfolio-web`) and click **Register app**.
3. You will see a block of code labeled `firebaseConfig`. It looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
4. **Copy that entire `firebaseConfig` block**.

## Step 3: Connect Your Portfolio
1. Open your portfolio folder in your code editor.
2. Open the file `js/firebase-config.js`.
3. Replace the placeholder `firebaseConfig` in that file with the one you just copied.
4. Save the file.

## Step 4: Enable Authentication (Admin Login)
1. Go back to the Firebase Console menu (left side).
2. Click **Build > Authentication**, then click **Get Started**.
3. Under **Sign-in method**, click **Email/Password**.
4. Enable the first toggle (Email/Password) and click **Save**.
5. Now, go to the **Users** tab (at the top).
6. Click **Add user**. Enter your email and a strong password. This will be your Admin Login!

## Step 5: Enable Firestore Database (Text & Data)
1. Go to **Build > Firestore Database** from the left menu.
2. Click **Create database**.
3. Choose **Start in Test Mode** (or production mode, but we will update rules anyway) and click Next -> Enable.
4. Go to the **Rules** tab in Firestore and replace the rules with this to make it secure:
   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Anyone can read your portfolio data
       match /{document=**} {
         allow read: if true;
         // Only YOU (the logged-in admin) can write data
         allow write: if request.auth != null;
       }
     }
   }
   ```
5. Click **Publish**.

## Step 6: Enable Storage (Images & Videos)
1. Go to **Build > Storage** from the left menu.
2. Click **Get Started**, choose **Test Mode**, and click Next -> Done.
3. Go to the **Rules** tab in Storage and replace the rules with this:
   ```text
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
4. Click **Publish**.

---

# 🎉 You are done!

1. Open `admin.html` in your browser.
2. Log in with the Email & Password you created in Step 4.
3. You can now add your Projects, upload images/videos, and manage your portfolio!
4. Any project you add in the Admin panel will automatically appear on your main `index.html` portfolio site!
