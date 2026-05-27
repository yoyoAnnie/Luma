# Luma — React Frontend Architecture & Component Guide

> **Status:** ⚛️ Active & Documented
> **Date:** May 26, 2026

---

## Overview

The frontend for **Luma** has been updated to a modern Single-Page Application (SPA) built using **React**, **TypeScript**, and **Vite**. The styling leverages custom HSL utility classes and tailored animation parameters. The application connects to a local Express/Vite server (`server.ts`) which wraps Google's **Gemini 3.5 Flash** model for structured diagnostic translations.

---

## 🏗️ Folder Structure

```
luma_gemini/
├── src/
│   ├── App.tsx             # Main dashboard controller
│   ├── index.css           # Styling system & custom Tailwind utility styles
│   ├── main.tsx            # React application root mount point
│   ├── types.ts            # Type definitions for states & JSON schema
│   └── components/
│       ├── Header.tsx           # Luxury header navigation
│       ├── Footer.tsx           # Standardized footer
│       ├── CalmingParticles.tsx # Immersive canvas-particle background
│       ├── AudioWave.tsx        # Box breathing orbital regulator
│       └── AisLiveDemo.tsx      # Main translation simulator component
```

---

## ⚡ Main Components & Interactive Features

### 1. `App.tsx` (Dashboard Controller)
Coordinates the overall page sections, navigation, and core interactive states:
*   **Hero Navigation Button**: An explicit `Upload Medical Document` action button replaces the original generic "Experience Live Demo" tag to guide users clearly to the transformation zone.
*   **Dual-Theme Synchronization (`isLightMode`)**: Manages the application's visual mode state. A `useEffect` syncs this state to the document body's `.theme-light` class, enabling smooth, fluid background and text color transitions across all child components.
*   **Kinetic Typography Stage**: Cycles through emotional words ("confused", "overwhelmed", "anxious", "scared") and smooth transitions into calming states ("clarity", "confidence", "empowered") to visually demonstrate Luma's value.
*   **Dialogue Rehearsal Simulator**: An interactive dialogue engine enabling patients to rehearse assertive responses to common physician statements (e.g. cholesterol statin pathways, hairline fractures, or positive strep swabs) to ground cognitive threat loops before a clinical visit.
*   **Community Sanctuary Diaries**: An asymmetric bento grid displaying comforting diary excerpts, herbal tea recipe routines (chamomile & rosemary steeping), and screens power-down schedules.
*   **Cognitive Assistance Bento**:
    *   *3 Things to Remember Today*: Extracts and isolates key actionable medical instructions to prevent memory overwhelm.
    *   *Support Memos & Playback*: Mock recorder for doctor consultations to ease post-visit stress.
    *   *Encrypted Health Repository*: Local client-side storage simulator preserving total data privacy.

### 2. `AisLiveDemo.tsx` (AI Transformation Engine)
The main workspace containing inputs and output structures for medical translation:
*   **Drag & Drop Scanner**: Accepts local files (PDF, PNG, JPG, or TXT), parsing them into clinical text templates (supports scanning simulation with custom fallback mock texts).
*   **Adaptive Psychological States**: Users toggle between three visual UI modes (`Panic Mode`, `Curious Learner`, and `Burnout Mode`) to filter response layout, density, and detail.
*   **Transformation Stage Workflow**:
    1.  *Stage 1 (Clinical Jargon)*: Text is shown blurred, representing the overwhelming stress of looking at raw diagnostics.
    2.  *Stage 2 (Autonomic Tone Stabilization)*: Replaces jargon with box-breathing cues to lower patient blood pressure.
    3.  *Stage 3 (Breakdown Matrix)*: Displays Simplified Explanation, Urgency Visual Guidance, jargon definition tooltips, and next steps checklists.
    4.  *Stage 4 (Calming Summary)*: Prompts final rest directives ("Rest is the final clinical prescription").

### 3. `AudioWave.tsx` (Nervous System Regulation)
Provides a visual breathing guide:
*   **Interactive Play/Pause Start Toggle (`isActive`)**: Requires the user to explicitly click "Start Breathing Exercise" (or the orb play button) before the countdown, visual concentrics, and breathing cycles begin. When paused, state colors and soundwave graphic bars remain static and non-threatening.
*   Concentric circular paths scale up and down dynamically using smooth bezier intervals, prompting box breathing (Inhale, Hold, Exhale).
*   **Breathing Tempo Selectors**:
    *   `Box Loop`: Balanced 4s cycle for general calming.
    *   `Deep Slumber`: Slower 5s cycle for sleep preparation.
    *   `Rapid Reset`: Speedier 3s cycle for immediate panic regulation.
*   Assists in down-regulating cardiovascular adrenaline spikes prior to parsing medical details.

### 4. `CalmingParticles.tsx` (Ambient Environment)
Deploys a lightweight HTML5 Canvas particle system tracking mouse movements to create a slow-floating mist field, enhancing the premium, soothing aesthetic.

---

## 🔌 API & Fallback Integration

The frontend invokes the Express proxy at `/api/transform`. If `GEMINI_API_KEY` is not present in `.env` (or local configuration), the server intercept returns a local fallback response generator (`getFallbackResponse`) mapping key keywords (like "fracture", "ECG", "strep") to simulated structured JSON outputs to preserve the full interactive experience.

### Expected Response Schema:
```typescript
interface JargonMapping {
  scaryTerm: string;
  gentleTranslation: string;
  description: string;
}

interface TransformationResponse {
  stabilizingReassurance: string;
  simplifiedExplanation: string;
  urgencyLevel: number; // 1 to 10
  urgencyAnalysis: string;
  primaryFocusAction: string;
  keyActions: string[];
  jargonMappings: JargonMapping[];
  questionsToAskDoctor: string[];
  preventativeScience?: string; // Learner mode only
}
```
