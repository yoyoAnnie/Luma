import React, { useState } from "react";
import { X, Mail, Lock, AlertCircle, Sparkles } from "lucide-react";
import { supabase } from "../supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isLightMode: boolean;
}

export default function AuthModal({ isOpen, onClose, onSuccess, isLightMode }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        if (signUpError) throw signUpError;
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (signInError) throw signInError;
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-midnight-deep/70 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={`relative w-full max-w-md rounded-3xl p-8 border shadow-2xl transition-all duration-300 transform scale-100 ${
        isLightMode
          ? "bg-white/95 border-slate-200/80 text-slate-800"
          : "bg-midnight-light/85 border-white/10 text-gray-200"
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-full border transition-all cursor-pointer ${
            isLightMode
              ? "border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              : "border-white/5 hover:border-white/15 text-gray-500 hover:text-white"
          }`}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-full bg-gradient-to-tr from-luma-glow to-luma-lavender mx-auto">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className={`text-2xl font-serif font-medium ${isLightMode ? "text-slate-900" : "text-white"}`}>
            {isSignUp ? "Create Your Sanctuary" : "Welcome Back"}
          </h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            {isSignUp
              ? "Securely archive and translate your clinic records under a personalized account."
              : "Enter your clinic credentials to access your secure translations vault."}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-xs text-red-400 flex items-start gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.com"
                className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-xs outline-none transition-all ${
                  isLightMode
                    ? "bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-800"
                    : "bg-midnight border-white/5 focus:border-luma-glow/40 focus:bg-midnight-deep text-white"
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-xs outline-none transition-all ${
                  isLightMode
                    ? "bg-slate-50 border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-800"
                    : "bg-midnight border-white/5 focus:border-luma-glow/40 focus:bg-midnight-deep text-white"
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-luma-glow via-luma-teal to-luma-lavender text-midnight font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
          >
            {loading ? (
              <span className="w-4 h-4 rounded-full border-2 border-midnight border-t-transparent animate-spin" />
            ) : (
              isSignUp ? "Sign Up" : "Log In"
            )}
          </button>
        </form>

        {/* Modal Switcher Toggle */}
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-xs font-mono tracking-wider text-gray-400 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have a sanctuary? Log In" : "Need a secure folder? Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}
