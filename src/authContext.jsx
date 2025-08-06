// authContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from "./firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Create auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is already logged in (from localStorage) - fallback only
  useEffect(() => {
    // This will be overridden by Firebase auth listener
    const storedUser = localStorage.getItem("parkingAppUser");
    if (storedUser && !auth.currentUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          email: firebaseUser.email,
          name: "Admin",
          role: "admin",
          uid: firebaseUser.uid,
        };
        setUser(userData);
        localStorage.setItem("parkingAppUser", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("parkingAppUser");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function with Firebase Auth
  const login = async (email, password) => {
    try {
      // For development, still allow static credentials
      if (
        email === "spark_admin@spark.com" &&
        password === "SparkMachineries@2024"
      ) {
        // Try Firebase Auth first, fallback to static
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (authError) {
          // If Firebase auth fails, use static auth
          console.warn(
            "Firebase auth failed, using static auth:",
            authError.message
          );
          const userData = { email, name: "Admin", role: "admin" };
          setUser(userData);
          localStorage.setItem("parkingAppUser", JSON.stringify(userData));
          return userData;
        }
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw new Error("Invalid email or password");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("parkingAppUser");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
