/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Heart } from "lucide-react";

interface FooterProps {
  isLightMode: boolean;
}

export default function Footer({ isLightMode }: FooterProps) {
  return (
    <footer
      id="main_luxury_footer"
      className={`w-full py-16 relative overflow-hidden transition-all duration-300 border-t ${
        isLightMode
          ? "bg-slate-100/80 border-slate-200"
          : "bg-[#03050C] border-white/5"
      }`}
    >
      <div className="absolute inset-0 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 items-start mb-16">
          {/* Luma Brand Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${isLightMode ? "text-indigo-600" : "text-luma-glow"}`} />
              <span className={`font-serif text-xl tracking-wider font-semibold ${
                isLightMode ? "text-slate-900" : "text-white"
              }`}>
                LUMA
              </span>
            </div>
            <p className={`text-sm font-sans max-w-sm leading-relaxed ${
              isLightMode ? "text-slate-600" : "text-gray-400"
            }`}>
              Clinical knowledge interpreted for human emotional regulation. We help you find clarity when medical complexity triggers anxiety and overwhelm.
            </p>
            <div className={`flex items-center gap-1.5 text-xs font-mono mb-2 ${
              isLightMode ? "text-slate-500" : "text-gray-400"
            }`}>
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>for healthy minds & hearts</span>
            </div>
          </div>

          {/* Healing Links */}
          <div className="space-y-4">
            <h4 className={`text-xs uppercase font-mono tracking-widest ${
              isLightMode ? "text-slate-900" : "text-[#B0B3C1]"
            }`}>
              Clarity Tools
            </h4>
            <ul className={`space-y-2 text-sm ${
              isLightMode ? "text-slate-600" : "text-gray-400"
            }`}>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-300 cursor-pointer">
                  Panic Mode Interpretations
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-300 cursor-pointer">
                  Burnout Mode Essentials
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-300 cursor-pointer">
                  Curious Biology Maps
                </span>
              </li>
              <li>
                <span className="hover:text-indigo-600 dark:hover:text-white transition-colors duration-300 cursor-pointer">
                  Personal Care Timelines
                </span>
              </li>
            </ul>
          </div>

          {/* Core Philosophy */}
          <div className="space-y-4">
            <h4 className={`text-xs uppercase font-mono tracking-widest ${
              isLightMode ? "text-slate-900" : "text-[#B0B3C1]"
            }`}>
              Philosophy & Sincerity
            </h4>
            <p className={`text-xs leading-relaxed max-w-xs ${
              isLightMode ? "text-slate-600" : "text-gray-400"
            }`}>
              Luma is an emotionally intelligent interpretation layers simulator. Our outputs do not replace professional clinical care, but bridge the gap between patient understanding and anxiety.
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className={`h-[1px] w-full mb-8 ${isLightMode ? "bg-slate-200" : "bg-white/5"}`} />

        {/* Legal and branding */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono ${
          isLightMode ? "text-slate-500" : "text-gray-500"
        }`}>
          <div>
            &copy; {new Date().getFullYear()} LUMA. Healthcare clarity designed for human emotion.
          </div>
          <div className="flex gap-6">
            <span className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">Privacy policy</span>
            <span className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">Terms of care</span>
            <span className="hover:text-indigo-600 dark:hover:text-white transition-colors cursor-pointer">Support system</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
