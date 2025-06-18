# Agrotech Mobile Application

## 🚧 Project Status: Initial Development Phase 🚧

**Welcome to the Agrotech mobile application!** This application is a professional extension of the functional web MVP, designed to connect with Firebase (Authentication and Firestore) and provide essential services for the agricultural sector in Colombia. This project is being built using React Native with Expo.

## 🎯 Objective

To develop a multiplatform mobile application that allows farmers and administrators to manage users, drone flights, fumigations, and products intuitively and efficiently, leveraging Firebase for backend services.

## 🚀 Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI: `npm install -g expo-cli`
*   Git

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd agrotech-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # OR
    # yarn install
    ```

3.  **Set up Environment Variables:**
    *   Create a `.env` file in the root of the `agrotech-app` directory:
        ```bash
        touch .env
        ```
    *   Populate `.env` with your Firebase project configuration keys. These are necessary for the application to connect to your Firebase backend. **Do not commit this file to version control if it contains real credentials.**
        ```env
        EXPO_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
        EXPO_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
        EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
        EXPO_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
        EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" # Optional
        ```
        *(Note: The `EXPO_PUBLIC_` prefix is important for these variables to be accessible in an Expo managed workflow.)*

4.  **Start the development server:**
    ```bash
    npm start
    # OR
    # expo start
    ```
    This will open the Expo Developer Tools in your browser. You can then run the app on:
    *   An Android or iOS emulator/simulator.
    *   The Expo Go app on your physical device by scanning the QR code.

## 📁 Folder Structure

The project follows a standard React Native structure:

```
agrotech-app/
├── .expo/               # Expo build and cache files
├── .git/                # Git version control files
├── assets/              # Static assets (images, fonts)
├── node_modules/        # Project dependencies
├── src/                 # Main source code directory
│   ├── components/      # Reusable UI components (e.g., buttons, cards)
│   ├── config/          # Configuration files (e.g., Firebase setup)
│   ├── context/         # React Context API for state management (e.g., AuthContext)
│   ├── navigation/      # Navigation setup (e.g., stack, tab navigators)
│   ├── screens/         # Top-level screen components for each route
│   └── services/        # Modules for interacting with external services (e.g., Firebase API calls beyond auth)
├── .env                 # Environment variables (Firebase keys, etc.) - MUST NOT BE COMMITTED
├── .gitignore           # Specifies intentionally untracked files that Git should ignore
├── App.js               # Main entry point of the application
├── app.json             # Expo configuration file
├── babel.config.js      # Babel configuration for JavaScript transpilation
├── package.json         # Project metadata and dependencies
└── README.md            # This file
```

## 🧑‍🌾 User Roles & Access (Initial Setup)

The application will feature different user roles with varying levels of access:

*   **Administrator:**
    *   Can access all application functions.
    *   Visualizes all flights, users, and data.
    *   Can edit data of other users and correct records.
*   **Drone Operator:**
    *   Manages assigned flights.
    *   Views their own flight history.
    *   Registers fumigations performed.
*   **Farmer:**
    *   (Default role upon registration)
    *   Visualizes their own fields and fumigations.
    *   Can request new flights or services.
    *   Consults product and weather recommendations.

*(Role-based access control is currently in its initial setup phase. More granular permissions will be implemented as features are developed.)*

## 📲 Core Functionalities (Current & Planned)

### Implemented:
*   **Project Setup:** React Native with Expo, basic directory structure.
*   **Firebase Integration:** Core setup for Firebase (Auth, Firestore).
*   **Authentication:**
    *   User registration (email/password) with default 'farmer' role stored in Firestore.
    *   User login (email/password).
    *   User logout.
    *   Password recovery (email-based).
    *   Session management using React Context.
*   **Basic Navigation:**
    *   Auth flow navigation (Login, Register, Password Recovery).
    *   Main app navigation (Tab-based: Home, Flights, Fumigation, Products, Profile) for authenticated users.
*   **UI Shells:** Basic screens for authentication and main app sections using `react-native-paper`.

### Key Planned Features:
*   **Role-Based Access Control (RBAC):** Full implementation of permissions and conditional UI rendering based on user roles.
*   **Drone Flight Management:** Viewing, registering, and updating flight details.
*   **Fumigation Logging:** Recording detailed fumigation data.
*   **Product & Mixture Calculation:** Interactive tool for calculating product mixtures per hectare for Glifosato, Mancozeb, Clorpirifós.
*   **Admin Dashboard:** Comprehensive data visualization and management tools for administrators.
*   **Farmer-Specific Views:** Tailored information and service request forms for farmers.
*   **General Statistics:** Data aggregation and display for admins.
*   **Modern UI/UX:** Clean, responsive, and professional design.

## 📦 Key Dependencies

*   `expo`
*   `react` & `react-native`
*   `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`
*   `firebase` (for Authentication and Firestore)
*   `react-native-paper` (for UI components)
*   `expo-constants` & `react-native-dotenv` (for environment variables)

---

This README will be updated as the project progresses.
