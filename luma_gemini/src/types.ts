/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JargonMapping {
  scaryTerm: string;
  gentleTranslation: string;
  description: string;
}

export interface TransformationResponse {
  stabilizingReassurance: string;
  simplifiedExplanation: string;
  urgencyLevel: number;
  urgencyAnalysis: string;
  primaryFocusAction: string;
  keyActions: string[];
  jargonMappings: JargonMapping[];
  questionsToAskDoctor: string[];
  preventativeScience?: string;
}

export type UiMode = 'panic' | 'burnout';

export interface PresetCase {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  rawText: string;
}
