/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles, Heart, Shield, Activity, Share2, Compass, Eye, EyeOff,
  User, MessageCircle, ChevronRight, Bookmark, ArrowRight, HelpCircle, AlertCircle, Play, Check
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CalmingParticles from "./components/CalmingParticles";
import AudioWave from "./components/AudioWave";
import AisLiveDemo from "./components/AisLiveDemo";

// Jargon transition list for the interactive scroll/reveal section
interface JargonTransition {
  jargon: string;
  translation: string;
  category: string;
  meaning: string;
}

const JARGON_FLOW: JargonTransition[] = [
  {
    jargon: "Acute Bilateral Tarsal Erythema",
    translation: "Slight swelling and warmth on both ankles",
    category: "Skin / Ortho",
    meaning: "Your skin barrier is temporarily reacting to friction, mobilizing rich oxygenated blood cells to quicken natural recovery."
  },
  {
    jargon: "Benign Hypertrophy of Local Lymph",
    translation: "Common, normal throat shield swelling",
    category: "Immunology",
    meaning: "Your standard, cellular filters are doing their textbook job of catching dry micro-dust or elements to protect you."
  },
  {
    jargon: "Mild Intima-Media Thickening",
    translation: "Your vessel walls are maturing normally",
    category: "Cardio",
    meaning: "A textbook physical evolution that happens naturally with wisdom. Can be elegantly nurtured using olive oils and gentle pacing."
  }
];

