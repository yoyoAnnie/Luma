/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Heart, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onDemoScroll: () => void;
  onBreatheScroll: () => void;
  isLightMode: boolean;
  setIsLightMode: (val: boolean) => void;
}

export default function Header({
  onDemoScroll,
  onBreatheScroll,
  isLightMode,
  setIsLightMode
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
        <div id="company_logo_group" className="flex items-center gap-3">
          <div className={`relative w-9 h-9 rounded-full bg-gradient-to-tr from-luma-glow to-luma-lavender flex items-center justify-center p-[1px] shadow-sm`}>
            <div className={`w-full h-full rounded-full flex items-center justify-center ${
              isLightMode ? "bg-slate-50" : "bg-midnight-deep"
            }`}>
              <Sparkles className="w-4.5 h-4.5 text-indigo-600 dark:text-luma-glow animate-pulse" />
            </div>
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
            className={`transition-colors duration-300 hover:text-indigo-600 ${
              isLightMode ? "text-slate-600" : "text-gray-400 hover:text-white"
            }`}
          >
            Slowing Down
          </button>
          <button
            onClick={onDemoScroll}
            className={`transition-colors duration-300 flex items-center gap-1.5 hover:text-indigo-600 ${
              isLightMode ? "text-slate-600" : "text-gray-400 hover:text-white"
            }`}
          >
            Empathetic Translation <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          </button>
        </nav>

        {/* Live Active status indicator and Theme switcher */}
        <div className="flex items-center gap-3">
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
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
            isLightMode
              ? "bg-indigo-50/70 border-indigo-100"
              : "bg-white/3 border-white/5"
          }`}>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500/20 animate-pulse" />
            <span className={`text-[10px] font-mono tracking-wider uppercase ${
              isLightMode ? "text-indigo-900" : "text-gray-300"
            }`}>
              Taking a moment
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
