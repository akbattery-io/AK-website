"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
  clearError: () => void;
  setErrorMsg: (msg: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  logout: async () => {},
  clearError: () => {},
  setErrorMsg: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // Enforce admin email rule
        if (firebaseUser.email !== "akbattery.ro@gmail.com") {
          setError(
            `Access Denied. The email "${firebaseUser.email}" is not authorized. Only akbattery.ro@gmail.com can log in.`
          );
          try {
            await signOut(auth);
          } catch (e) {
            console.error("Sign out error", e);
          }
          setUser(null);
        } else {
          setUser(firebaseUser);
          setError(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setError(null);
    } catch (e: any) {
      setError(e.message || "Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);
  const setErrorMsg = (msg: string | null) => setError(msg);

  return (
    <AuthContext.Provider value={{ user, loading, error, logout, clearError, setErrorMsg }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
