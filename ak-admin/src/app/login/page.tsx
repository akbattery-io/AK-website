"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Shield, Mail, Lock, LogIn, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, error, setErrorMsg, clearError } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // If user is already authenticated as the admin, redirect to dashboard
  useEffect(() => {
    if (!loading && user && user.email === "akbattery.ro@gmail.com") {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setLocalError(null);
    clearError();

    if (!email || !password) {
      setLocalError("Please fill in all fields.");
      setAuthLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Double check client side (the AuthContext also handles this onAuthStateChanged)
      if (userCredential.user.email !== "akbattery.ro@gmail.com") {
        setLocalError("Access Denied. Only akbattery.ro@gmail.com is authorized to enter this panel.");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Email login error:", err);
      let errMsg = "Authentication failed. Please check your credentials.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        errMsg = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errMsg = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        errMsg = "Too many login attempts. Please try again later.";
      }
      setLocalError(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    setLocalError(null);
    clearError();

    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== "akbattery.ro@gmail.com") {
        setLocalError(`Access Denied. The account ${result.user.email} is not authorized.`);
      } else {
        router.push("/");
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        setLocalError(err.message || "Failed to sign in with Google.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // Show loading skeleton while checking original firebase state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mesh-gradient">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm font-semibold animate-pulse">Checking credentials...</p>
        </div>
      </div>
    );
  }

  const displayedError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh-gradient px-4 py-12 relative overflow-hidden">
      {/* Background glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

      <div className="max-w-md w-full bg-white/70 backdrop-blur-xl border border-slate-100/80 rounded-3xl p-8 sm:p-10 shadow-[0_10px_50px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_60px_rgba(220,38,38,0.06)] transition-all duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl mb-4 shadow-sm shadow-rose-100">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight font-serif">
            AK Batteries
          </h1>
          <p className="text-slate-500 text-sm font-semibold mt-1.5 uppercase tracking-wider">
            Admin Panel Login
          </p>
        </div>

        {/* Display Error Message */}
        {displayedError && (
          <div className="mb-6 flex items-start gap-3 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-700 rounded-2xl p-4 text-xs font-semibold leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>{displayedError}</div>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                type="email"
                placeholder="akbattery.ro@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 text-sm text-slate-800 transition-all bg-white/50"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_4px_15px_rgba(15,23,42,0.15)] flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75 disabled:pointer-events-none"
          >
            {authLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4.5 h-4.5" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="bg-[#FAFBFD] px-4">Or sign in with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={authLoading}
          className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-75"
        >
          {/* Google Icon SVG */}
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.015c1.472 0 2.812.535 3.847 1.417l3.197-3.197C19.08 2.766 16.71 1.75 13.99 1.75c-5.94 0-10.75 4.81-10.75 10.75s4.81 10.75 10.75 10.75c6.26 0 11.238-4.488 11.238-10.75a8.7 8.7 0 0 0-.17-1.715H12.24Z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <p className="text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-8">
          Only authorized admin credentials will be granted access
        </p>
      </div>
    </div>
  );
}
