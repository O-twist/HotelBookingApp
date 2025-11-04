🚀 Quick Start
1. Clone and Setup
bash
# Clone the repository
git clone <repository-url>
cd HotelBookingApp

# Install dependencies
npm install

# Install Expo specific dependencies
npx expo install
2. Firebase Setup
Create Firebase Project:

Go to Firebase Console

Click "Add project" and follow the setup wizard

Enable Authentication:

In your Firebase project, go to Authentication → Sign-in method

Enable "Email/Password" provider

Setup Firestore Database:

Go to Firestore Database → Create database

Start in test mode for development

Get Firebase Config:

Go to Project Settings → General → Your apps

Click "Add app" and select "Web"

Copy the firebaseConfig object

Update Firebase Configuration:

Open firebase.js in the project root

Replace the placeholder config with your actual Firebase config:

javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
3. Run the Application
bash
# Start the development server
npx expo start

# For specific platforms
npx expo start --android    # Android
npx expo start --ios        # iOS (macOS only)
npx expo start --web        # Web browser
4. Test on Device
Android: Scan QR code with Expo Go app

iOS: Scan QR code with Camera app

Web: Open http://localhost:8081 in browser
