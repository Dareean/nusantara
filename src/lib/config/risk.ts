/**
 * Risk Score Configuration
 *
 * Formula from database_schema.sql §4:
 *   score = w1*(1/max(practitioners, 0.5)) + w2*(1/max(apprentices+1, 1)) + w3*(1 - docPct/100)
 *
 * This file is the single source of truth for risk computation.
 * Do not hardcode risk logic in SQL or scatter it across components.
 */

export type RiskLevel = "critical" | "high" | "warning" | "healthy";

export const RISK_WEIGHTS = {
  practitioners: 0.5,   // w1
  apprentices: 0.3,     // w2
  documentation: 0.2,   // w3
} as const;

export const RISK_THRESHOLDS = {
  critical: 1.5,   // score >= 1.5 AND practitioners <= 1
  high: 1.0,       // score >= 1.0
  warning: 0.5,    // score >= 0.5
  // healthy: score < 0.5
} as const;

export function computeRiskScore(
  knownPractitioners: number,
  apprenticeCount: number,
  documentationPct: number
): number {
  const { practitioners: w1, apprentices: w2, documentation: w3 } = RISK_WEIGHTS;

  const practitionerFactor = 1 / Math.max(knownPractitioners, 0.5);
  const apprenticeFactor = 1 / Math.max(apprenticeCount + 1, 1);
  const documentationFactor = 1 - documentationPct / 100;

  return w1 * practitionerFactor + w2 * apprenticeFactor + w3 * documentationFactor;
}

export function determineRiskLevel(
  score: number,
  knownPractitioners: number
): RiskLevel {
  if (score >= RISK_THRESHOLDS.critical && knownPractitioners <= 1) {
    return "critical";
  }
  if (score >= RISK_THRESHOLDS.high) {
    return "high";
  }
  if (score >= RISK_THRESHOLDS.warning) {
    return "warning";
  }
  return "healthy";
}

export const RISK_LABELS: Record<RiskLevel, string> = {
  critical: "Critical",
  high: "High Risk",
  warning: "Warning",
  healthy: "Healthy",
};

export const RISK_DESCRIPTIONS: Record<RiskLevel, string> = {
  critical: "Immediate danger of loss — very few practitioners remain",
  high: "At significant risk — needs active preservation efforts",
  warning: "Declining — requires attention to prevent further loss",
  healthy: "Well-maintained with active practitioners and documentation",
};
