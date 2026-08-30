# Security Guide - NZN MART

## Firebase Configuration Security

### ⚠️ IMPORTANT: Exposed Credentials

Your Firebase API key and project credentials were previously committed to the repository. **These have been revoked and are no longer valid.**

### How to Securely Configure Firebase

1. **Generate a new Firebase project** at https://console.firebase.google.com/
2. **Copy `.env.example` to `.env`:**
   ```bash
   cp .env.example .env
   ```

3. **Add your Firebase credentials to `.env`:**
   ```
   VITE_FIREBASE_API_KEY=your_new_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project.firebasedatabase.app
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Never commit `.env` file** - it's in `.gitignore`

### Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your credentials

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

### Security Best Practices

✅ **DO:**
- Store secrets in `.env` files locally
- Use environment variables for all sensitive data
- Add `.env` to `.gitignore`
- Rotate Firebase keys regularly
- Enable Firebase Security Rules for Firestore
- Enable Authentication restrictions in Firebase Console

❌ **DON'T:**
- Commit `.env` files to Git
- Share API keys in chat or emails
- Expose credentials in client-side code comments
- Use same keys across environments (dev, staging, prod)

### Firebase Security Rules

Ensure your Firestore rules restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Allow everyone to read products
    match /products/{document=**} {
      allow read: if true;
      allow write: if false; // Only admin can write
    }
    
    // Allow users to read/write their own orders
    match /orders/{uid}/orders/{orderId} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

### For Deployment

1. **GitHub Secrets** (for GitHub Actions):
   ```
   Settings → Secrets and variables → Actions
   ```
   Add your environment variables as secrets

2. **Vercel / Firebase Hosting**:
   Add environment variables in deployment settings

3. **Docker / Server**:
   Use environment variable injection at runtime

---

For more info: https://firebase.google.com/docs/auth/get-started
