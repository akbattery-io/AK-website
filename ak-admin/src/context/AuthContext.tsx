"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

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
    // Check active session immediately on mount
    const checkSession = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        const currentUser = session?.user || null;
        if (currentUser) {
          if (currentUser.email !== "akbattery.ro@gmail.com") {
            setError(
              `Access Denied. The email "${currentUser.email}" is not authorized. Only akbattery.ro@gmail.com can log in.`
            );
            await supabase.auth.signOut();
            setUser(null);
          } else {
            setUser(currentUser);
            setError(null);
          }
        } else {
          setUser(null);
        }
      } catch (e: any) {
        console.error("Error retrieving session", e);
        setError(e.message || "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      const currentUser = session?.user || null;
      if (currentUser) {
        if (currentUser.email !== "akbattery.ro@gmail.com") {
          setError(
            `Access Denied. The email "${currentUser.email}" is not authorized. Only akbattery.ro@gmail.com can log in.`
          );
          try {
            await supabase.auth.signOut();
          } catch (e) {
            console.error("Sign out error", e);
          }
          setUser(null);
        } else {
          setUser(currentUser);
          setError(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
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
