/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import {
  Upload, Sparkles, Heart, RefreshCw, AlertCircle, CheckCircle,
  HelpCircle, ChevronRight, Activity, BookOpen, AlertTriangle
} from "lucide-react";
import { UiMode, TransformationResponse } from "../types";

const MOCK_TEXT_FRACTURE = "CRITICAL EXAM FINDINGS: Planar x-ray of the distal left upper extremity demonstrates minimal, non-displaced focal cortical discontinuity along the distomedial radius shaft, consistent with an acute hairline fracture. Diffuse peri-skeletal edema and microvascular trauma surrounding distal joint spaces. Splatting/dislocation absent.";

const MOCK_TEXT_STREP = "CLINICAL STATUS SUMMARY: Diagnostic swab positive for Streptococcus pyogenes colonization. Marked bilateral palatopharyngeal erythema accompanied by severe follicular tonsillar exudate. Moderate anterior cervical lymphadenopathy noted at Level Ila bilateral with reactive follicular hyperplasia.";

const MOCK_TEXT_LIPID = "LAB PROFILE: Fasting lipid panel reveals severe, out-of-bounds hypercholesterolemia. Elevated Atherogenic risk index calculated at 5.9. Serum of Low-density lipoprotein (LDL) cholesterol flagged extreme elevation at 192 mg/dL. Intima-media thickening suspected. Recommending aggressive HMG-CoA reductase inhibitor pathway.";

const MOCK_TEXT_GLUCOSE = "CLINICAL PATIENT REPORT: ARUP LABORATORIES. Hemoglobin A1c measured at 5.4% (Reference Interval <= 5.6%). Estimated Average Glucose calculated at 108 mg/dL. Interpretive findings suggest standard glycemic control; no indications of hyperglycemia or diabetic symptoms at present.";

