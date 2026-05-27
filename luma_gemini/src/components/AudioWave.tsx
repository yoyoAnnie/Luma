/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Heart, Activity, Wind, RotateCcw } from "lucide-react";

interface AudioWaveProps {
  isLightMode: boolean;
}

export default function AudioWave({ isLightMode }: AudioWaveProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [breathState, setBreathState] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [seconds, setSeconds] = useState(4);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [selectedTempo, setSelectedTempo] = useState<"calm" | "deep" | "soothing">("calm");

  // Soft breathing loop (4s inhale, 4s hold, 4s exhale typical for box breathing)
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (breathState === "Inhale") {
            setBreathState("Hold");
            return selectedTempo === "deep" ? 5 : 4;
          } else if (breathState === "Hold") {
            setBreathState("Exhale");
            return selectedTempo === "deep" ? 6 : 4;
          } else {
            setBreathState("Inhale");
            setTotalBreaths((b) => b + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, breathState, selectedTempo]);

  // Adjust timings dynamically based on selected breathing tempo
  const handleTempoChange = (tempo: "calm" | "deep" | "soothing") => {
    setSelectedTempo(tempo);
    setBreathState("Inhale");
    setSeconds(4);
  };

  // State colors mapping to calm down visual overload
  const getGlowColor = () => {
    switch (breathState) {
      case "Inhale":
        return isLightMode 
          ? "shadow-[0_0_35px_rgba(56,189,248,0.2)] border-sky-450" 
          : "shadow-[0_0_50px_rgba(56,189,248,0.4)] border-luma-glow/40";
      case "Hold":
        return isLightMode 
          ? "shadow-[0_0_35px_rgba(192,132,252,0.2)] border-purple-450" 
          : "shadow-[0_0_50px_rgba(192,132,252,0.4)] border-luma-lavender/40";
      case "Exhale":
        return isLightMode 
          ? "shadow-[0_0_35px_rgba(20,184,166,0.2)] border-teal-450" 
          : "shadow-[0_0_50px_rgba(20,184,166,0.4)] border-luma-teal/40";
    }
  };

  const getLabelColor = () => {
    switch (breathState) {
      case "Inhale":
        return "text-sky-500 dark:text-luma-glow";
      case "Hold":
        return "text-purple-500 dark:text-luma-lavender";
      case "Exhale":
        return "text-teal-500 dark:text-luma-teal";
    }
  };

  return (
    <div
      id="breathing_regulator_container"
      className={`${
        isLightMode ? "light-acrylic-panel" : "glass-panel"
      } rounded-3xl p-8 max-w-md mx-auto text-center relative overflow-hidden group`}
    >
      {/* Absolute faint backing pattern with biological soundwave rings */}
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-luma-glow via-luma-lavender to-luma-teal ${
        isLightMode ? "opacity-80" : "opacity-60"
      }`} />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Wind className={`w-5 h-5 ${isLightMode ? "text-indigo-600" : "text-luma-glow/80"}`} />
          <span className={`text-xs uppercase font-mono tracking-widest ${isLightMode ? "text-slate-500" : "text-gray-400"}`}>
            Take a clinical moment for yourself
          </span>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs ${
          isLightMode ? "bg-slate-100 text-slate-800" : "bg-white/5 text-gray-300"
        }`}>
          <span className="w-1.5 h-1.5 bg-luma-teal rounded-full animate-ping" />
          <span className="font-mono">{totalBreaths} completed</span>
        </div>
      </div>

      <p className={`text-sm leading-relaxed max-w-sm mx-auto mb-8 ${isLightMode ? "text-slate-600" : "text-gray-300"}`}>
        If you are feeling overwhelmed, feel free to pause here. Match your respiration to this digital cellular biological pulse to calm clinical stress.
      </p>

      {/* Breathing Ring Orb Visualizer */}
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-6">
        {/* Soft background aura circles */}
        <div
          className={`absolute inset-0 rounded-full border-4 transition-all duration-[4s] ease-in-out flex items-center justify-center ${
            isActive ? getGlowColor() : (isLightMode ? "border-slate-200/50" : "border-white/10")
          } ${
            isLightMode 
              ? "bg-gradient-to-tr from-white to-slate-100" 
              : "bg-gradient-to-tr from-midnight to-midnight-light"
          } ${
            !isActive
              ? "scale-100"
              : breathState === "Inhale"
              ? "scale-110"
              : breathState === "Hold"
              ? "scale-[1.15]"
              : "scale-90"
          }`}
        >
          {/* Subtle concentric sound waves */}
          <div className={`absolute w-[80%] h-[80%] rounded-full border ${isActive ? "animate-pulse" : ""} ${isLightMode ? "border-slate-200" : "border-white/5"}`} />
          <div className={`absolute w-[60%] h-[60%] rounded-full border ${isActive ? "animate-ping" : ""} opacity-20 ${isLightMode ? "border-indigo-200" : "border-white/10"}`} />
        </div>

        {/* Center content */}
        <div className="relative text-center select-none cursor-pointer" onClick={() => setIsActive(!isActive)}>
          {!isActive ? (
            <div className="flex flex-col items-center justify-center p-2">
              <span className={`text-xs uppercase font-mono tracking-widest ${isLightMode ? "text-indigo-600 font-semibold" : "text-luma-glow font-semibold"}`}>
                Ready?
              </span>
              <span className={`mt-2 py-1.5 px-3 rounded-full text-[10px] uppercase font-mono tracking-wider font-bold transition-all duration-300 flex items-center gap-1 cursor-pointer ${
                isLightMode
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}>
                ▶ Start
              </span>
            </div>
          ) : (
            <div className="cursor-pointer">
              <p className={`text-[10px] uppercase font-mono tracking-widest ${isLightMode ? "text-slate-500" : "text-gray-400"}`}>
                {breathState}
              </p>
              <p className={`text-4xl font-serif font-semibold mt-0.5 transition-colors duration-500 ${getLabelColor()}`}>
                0:{seconds < 10 ? `0${seconds}` : seconds}
              </p>
              <p className={`text-[9px] mt-1.5 uppercase tracking-wider font-mono ${isLightMode ? "text-slate-500" : "text-gray-400"}`}>
                {breathState === "Inhale" && "Expand lungs"}
                {breathState === "Hold" && "Rest mind"}
                {breathState === "Exhale" && "Elegantly release"}
              </p>
              <span className="text-[8px] opacity-45 hover:opacity-100 font-mono block mt-1">
                Pause
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Start/Pause Control Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`mx-auto py-2.5 px-6 rounded-2xl font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
            isActive
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/25 border border-red-500/20"
              : isLightMode
              ? "bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600"
              : "bg-white/5 hover:bg-white/15 text-white border border-white/10"
          }`}
        >
          {isActive ? "Pause Exercise" : "Start Breathing Exercise"}
        </button>
      </div>

      {/* Preset pace selects */}
      <div className={`mt-4 grid grid-cols-3 gap-2 p-1 rounded-2xl ${isLightMode ? "bg-slate-100" : "bg-white/5"}`}>
        <button
          id="btn_breathing_tempo_calm"
          onClick={() => handleTempoChange("calm")}
          className={`py-2 px-1 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
            selectedTempo === "calm"
              ? isLightMode ? "bg-white text-indigo-705 shadow-sm border border-indigo-100/10 font-semibold" : "bg-white/10 text-white shadow-sm font-semibold"
              : isLightMode ? "text-slate-500 hover:text-indigo-600" : "text-gray-400 hover:text-white"
          }`}
        >
          Box Loop (4s)
        </button>
        <button
          id="btn_breathing_tempo_deep"
          onClick={() => handleTempoChange("deep")}
          className={`py-2 px-1 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
            selectedTempo === "deep"
              ? isLightMode ? "bg-white text-indigo-705 shadow-sm border border-indigo-100/10 font-semibold" : "bg-white/10 text-white shadow-sm font-semibold"
              : isLightMode ? "text-slate-500 hover:text-indigo-600" : "text-gray-400 hover:text-white"
          }`}
        >
          Deep Slumber (5s)
        </button>
        <button
          id="btn_breathing_tempo_soothing"
          onClick={() => handleTempoChange("soothing")}
          className={`py-2 px-1 rounded-xl text-xs font-mono transition-all duration-300 cursor-pointer ${
            selectedTempo === "soothing"
              ? isLightMode ? "bg-white text-indigo-705 shadow-sm border border-indigo-100/10 font-semibold" : "bg-white/10 text-white shadow-sm font-semibold"
              : isLightMode ? "text-slate-500 hover:text-indigo-600" : "text-gray-400 hover:text-white"
          }`}
        >
          Rapid Reset (3s)
        </button>
      </div>

      {/* Soundwaves SVG graphic */}
      <div className="mt-6 flex justify-center gap-1 h-6 items-center">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`w-[3px] rounded-full transition-all duration-1000 ${
              !isActive
                ? (isLightMode ? "bg-slate-300" : "bg-white/10")
                : breathState === "Inhale"
                ? "bg-sky-400"
                : breathState === "Hold"
                ? "bg-purple-400"
                : "bg-teal-400"
            }`}
            style={{
              height:
                !isActive
                  ? "8px"
                  : breathState === "Inhale"
                  ? `${[12, 18, 24, 16, 20, 24, 14, 18, 10][i]}px`
                  : breathState === "Hold"
                  ? `${[10, 10, 12, 12, 10, 10, 12, 12, 10][i]}px`
                  : `${[18, 24, 14, 20, 14, 18, 22, 12, 16][i]}px`,
              transitionDelay: `${i * 80}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}