export default function App() {
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [customJargonRevealed, setCustomJargonRevealed] = useState<{ [key: string]: boolean }>({});
  
  // Doctor conversation rehearsal simulator
  const [activeRehearsalIndex, setActiveRehearsalIndex] = useState<number>(0);
  const [isRehearsing, setIsRehearsing] = useState<boolean>(false);
  const [completedRehearsals, setCompletedRehearsals] = useState<{ [key: number]: boolean }>({});

  const demoSectionRef = useRef<HTMLDivElement>(null);
  const breatheSectionRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const emotionalWords = ["confused", "overwhelmed", "anxious", "ashamed", "exhausted", "scared"];
  const calmingWords = ["clarity", "confidence", "calm", "understanding", "guidance", "empowered"];

  // Slowly cycle emotional state words for cinematic kinetic typography
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % emotionalWords.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const toggleJargonReveal = (id: string) => {
    setCustomJargonRevealed(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNextRehearsal = () => {
    setCompletedRehearsals(prev => ({ ...prev, [activeRehearsalIndex]: true }));
    if (activeRehearsalIndex < 2) {
      setActiveRehearsalIndex(prev => prev + 1);
    } else {
      setIsRehearsing(false);
      setActiveRehearsalIndex(0);
    }
  };

  return (
    <div className="relative min-h-screen text-gray-200 selection:bg-luma-glow/30 selection:text-white overflow-hidden pb-1">
      {/* Immersive interactive particle fog field with cursor tracking */}
      <CalmingParticles />

      {/* Main Luxury Header */}
      <Header
        onDemoScroll={() => scrollToRef(demoSectionRef)}
        onBreatheScroll={() => scrollToRef(breatheSectionRef)}
      />

      {/* HERO SECTION - Cinematic interactive landing */}
      <section id="hero_section" className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-6">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Storytelling copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Soft breathing badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/4 border border-white/10 animate-bio-float">
              <Sparkles className="w-3.5 h-3.5 text-luma-glow animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-300">
                A Calm Emotional Recovery Layer
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-medium leading-[1.1] tracking-tight">
                Healthcare is hard to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-luma-lavender to-luma-glow animate-pulse">
                  understand
                </span>{" "}
                when you’re scared.
              </h1>
              
              <p className="text-base md:text-lg text-gray-300 font-sans max-w-xl leading-relaxed">
                Luma transforms dry doctor sheets, complex diagnosis codes, and cold prescriptions into emotionally stabilizing clarity, comforting translations, and mindful next steps.
              </p>
            </div>

            {/* Breathing dynamic action keys */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                id="hero_btn_explore_demo"
                onClick={() => scrollToRef(demoSectionRef)}
                className="py-4 px-8 rounded-2xl bg-[#FCFAF6] hover:bg-white text-midnight font-mono text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-xl shadow-luma-glow/5 hover:scale-101 flex items-center justify-center gap-2 cursor-pointer btn-pulse"
              >
                Experience Live Demo
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                id="hero_btn_regulate_pulse"
                onClick={() => scrollToRef(breatheSectionRef)}
                className="py-4 px-8 rounded-2xl bg-white/3 hover:bg-white/5 border border-white/10 text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-luma-teal animate-ping" />
                Slow Your Heartbeat
              </button>
            </div>

            {/* Trust factors */}
            <div className="pt-4 flex items-center gap-6 text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-luma-teal" />
                <span>Zero HIPAA / Data Leaks</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-luma-lavender" />
                <span>Designed for Cognitive Accessibility</span>
              </div>
            </div>
          </div>

          {/* Right Floating Morphing Card Metaphor - Clarity emerging from clutter */}
          <div className="lg:col-span-5 relative">
            {/* Glowing back auror */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-luma-glow/10 to-luma-lavender/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative glass-panel rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl transition-all duration-500 hover:border-white/10 animate-bio-float">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400">
                  Scanned Doctor's Note
                </span>
                <span className="text-xs text-gray-500 font-mono">01:24:26 MST</span>
              </div>

              {/* Jargon morph display box */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-red-950/15 border border-red-500/10 text-xs font-mono space-y-1.5 text-red-300">
                  <p className="line-through opacity-60">
                    &gt; DIAGNOSIS: Marked hyperlipidemic syndrome. Fasting serum high atherogenicity calculated at out-of-bounds metrics. Avoid physical strain...
                  </p>
                </div>

                <div className="flex justify-center my-3 text-luma-glow">
                  <Activity className="w-5 h-5 animate-bounce" />
                </div>

                {/* Pure human comforting translation response card */}
                <div className="p-5 rounded-2xl bg-sky-950/10 border border-luma-glow/20 relative overflow-hidden group">
                  <span className="absolute left-0 top-0 h-full w-[3px] bg-luma-glow" />
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono text-luma-teal uppercase tracking-widest">
                      Luma Response
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-luma-glow/10 text-luma-glow text-[9px] uppercase font-mono">
                      Safe & Simple
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-white mb-2">
                    Your lipid scan simply means your body is requesting gentle dietary hydration.
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Think of this clinical label as a standard signal to drink warm green teas and embrace mindful nutrient recovery. There is no call for emergency concern.
                  </p>
                </div>
              </div>

              {/* Cognitive indicator items */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 text-center">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-400">Anxiety</span>
                  <p className="text-lg font-serif text-red-400 font-bold">-80%</p>
                </div>
                <div className="p-3 rounded-xl bg-white/2 border border-white/5 text-center">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-gray-400">CLARITY</span>
                  <p className="text-lg font-serif text-luma-teal font-bold">Absolute</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2 — EMOTIONAL TRANSITION & KINETIC TYPOGRAPHY */}
      <section id="emotional_experience_section" className="py-24 relative bg-midnight/30 border-y border-white/5 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
          
          <div className="max-w-xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-luma-glow">
              Human-first Emotional Translation
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white font-medium mt-3">
              We dissolve the fog of terrifying clinical jargon.
            </h2>
          </div>

          {/* Large kinetic typography stage showing morphs */}
          <div className="py-8 px-4 glass-panel rounded-3xl border border-white/5 relative flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
            
            <div className="text-center md:text-right w-full md:w-1/2 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-pink-400 block">
                When you feel:
              </span>
              <div className="h-20 flex items-center justify-center md:justify-end">
                <span className="text-4xl lg:text-5xl font-serif font-black text-pink-400 uppercase tracking-tight blur-[0.5px] transition-all duration-700">
                  {emotionalWords[activeWordIndex]}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Dry diagnostic letters trigger raw anatomical threat loops.
              </p>
            </div>

            {/* Separator */}
            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
            <div className="h-[1px] w-12 bg-white/10 md:hidden" />

            <div className="text-center md:text-left w-full md:w-1/2 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-luma-teal block">
                Luma restores:
              </span>
              <div className="h-20 flex items-center justify-center md:text-left">
                <span className="text-4xl lg:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-luma-glow to-luma-teal tracking-tight transition-all duration-700">
                  {calmingWords[activeWordIndex]}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Providing beautiful safety before critical decisions.
              </p>
            </div>
          </div>

          {/* Subtly moving heartbeat wave visualization */}
          <div className="pt-4 flex justify-center items-center gap-1.5 opacity-60">
            <Activity className="w-4 h-4 text-luma-lavender animate-pulse" />
            <span className="text-xs font-mono text-gray-400">
              Heart rate stabilizing in real-time...
            </span>
          </div>

        </div>
      </section>

      {/* IMMERSIVE LIVE AI DEMO HUB */}
      <section id="live_demo_hub_section" ref={demoSectionRef} className="py-24 px-6 relative max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1 bg-luma-glow/10 border border-luma-glow/20 px-3 py-1 rounded-full text-[10px] text-luma-glow font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3 animate-spin text-luma-glow" />
            Interactive Transformation
          </div>

          <h2 className="text-3xl md:text-4xl font-serif text-white font-medium tracking-tight">
            Perform an Intelligent Translation
          </h2>
          
          <p className="text-base text-gray-400">
            Scan mock clinical sheets or paste diagnostic reports to watch Luma intelligently rebuild medical details into three beautifully tailored emotional modes.
          </p>
        </div>

        {/* Live Simulator React Component */}
        <AisLiveDemo />
      </section>

      {/* SECTION 4 — NERVOUS SYSTEM REGULATION (BREATHING STAGE) */}
      <section id="nervous_system_section" ref={breatheSectionRef} className="py-24 bg-gradient-to-b from-transparent to-[#04060C] border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Breathing story column */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#22D3EE] font-semibold bg-luma-glow/10 p-2 rounded-xl">
              Anxiety Buffer Layer
            </span>
            
            <h2 className="text-3xl md:text-4xl font-serif text-white font-medium leading-[1.2]">
              Take a clinical moment for yourself.
            </h2>
            
            <p className="text-base text-gray-300 leading-relaxed">
              When dealing with diagnoses, adrenaline spikes the body's cardiovascular state. Your cognitive filters immediately shut down. That's why even the simplest letters sound like alarms.
            </p>

            <p className="text-sm text-gray-400 leading-relaxed">
              Our organic, calming breath regulator is designed to help slow down your breathing before you read the medical science behind your symptoms.
            </p>

            {/* Scientific explanation callouts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                <h4 className="font-serif text-xs text-white uppercase tracking-wider font-semibold">
                  Vagus Nerve Focus
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Box breathing signals your heart to lower blood pressure and immediately quiet your internal stress triggers.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 space-y-2">
                <h4 className="font-serif text-xs text-white uppercase tracking-wider font-semibold">
                  Cognitive Anchor
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Focusing on slow concentric orbital shapes pulls the brain away from repetitive catastrophizing.
                </p>
              </div>
            </div>
          </div>

          {/* Beautiful interactive breathing module */}
          <div className="lg:col-span-6">
            <AudioWave />
          </div>

        </div>
      </section>

      {/* INTERACTIVE DOCTOR DIALOG REHEARSAL ROOM */}
      <section id="doctor_rehearsal_section" className="py-24 px-6 relative max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          
          {/* Subtle ambient lighting layer */}
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-luma-lavender/5 rounded-full blur-3xl pointer-events-none" />

          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#C084FC]">
              Virtual Rehearsal Space
            </span>
            <h2 className="text-3xl font-serif text-white font-medium">
              Rehearse talking to your doctor.
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Medical anxiety makes it difficult to speak up at the clinic. Use Luma's comfortable dialogue simulator to practice articulating clear, stress-free clinical concerns.
            </p>

            <div className="space-y-3">
              {[
                { label: "Step 1: Greet simply but assertively", idx: 0 },
                { label: "Step 2: Propose the lifestyle timeline", idx: 1 },
                { label: "Step 3: Define immediate care limits", idx: 2 }
              ].map((step) => (
                <div key={step.idx} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                    completedRehearsals[step.idx]
                      ? "bg-luma-teal border-luma-teal text-midnight"
                      : "border-white/10 text-gray-400"
                  }`}>
                    {completedRehearsals[step.idx] ? <Check className="w-3.5 h-3.5" /> : step.idx + 1}
                  </div>
                  <span className={`text-xs ${completedRehearsals[step.idx] ? "line-through text-gray-500" : "text-gray-300"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            <button
              id="btn_start_dialog_simulation"
              onClick={() => {
                setIsRehearsing(true);
                setActiveRehearsalIndex(0);
                setCompletedRehearsals({});
              }}
              className="mt-2 py-3 px-6 rounded-2xl bg-luma-lavender/10 hover:bg-luma-lavender/25 text-luma-lavender hover:text-white font-mono text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-luma-lavender/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Dialogue Simulator
            </button>
          </div>

          {/* Interactive simulator conversation panel */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl bg-midnight border border-white/5 shadow-2xl space-y-6 min-h-[280px] flex flex-col justify-between">
              
              {!isRehearsing ? (
                <div className="text-center py-12 space-y-4">
                  <span className="w-10 h-10 rounded-full bg-white/3 flex items-center justify-center mx-auto text-xl font-serif text-[#C084FC]">
                    💬
                  </span>
                  <p className="text-sm text-gray-300 font-serif italic max-w-sm mx-auto">
                    &ldquo;Practice brings confidence. Tap the simulator to practice beautiful clinical transparency.&rdquo;
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#B0B3C1]">
                      <span>Rehearsal Scenario {activeRehearsalIndex + 1}/3</span>
                      <span className="text-[#22D3EE] uppercase">Active Simulation</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <span className="text-[10px] font-mono uppercase text-sky-400 block mb-1">
                        What the Doctor Says:
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed font-serif italic">
                        {activeRehearsalIndex === 0 && `“Alright, looking at these lab values, your cholesterol indices calculate at 192. So I think it's important we jump directly onto a high-dose statin pathway today.”`}
                        {activeRehearsalIndex === 1 && `“We have standard bone scans pointing to mild hairline discontinuities on the distal radius shaft. We'll secure it in a simple wrist rest.”`}
                        {activeRehearsalIndex === 2 && `“The culture is positive for Strep colonization. Let's prescribe immediate standard clinical therapies.”`}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-luma-teal/5 border border-luma-teal/20">
                      <span className="text-[10px] font-mono uppercase text-[#14B8A6] block mb-1">
                        Your Empathetic Reassured Response (Try practicing this out loud):
                      </span>
                      <p className="text-sm text-white leading-relaxed font-serif font-medium">
                        {activeRehearsalIndex === 0 && `“Thank you for explaining that. To help me process, let's look at what simple nutritional adjustments or warm teas I can try for a few weeks first before we decide together.”`}
                        {activeRehearsalIndex === 1 && `“I see, thank you. To reassure myself, is this tiny crack a type of fracture that naturally repairs itself with simple rest?”`}
                        {activeRehearsalIndex === 2 && `“Understood. Since my body is mounting a standard defense right now, are there simple hydration and throat rituals that will keep me comfortable?”`}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setIsRehearsing(false)}
                      className="text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-wider"
                    >
                      Exit rehearsal
                    </button>
                    
                    <button
                      id="btn_rehearsal_next"
                      onClick={handleNextRehearsal}
                      className="py-2.5 px-5 rounded-xl bg-[#FCFAF6] hover:bg-white text-midnight font-mono text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {activeRehearsalIndex < 2 ? "Next Step" : "Complete Rehearsal"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* SECTION 4 — COMMUNITY INTERIORS (AMBIENT HEALING SPACES) */}
      <section id="community_sanctuary_section" className="py-24 bg-midnight-deep relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="max-w-xl text-left space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C084FC]">
                Ambient Peer Healing Spaces
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white font-medium">
                Not a dry clinical forum.<br />
                An organic sanctuary.
              </h2>
            </div>
            <p className="text-sm text-gray-400 max-w-xs font-sans leading-relaxed text-left">
              Connect with young souls navigating identical diagnoses. Read gorgeous recovery diaries, soothing herbal tea recipes, and mental wellness routines.
            </p>
          </div>

          {/* Immersive asymmetric cards bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Recovery Stories */}
            <div className="p-8 rounded-3xl glass-panel hover:border-white/10 transition-all duration-300 relative group overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
              <div className="absolute right-0 top-0 w-24 h-24 bg-luma-teal/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-luma-teal font-semibold">
                    Recovery Diaries
                  </span>
                  <span className="text-xs text-gray-500 font-mono">05.24</span>
                </div>
                <h4 className="font-serif text-xl font-medium text-white group-hover:text-luma-glow transition-colors">
                  &ldquo;How box breathing and warm honey tea redefined my Strep recovery script.&rdquo;
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Read Annie&rsquo;s elegant journal entry detailing her transition away from intense biological panic.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-luma-glow/10 flex items-center justify-center text-[10px] font-serif text-white font-bold">
                    A
                  </div>
                  <span className="text-xs font-mono text-gray-300">Annie Yoyo</span>
                </div>
                <span className="text-xs font-mono text-luma-glow hover:underline cursor-pointer flex items-center gap-1">
                  Read Diary <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 2: Nutrients / Tea Recipes */}
            <div className="p-8 rounded-3xl glass-panel hover:border-white/10 transition-all duration-300 relative group overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
              <div className="absolute right-0 top-0 w-24 h-24 bg-luma-glow/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C084FC] font-semibold">
                    Healing Rituals
                  </span>
                  <span className="text-xs text-gray-500 font-mono">05.21</span>
                </div>
                <h4 className="font-serif text-xl font-medium text-white group-hover:text-luma-glow transition-colors">
                  The Cellular Chamomile & Rosemary Steeping Guide
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Crafted by clinical nutritionists to help expand the body&rsquo;s natural vascular comfort and ease dry throat soreness.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C084FC]/10 flex items-center justify-center text-[10px] font-serif text-white font-bold">
                    N
                  </div>
                  <span className="text-xs font-mono text-gray-300">Nova Spark</span>
                </div>
                <span className="text-xs font-mono text-luma-glow hover:underline cursor-pointer flex items-center gap-1">
                  Steep Recipe <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 3: Support routines */}
            <div className="p-8 rounded-3xl glass-panel hover:border-white/10 transition-all duration-300 relative group overflow-hidden text-left flex flex-col justify-between min-h-[320px]">
              <div className="absolute right-0 top-0 w-24 h-24 bg-luma-lavender/5 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#22D3EE] font-semibold">
                    Nervous Routines
                  </span>
                  <span className="text-xs text-gray-500 font-mono">05.19</span>
                </div>
                <h4 className="font-serif text-xl font-medium text-white group-hover:text-luma-glow transition-colors">
                  The Sunset Screen Power-Down Routine for Insomnia
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">
                  Our core community sequence that helps lower rapid evening diagnostic search cycles by 90%.
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#22D3EE]/10 flex items-center justify-center text-[10px] font-serif text-white font-bold">
                    H
                  </div>
                  <span className="text-xs font-mono text-gray-300">Halo Breath</span>
                </div>
                <span className="text-xs font-mono text-luma-glow hover:underline cursor-pointer flex items-center gap-1">
                  Explore Steps <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — MEMORY & CARE TIMELINE */}
      <section id="memory_care_section" className="py-24 px-6 relative max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#C084FC] font-semibold p-1 bg-[#C084FC]/10 rounded">
            Cognitive Assistance Layers
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-white font-medium tracking-tight">
            Support that matches your memory.
          </h2>
          <p className="text-base text-gray-400">
            Adrenaline inhibits memory retention. Keep simple reminders, secure storage folders, and voice memos cleanly structured in your care interface.
          </p>
        </div>

        {/* Feature widgets showcasing memory bubbles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          
          {/* Card 1: 3 key things */}
          <div className="p-6 rounded-3xl bg-midnight border border-white/5 hover:border-white/10 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-luma-glow/10 flex items-center justify-center text-luma-glow">
                <Bookmark className="w-4 h-4" />
              </div>
              <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                3 Things to Remember Today
              </h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              An offline micro-card that extracts and isolates the top 3 simple directives of your treatment path so your exhausted mind never gets overloaded.
            </p>
            <div className="p-3 bg-white/2 rounded-xl text-xs space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luma-glow rounded-full" />
                <span>Drink structured green tea instead of coffee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luma-glow rounded-full font-light" />
                <span>Rest wrist in a level wrist brace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-luma-glow rounded-full" />
                <span>Keep devices off after 9:30 PM</span>
              </div>
            </div>
          </div>

          {/* Card 2: Voice recording logs placeholder */}
          <div className="p-6 rounded-3xl bg-midnight border border-white/5 hover:border-white/10 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-luma-teal/10 flex items-center justify-center text-luma-teal">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Support Memos & Playback
              </h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Record doctor encounters securely. Luma automatically distills conversational clinician logs into clean, non-threatening summaries you can revisit.
            </p>
            <div className="flex items-center justify-between p-3 bg-white/2 rounded-xl text-xs mt-4">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-luma-teal/20 flex items-center justify-center text-luma-teal animate-pulse">
                  ⏺
                </div>
                <span>Annual Cardio Consult.mp3</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500">4:12 mins</span>
            </div>
          </div>

          {/* Card 3: Vault / Secure timeline */}
          <div className="p-6 rounded-3xl bg-midnight border border-white/5 hover:border-white/10 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-luma-lavender/10 flex items-center justify-center text-luma-lavender">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-serif text-sm font-semibold text-white uppercase tracking-wider">
                Encrypted Health Repository
              </h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              No medical tracking codes, no government health portal leaks. Your processed letters remain stored directly in client local database.
            </p>
            <div className="flex items-center justify-between p-3 bg-[#FCFAF6]/5 rounded-xl text-xs mt-4">
              <span className="text-luma-glow">My Wrist X-Ray 2026.png</span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-[9px] uppercase font-mono tracking-wider text-gray-400">
                Encrypted Vault
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6 — THE FUTURE OF COGNITIVE HEALTHCARE CLARITY */}
      <section id="future_of_healthcare_section" className="py-24 bg-gradient-to-b from-[#03050C] to-midnight-deep relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-luma-glow/10 to-luma-lavender/10 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white">
            <Compass className="w-4 h-4 text-luma-glow animate-spin" />
            <span>The Luma Philosophy</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif text-white font-medium max-w-2xl mx-auto leading-tight">
            Designed for human emotion, not cold statistics.
          </h2>

          <p className="text-base text-gray-300 max-w-xl mx-auto leading-relaxed">
            We believe that medicine represents more than dry latin metrics. Clear medical details can only fully sink into the human heart when accompanied by safe, empathetic context first.
          </p>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-5 border-l border-luma-glow/20 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-luma-glow font-bold">1. Empathy First</span>
              <p className="text-xs text-gray-400">Stabilize patient anxiety signals before introducing physiological descriptions.</p>
            </div>
            <div className="p-5 border-l border-luma-lavender/20 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-[#C084FC] font-bold">2. Simplicity Always</span>
              <p className="text-xs text-gray-400">Zero unneeded latin complexity. Everything mapped to comforting food, rest, and fluid metrics.</p>
            </div>
            <div className="p-5 border-l border-luma-teal/20 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest text-luma-teal font-bold">3. Total Control</span>
              <p className="text-xs text-gray-400">Adapt the cognitive layout between Panic, Curious Learner, and exhausted Burnout states.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