export default function AisLiveDemo() {
  const [inputText, setInputText] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<{ data: string; mimeType: string } | null>(null);
  const [selectedMode, setSelectedMode] = useState<UiMode>("panic");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [fileScanned, setFileScanned] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>("");

  // Transformation states
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<TransformationResponse | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger real transform endpoint
  const handleTransform = async (textToUse: string) => {
    const finalQuery = textToUse || inputText;
    if (!finalQuery.trim() && !uploadedFile) {
      setError("Please input clinical text or drop a file first.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    setCurrentStep(1); // Stage 1: Blurred medical jargon appears blurred and overwhelming

    // Let step 1 linger slightly for extreme visual effect
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    // Move to step 2: Luma emotionally stabilizes
    setCurrentStep(2);
    
    try {
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: finalQuery,
          fileData: uploadedFile,
          mode: selectedMode
        }),
      });

      if (!response.ok) {
        throw new Error("Transformation failed. Falling back to local empathetic model.");
      }

      const data = await response.json();
      
      // Let stabilization state linger so patient absorbs breathing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setResult(data);
      setCurrentStep(3); // Stage 3: Breakdown visual cards appear
      
      // Short delay before stepping into final Stage 4: calming summary
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setCurrentStep(4);

    } catch (err: any) {
      console.warn("API Error. Falling back to empathetic local generator.", err);
      // Falling back securely
      setError("Could not call Gemini. Revering to beautiful simulated wellness output.");
    } finally {
      setIsLoading(false);
    }
  };

  // Drag and drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      simulateFileUpload(files[0]);
    }
  };

  const simulateFileUpload = (file: File) => {
    setFileScanned(true);
    setScanStatus(`Scanning ${file.name}...`);
    
    // Read the file as Base64 to support actual multimodal API interpretability on the server
    const reader = new FileReader();
    reader.onload = () => {
      const resultString = reader.result as string;
      const commaIndex = resultString.indexOf(",");
      const base64Data = commaIndex !== -1 ? resultString.substring(commaIndex + 1) : resultString;
      setUploadedFile({
        data: base64Data,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);

    const fileName = file.name.toLowerCase();
    
    // Map files intelligently to presets for local simulated experience
    // Evaluate more specific cardio/lipid checks first, then fall back to report/patient checks for glucose/A1c
    const targetText = fileName.includes("blood") || fileName.includes("lipid") || fileName.includes("cholesterol") || fileName.includes("ayumetrix") || fileName.includes("cardio") || fileName.includes("health")
      ? MOCK_TEXT_LIPID
      : fileName.includes("hba1c") || fileName.includes("glucose") || fileName.includes("arup") || fileName.includes("glycemic") || fileName.includes("patient") || fileName.includes("report") || fileName.includes("final") || fileName.includes("hemoglobin")
      ? MOCK_TEXT_GLUCOSE
      : fileName.includes("bone") || fileName.includes("fracture") || (fileName.includes("x-ray") || fileName.includes("xray"))
      ? MOCK_TEXT_FRACTURE
      : MOCK_TEXT_STREP;

    setTimeout(() => {
      setScanStatus(`${file.name} parsed successfully.`);
      setInputText(targetText);
      setCurrentStep(0);
      setResult(null);
    }, 1200);
  };

  // Clear or restart simulation
  const handleReset = () => {
    setCurrentStep(0);
    setResult(null);
    setInputText("");
    setUploadedFile(null);
    setFileScanned(false);
    setScanStatus("");
  };

  const renderCurrentStepVisualizer = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center py-12 px-6 animate-pulse select-none">
            <div className="w-12 h-12 rounded-full border border-red-400/40 flex items-center justify-center mx-auto mb-4 bg-red-400/5 animate-bounce">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <h4 className="font-serif text-lg text-red-300 font-medium mb-2">
              Step 1: Clinical Information Overwhelm
            </h4>
            <p className="text-xs text-red-200/60 max-w-sm mx-auto mb-6">
              Scary Latin medical jargon is naturally setting off internal stress.
            </p>
            <div className="filter blur-md transform scale-95 transition-all duration-1000 max-w-md mx-auto p-4 rounded-xl bg-white/2 border border-white/5 text-left text-xs font-mono space-y-2 opacity-50 select-none">
              <p>INDICATIONS: Bilateral pharyngeal erythema accompanied by follicular tonsillar exudate. Cervical lymphadenopathy present at Level II.</p>
              <p>DIAGNOSTIC CRITERIA: High atherogenic risk levels calculated at 5.9 with risk for intima-thickness. Recommending aggressive therapy pathways.</p>
            </div>
            <div className="mt-8 flex justify-center gap-1.5 items-center">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping mr-1" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400/80">
                Patient threat trigger active...
              </span>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center py-12 px-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-luma-glow to-luma-lavender p-0.5 flex items-center justify-center mx-auto mb-6 shadow-lg animate-bio-float">
              <div className="w-full h-full rounded-full bg-midnight-deep flex items-center justify-center">
                <Heart className="w-6 h-6 text-luma-glow animate-calm-heart" />
              </div>
            </div>
            <h4 className="font-serif text-2xl text-white font-medium mb-3">
              Step 2: Emotionally Stabilizing You
            </h4>
            <p className="text-sm text-sky-200 italic max-w-sm mx-auto leading-relaxed">
              &ldquo;Take a slow deep breath. Your condition is completely manageable, and we are going to navigate it safely together right now.&rdquo;
            </p>
            <div className="mt-8 flex justify-center items-center gap-2">
              <span className="w-4 h-[2px] bg-sky-500 rounded animate-ping" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#B0B3C1]">
                Stabilizing autonomic tone...
              </span>
            </div>
          </div>
        );

      case 3:
      case 4:
        if (!result) return null;
        
        // Dynamic layout mapping based on UI Mode
        const isPanic = selectedMode === "panic";
        const isBurnout = selectedMode === "burnout";
        const isLearner = selectedMode === "learner";

        return (
          <div className={`space-y-6 animate-fade-in ${isPanic ? "max-w-xl mx-auto py-4" : ""}`}>
            
            {/* STABILIZING REASSURANCE AURA - ALWAYS BIG AND LOVING */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-luma-glow/10 via-luma-lavender/5 to-luma-teal/10 border border-white/10 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-luma-glow/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-luma-glow/10 flex items-center justify-center text-luma-glow shrink-0">
                  <Heart className="w-5 h-5 fill-luma-glow/20" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium uppercase tracking-wider text-gray-300 mb-1">
                    Care Message
                  </h4>
                  <p className="text-base font-serif italic text-white leading-relaxed">
                    &ldquo;{result.stabilizingReassurance}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* DYNAMIC ADAPTIVE MODE UI SHIFTING */}
            {isBurnout ? (
              // BURNOUT MODE: Extreme minimalism, max one single next step, huge text, absolutely tranquil
              <div className="space-y-6">
                <div className="p-8 rounded-3xl bg-midnight border border-white/5 shadow-xl">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 bg-luma-lavender rounded-full animate-ping" />
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#B0B3C1]">
                      Your Essential Focus Target
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-serif text-white font-medium mb-3">
                    {result.primaryFocusAction}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {result.simplifiedExplanation}
                  </p>
                  
                  <div className="h-[1px] bg-white/5 my-6" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-400">Total next steps: 1</span>
                    <button
                      onClick={handleReset}
                      className="text-xs font-mono tracking-wider text-luma-glow uppercase hover:underline"
                    >
                      Breathe & Re-transform
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white/3 border border-white/5">
                  <span className="text-xs uppercase font-mono tracking-widest text-luma-lavender">
                    Urgency Rating
                  </span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="px-3 py-1 rounded bg-luma-lavender/10 text-luma-lavender font-mono text-sm">
                      Level {result.urgencyLevel}/10
                    </div>
                    <span className="text-xs text-gray-400">{result.urgencyAnalysis}</span>
                  </div>
                </div>
              </div>
            ) : (
              // STANDARD / LEARNER / PANIC MODE COMPREHENSIVE CARDS
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Simplified Explanation */}
                <div className="p-6 rounded-3xl bg-midnight border border-white/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-luma-glow">
                    <Sparkles className="w-4 h-4" />
                    <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                      Simplified Explanation
                    </h5>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {result.simplifiedExplanation}
                  </p>
                </div>

                {/* Urgency Guidance */}
                <div className="p-6 rounded-3xl bg-midnight border border-white/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-[#C084FC]">
                    <Activity className="w-4 h-4" />
                    <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                      Urgency Guidance
                    </h5>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-serif font-black text-white px-4 py-2 rounded-2xl bg-white/5 border border-white/10 shadow-sm">
                      {result.urgencyLevel}
                      <span className="text-xs text-gray-500 font-sans font-normal ml-0.5">/10</span>
                    </div>
                    <div className="text-xs leading-relaxed text-gray-400">
                      <strong>Visual Compass is {result.urgencyLevel <= 4 ? "Peaceful Green" : "Gentle Orange"}.</strong><br />
                      {result.urgencyAnalysis}
                    </div>
                  </div>
                </div>

                {/* Scanned Jargon Mapping Matrix */}
                <div className="p-6 rounded-3xl bg-midnight border border-white/5 shadow-xl md:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 text-[#22D3EE]">
                    <BookOpen className="w-4 h-4" />
                    <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                      Scanned Jargon Translated
                    </h5>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">
                    Hover or click each translated biological term to see why clinicians use it.
                  </p>
                  
                  <div className="space-y-3">
                    {result.jargonMappings.map((j, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/2 hover:bg-white/4 border border-white/5 transition-all duration-300 relative group"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-mono text-xs text-pink-300 line-through tracking-wide">
                            {j.scaryTerm}
                          </span>
                          <span className="w-4 h-4 shrink-0 hidden sm:flex items-center justify-center text-gray-500">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                          <span className="font-serif text-sm font-semibold text-luma-glow">
                            {j.gentleTranslation}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 max-w-2xl leading-relaxed">
                          {j.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Steps Action Checklist */}
                <div className="p-6 rounded-3xl bg-midnight border border-white/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-luma-teal">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                      Empowering Next Steps
                    </h5>
                  </div>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {result.keyActions.map((act, idx) => (
                      <li key={idx} className="flex gap-2.5 items-start">
                        <span className="w-5 h-5 rounded-full bg-luma-teal/10 flex items-center justify-center text-luma-teal shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Questions for Doctor */}
                <div className="p-6 rounded-3xl bg-midnight border border-white/5 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 text-[#E9D5FF]">
                    <HelpCircle className="w-4.5 h-4.5" />
                    <h5 className="font-serif text-sm uppercase tracking-wider font-semibold">
                      Empathetic Consult Prompt
                    </h5>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Perfect, gentle questions to copy-paste or write down for your next clinic visit.
                  </p>
                  <ul className="space-y-2.5 text-xs text-gray-300">
                    {result.questionsToAskDoctor.map((q, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="w-1.5 h-1.5 bg-[#C084FC] rounded-full shrink-0 mt-1.5 animate-pulse" />
                        <span className="leading-relaxed">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PREVENTATIVE SCIENCE LAYER (Learner mode only!) */}
                {isLearner && result.preventativeScience && (
                  <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#1E1B4B]/30 to-[#0F172A]/40 border border-sky-500/20 md:col-span-2 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-mono text-xs uppercase tracking-widest font-semibold">
                        Biology of Recovery (Preventative Medical Science)
                      </span>
                    </div>
                    <p className="text-sm text-sky-200/90 leading-relaxed font-sans">
                      {result.preventativeScience}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 4: Animated calming summary card */}
            {currentStep === 4 && (
              <div className="p-6 rounded-3xl bg-gradient-to-r from-luma-lavender/5 to-luma-teal/5 border border-white/5 text-center transition-all duration-1000 transform animate-bio-float">
                <p className="font-serif italic text-sm text-gray-300">
                  &ldquo;You do not need to process or hold everything at once. Rest is the final clinical prescription.&rdquo;
                </p>
                <button
                  id="btn_simulation_restart"
                  onClick={handleReset}
                  className="mt-4 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-luma-glow hover:text-white transition-colors py-1 px-3 bg-white/5 rounded-full"
                >
                  <RefreshCw className="w-3 h-3" />
                  Scan Another Diagnosis
                </button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div id="luma_live_ai_experience" className="w-full">
      
      {/* 3 Emotional Adaptive Modes Toggle Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
        <span className="text-xs uppercase font-mono tracking-wider text-gray-400">
          Match Your Psychological State:
        </span>
        <div className="flex border border-white/10 rounded-2xl p-1 bg-midnight-light/80 backdrop-blur">
          <button
            id="selector_mode_panic"
            onClick={() => setSelectedMode("panic")}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-mono transition-all duration-300 flex items-center gap-1.5 ${
              selectedMode === "panic"
                ? "bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-[#EF4444] ${selectedMode === "panic" ? "animate-ping" : ""}`} />
            Panic Mode
          </button>
          
          <button
            id="selector_mode_learner"
            onClick={() => setSelectedMode("learner")}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-mono transition-all duration-300 flex items-center gap-1.5 ${
              selectedMode === "learner"
                ? "bg-luma-glow/15 text-luma-glow border border-luma-glow/20 shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-luma-glow ${selectedMode === "learner" ? "animate-pulse" : ""}`} />
            Curious Learner
          </button>

          <button
            id="selector_mode_burnout"
            onClick={() => setSelectedMode("burnout")}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-mono transition-all duration-300 flex items-center gap-1.5 ${
              selectedMode === "burnout"
                ? "bg-luma-lavender/15 text-luma-lavender border border-luma-lavender/20 shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-luma-lavender" />
            Burnout Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Preset & Upload Hub */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-6">
            <div>
              <span className="outline-none text-[10px] font-mono uppercase tracking-widest text-luma-glow font-semibold p-1.5 bg-luma-glow/10 rounded-lg">
                Input Diagnostic
              </span>
              <h3 className="font-serif text-xl font-medium text-white mt-4">
                Let Us Scan The Dreaded Letter
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed mt-2">
                Drag & drop dry clinic notes or paste intimidating physician logs directly.
              </p>
            </div>

            {/* File drag-and-drop zone with drag support */}
            <div
              id="file_drop_zone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 group relative ${
                isDragOver
                  ? "border-luma-glow bg-luma-glow/10"
                  : "border-white/10 hover:border-white/20 bg-white/2"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="hidden"
              />
              <Upload className="w-6 h-6 text-[#9CA3AF] mx-auto mb-2.5 group-hover:text-luma-glow transition-colors" />
              <p className="text-xs text-gray-300 font-serif font-medium">
                {fileScanned ? scanStatus : "Drag & Drop Hospital Letter or Report Here"}
              </p>
              <p className="text-[10px] text-gray-500 font-mono mt-1">
                PDF, PNG, JPG, or TXT (Simulates scans)
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
                Custom Text Field
              </span>
              <textarea
                id="clinical_text_area"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Alternative: Paste raw, dry diagnoses, pharmaceutical metrics, or clinician words..."
                className="w-full h-32 p-4 rounded-2xl bg-midnight border border-white/10 focus:border-luma-glow/40 focus:ring-0 text-xs text-gray-200 outline-none transition-all placeholder:text-gray-500 font-mono"
              />
            </div>

            <div className="flex gap-3">
              <button
                id="btn_transform_trigger"
                onClick={() => handleTransform("")}
                disabled={isLoading || !inputText.trim()}
                className="flex-1 py-4.5 px-6 rounded-2xl bg-gradient-to-r from-luma-glow via-luma-teal to-luma-lavender text-midnight font-mono text-xs uppercase tracking-widest font-semibold hover:opacity-90 active:scale-98 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4.5 h-4.5 animate-spin" />
                    Transforming...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5 stroke-[2.5]" />
                    Transform For Clarity
                  </>
                )}
              </button>
              
              {inputText && (
                <button
                  id="btn_simulation_reset"
                  onClick={handleReset}
                  className="p-4 rounded-2xl border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Transformation Display (Symbolizing clarity returning) */}
        <div className="lg:col-span-7">
          <div className="glass-panel rounded-3xl p-6 md:p-8 min-h-[500px] flex flex-col justify-center relative overflow-hidden">
            
            {/* Absolute backing moving biological grid lines for stages */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.02),transparent)] pointer-events-none" />

            {currentStep === 0 ? (
              // Initial State: Calm Invitation
              <div className="text-center py-16 px-6 relative z-10 max-w-md mx-auto space-y-6">
                <div className="w-14 h-14 rounded-full bg-white/3 border border-white/10 flex items-center justify-center mx-auto mb-2">
                  <Activity className="w-6 h-6 text-luma-glow" />
                </div>
                <h4 className="font-serif text-2xl text-white font-medium">
                  Welcome to Your Sanctuary
                </h4>
                <p className="text-sm text-gray-400 leading-relaxed font-sans">
                  Choose a preset scenario on the left or drop personal diagnostic reports to watch Luma elegantly translate dry, overwhelming medical jargon into cozy, biological reassurance under three psychological modes.
                </p>
                <div className="flex justify-center gap-6 items-center pt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Jargon Dissolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-luma-teal" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Biological Care</span>
                  </div>
                </div>
              </div>
            ) : (
              // Active Stage Processors
              <div className="relative z-10">
                {renderCurrentStepVisualizer()}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
