/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Heart, Sun, Moon, User, LogOut } from "lucide-react";
import logoImg from "../logo.png";

interface HeaderProps {
  onDemoScroll: () => void;
  onBreatheScroll: () => void;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
  user: any;
  profile: any;
  onAuthClick: () => void;
  onProfileClick: () => void;
  onLogoClick: () => void;
  onSignOut: () => void;
}

export default function Header({
  onDemoScroll,
  onBreatheScroll,
  isLightMode,
  setIsLightMode,
  user,
  profile,
  onAuthClick,
  onProfileClick,
  onLogoClick,
  onSignOut
}: HeaderProps) {
  return (
    <header
      id="main_luxury_navigation_header"
      className={`sticky top-0 w-full z-40 transition-all duration-300 backdrop-blur-md border-b ${
        isLightMode
          ? "bg-white/80 border-slate-200/80 shadow-sm"
          : "bg-midnight-deep/60 border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo and tag */}
        <div
          id="company_logo_group"
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={onLogoClick}
        >
          <div className="relative w-9 h-9 overflow-hidden transition-transform duration-300 group-hover:scale-105">
            <img
              src={logoImg}
              alt="LUMA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className={`font-serif text-lg font-semibold tracking-wide ${
              isLightMode ? "text-slate-900" : "text-white"
            }`}>
              LUMA
            </h1>
            <p className={`text-[9px] uppercase font-mono tracking-widest -mt-0.5 ${
              isLightMode ? "text-indigo-600/75" : "text-[#B0B3C1]"
            }`}>
              Clarifying Your Care
            </p>
          </div>
        </div>

        {/* Premium editorial links */}
        <nav className={`hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase ${
          isLightMode ? "text-slate-500" : "text-gray-400"
        }`}>
          <button
            onClick={onBreatheScroll}
            className={`transition-colors duration-300 hover:text-indigo-600 cursor-pointer ${
              isLightMode ? "text-slate-600" : "text-gray-400 hover:text-white"
            }`}
          >
            Slowing Down
          </button>
          <button
            onClick={onDemoScroll}
            className={`transition-colors duration-300 flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer ${
              isLightMode ? "text-slate-600" : "text-gray-400 hover:text-white"
            }`}
          >
            Empathetic Translation <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          </button>
        </nav>

        {/* Action controls & Auth Profile */}
        <div className="flex items-center gap-4">
          
          {/* Theme switcher */}
          <button
            id="theme_mode_switch_btn"
            onClick={() => setIsLightMode(!isLightMode)}
            aria-label="Toggle visual theme mode"
            className={`p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center cursor-pointer ${
              isLightMode
                ? "bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100"
                : "bg-white/5 border-white/10 text-luma-glow hover:bg-white/10"
            }`}
          >
            {isLightMode ? (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/10" />
            ) : (
              <Sun className="w-4 h-4 text-luma-glow animate-spin" style={{ animationDuration: '8s' }} />
            )}
          </button>

          <button
            onClick={onDemoScroll}
            className={`hidden sm:inline-flex items-center justify-center text-xs font-mono tracking-wider uppercase transition-all duration-300 px-4 py-2 rounded-full cursor-pointer ${
              isLightMode
                ? "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 shadow-sm shadow-indigo-600/10"
                : "bg-white/5 text-gray-300 border border-white/10 hover:border-luma-glow/40 hover:text-white"
            }`}
          >
            Understand Your Note
          </button>
          
          {/* Auth / Profile Picture Placeholder */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Profile Avatar Trigger */}
                <button
                  id="header_profile_btn"
                  onClick={onProfileClick}
                  className={`relative w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 group ${
                    isLightMode
                      ? "bg-indigo-50 border-indigo-100 hover:bg-indigo-100"
                      : "bg-white/5 border-white/10 hover:border-luma-glow/40"
                  }`}
                  title="View Profile Dashboard"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      className="w-full h-full object-cover"
                      alt="User avatar"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-xs font-mono font-bold ${
                      isLightMode ? "text-indigo-600" : "text-luma-glow"
                    }`}>
                      {profile?.full_name ? profile.full_name[0].toUpperCase() : user.email[0].toUpperCase()}
                    </div>
                  )}
                </button>

                {/* Sign Out Shortcut Icon */}
                <button
                  onClick={onSignOut}
                  className={`p-2.5 rounded-full transition-all duration-300 border flex items-center justify-center cursor-pointer ${
                    isLightMode
                      ? "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-red-400 hover:border-red-400/30"
                  }`}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              // Blank avatar placeholder directing user to Login/SignUp
              <button
                id="header_login_placeholder_btn"
                onClick={onAuthClick}
                className={`relative w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-all duration-300 group ${
                  isLightMode
                    ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    : "bg-white/2 border-white/5 hover:border-luma-glow/40 text-gray-500 hover:text-white"
                }`}
                title="Log In / Sign Up"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
