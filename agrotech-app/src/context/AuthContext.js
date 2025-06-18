// In agrotech-app/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, firestore } from '../config/firebaseConfig'; // Import firestore
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // State for user role
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        // Fetch user role from Firestore
        const userDocRef = doc(firestore, 'users', authenticatedUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserRole(userDocSnap.data().role);
        } else {
          // This case might happen if user record in Firestore is deleted manually
          // Or if registration didn't complete fully. Assign a default or handle error.
          console.warn("User document not found in Firestore for UID:", authenticatedUser.uid);
          setUserRole('farmer'); // Default role or handle as an error/incomplete profile
        }
        setUser(authenticatedUser);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle fetching role
    } catch (e) {
      console.error("Login Error:", e);
      throw e;
    }
  };

  const register = async (email, password, name = '') => { // Added name parameter
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      // Create user document in Firestore with default role 'farmer'
      const userDocRef = doc(firestore, 'users', newUser.uid);
      await setDoc(userDocRef, {
        uid: newUser.uid,
        email: newUser.email,
        name: name, // Store the name
        role: 'farmer', // Default role
        createdAt: new Date(),
      });
      // onAuthStateChanged will set user and role
    } catch (e) {
      console.error("Registration Error:", e);
      // If user was created in Auth but Firestore doc failed, consider cleanup or retry logic
      throw e;
    }
  };

  const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      console.error("Password Reset Error:", e);
      throw e;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will clear user and role
    } catch (e) {
      console.error("Logout Error:", e);
      throw e;
    }
  };

  if (loading) {
    return null; // Or a global loading indicator
  }

  return (
    <AuthContext.Provider value={{
      user,
      userRole, // Expose userRole
      login,
      register,
      sendPasswordReset,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
