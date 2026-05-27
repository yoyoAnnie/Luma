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
Coordinates the overall page sections, navigation, and special user interactive states:
*   **Kinetic Typography Stage**: Cycles through emotional words ("confused", "overwhelmed") and smooth transitions into calming states ("clarity", "empowered") to visually demonstrate Luma's core value proposition.
*   **Dialogue Rehearsal Simulator**: An interactive dialogue engine enabling patients to practice speaking assertively and clearly to physicians using virtual clinical responses. Practicing conversations out loud helps ground cognitive threat loops before entering a clinic.

### 2. `AisLiveDemo.tsx` (AI Transformation Engine)
The main workspace containing inputs and output structures for medical translation:
*   **Presets Matrix**: Double-clicking X-Ray Fracture, Throat Swab, or Lipid profiles immediately pre-fills the input field.
*   **Drag & Drop Scanner**: Accept local text/PDF/image files, parsing them into clinical text templates (supporting `.pdf`, `.png`, `.jpg`, `.txt`).
*   **Adaptive Psychological States**: Users toggle between three visual UI modes to filter output density:
    *   `Panic Mode`: Short, simple phrases with low text density.
    *   `Curious Learner`: Deep-dive science descriptions explaining the body's natural defense systems.
    *   `Burnout Mode`: Absolute essentials, isolating only a single key focus point.
*   **Transformation Stage Workflow**:
    1.  *Stage 1 (Clinical Jargon)*: Text is shown blurred, representing the overwhelming stress of looking at raw diagnostics.
    2.  *Stage 2 (Autonomic Tone Stabilization)*: Replaces jargon with box-breathing cues to lower patient blood pressure.
    3.  *Stage 3 (Breakdown Matrix)*: Displays Simplified Explanation, Urgency Visual Guidance, jargon definition tooltips, and next steps checklists.
    4.  *Stage 4 (Calming Summary)*: Prompts final rest directives ("Rest is the final clinical prescription").

### 3. `AudioWave.tsx` (Nervous System Regulation)
Provides a visual breathing guide:
*   Concentric circular paths scale up and down dynamically using smooth bezier intervals, prompting box breathing (Inhale, Hold, Exhale).
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
