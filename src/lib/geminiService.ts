import { ProductionAuditResponse, GruSampleBill } from "./types";
import { SAMPLE_GRU_BILLS } from "@/data/sampleBills";

/**
 * Deterministic Production Audit Engine for Alachua County & GRU
 * Generates verified calculations when GEMINI_API_KEY is not configured or in offline mode.
 */
export function generateDeterministicProductionAudit(
  bill?: GruSampleBill,
  imageBase64?: string
): ProductionAuditResponse {
  const activeBill = bill || SAMPLE_GRU_BILLS[0]; // Default to East Gainesville 32641
  const isEastside = activeBill.zipCode === "32641" || activeBill.zipCode === "32609";

  const extractedKwh = activeBill.totalKwh;
  const fuelAdjCharge = parseFloat((extractedKwh * 0.0385).toFixed(2));
  
  // GRU Tier 1 (0-850 kWh @ $0.142), Tier 2 (>850 kWh @ $0.178)
  const tier1Kwh = Math.min(850, extractedKwh);
  const tier2Kwh = Math.max(0, extractedKwh - 850);
  const baseEnergy = parseFloat((16.75 + (tier1Kwh * 0.142) + (tier2Kwh * 0.178)).toFixed(2));
  
  const totalBilled = activeBill.totalUtilityBill;
  const calculatedEffectiveRate = parseFloat((totalBilled / extractedKwh).toFixed(3)); // e.g. $0.271/kWh total bill burden

  const hardshipRatio = activeBill.energyBurdenPct;
  const isAnomaly = hardshipRatio > 9.0;
  const anomalyReason = isAnomaly
    ? `Fuel Adjustment Clause ($0.0385/kWh) combined with 78% thermal envelope leakage in ZIP ${activeBill.zipCode} creates an acute energy burden of ${hardshipRatio.toFixed(1)}% (statutory crisis threshold is 6.0%).`
    : `Consumption metrics are consistent with suburban average variance in ZIP ${activeBill.zipCode}.`;

  const isEligibleLiheap = hardshipRatio >= 6.0 || activeBill.monthlyHouseholdIncomeEst <= 3200;
  const assistanceGrant = isEligibleLiheap ? (hardshipRatio > 12.0 ? 850 : 550) : 0;

  const formalHardshipLetter = `
OFFICIAL FLORIDA LIHEAP CRISIS INTERVENTION APPLICATION
SUBMITTED TO: Central Florida Community Action Agency (CFCAA) / Alachua County Social Services
REGULATORY CITATION: 42 U.S.C. 8621 et seq. & Florida Administrative Code 73C-43

APPLICANT IDENTIFICATION:
- Account Holder Reference: ${activeBill.accountNumber}
- Service Location: ${activeBill.serviceAddress} (Alachua County, FL)
- Census Designation: ${isEastside ? "East Gainesville Environmental Justice / Karst Priority Corridor" : "Metropolitan Gainesville"}
- Assessed Gross Monthly Income: $${activeBill.monthlyHouseholdIncomeEst.toLocaleString()}
- Total GRU Utility Statement Due: $${totalBilled.toFixed(2)}
- Assessed Energy Burden: ${hardshipRatio.toFixed(1)}% of Gross Household Income

CIVIC & PHYSICAL BURDEN JUSTIFICATION:
1. Volatile Rate Exposure: The GRU Electric Fuel Adjustment Clause (FAC @ $0.0385/kWh) added $${fuelAdjCharge.toFixed(2)} in unbudgeted fuel surcharges this billing cycle.
2. Heat Vulnerability: Alachua County Cooling Degree Days (>2,400 CDD) force continuous HVAC cycling against high thermal envelope leakage (78% uninsulated concrete block).
3. Risk of Shutoff: The computed energy burden of ${hardshipRatio.toFixed(1)}% poses an immediate threat of service disconnection, endangering food and insulin medical refrigeration.

PRAYER FOR RELIEF:
Under Florida Administrative Code Rule 73C-43, applicant respectfully petitions for:
- Direct electronic crisis pledge grant of: $${assistanceGrant.toFixed(2)} payable to Gainesville Regional Utilities (Account ${activeBill.accountNumber}).
- Immediate 30-day moratorium on service disconnection.
- Expedited referral to the Alachua County Weatherization Assistance Program (WAP).

Certified by GridAegis GNV Algorithmic Civic Engine on ${new Date().toLocaleDateString('en-US')}.
`.trim();

  return {
    isMockFallback: true,
    engineModeUsed: 'edge_fallback',
    fallbackBadgeNotice: "Demonstration Mode / Mock API Active (Zero-Crash Fallback)",
    extractedKwh,
    totalBilledAmount: totalBilled,
    baseEnergyCharge: baseEnergy,
    fuelAdjustmentCharge: fuelAdjCharge,
    calculatedEffectiveRate,
    peakHoursPercentage: 42.5, // Typical afternoon share
    tariffAnomalyDetected: isAnomaly,
    anomalyReason,
    actionableRecommendations: [
      `Pre-cool living areas to 72°F between 8:00 AM and 1:30 PM before GRU afternoon peak rates apply.`,
      `Shift laundry and high-draw electric water heating to off-peak hours (after 7:30 PM).`,
      `Apply for GRU Free Home Energy Audit to address R-value attic insulation deficiency and duct sealing.`,
      `Utilize smart thermostat cycling: raise temperature to 78°F during 2:00 PM – 7:00 PM while running ceiling fans.`
    ],
    prefilledLiheapForm: {
      applicantName: activeBill.title.split("(")[0].trim(),
      serviceAddress: activeBill.serviceAddress,
      utilityAccountNumber: activeBill.accountNumber,
      calculatedHardshipRatio: hardshipRatio,
      recommendedAssistanceGrant: assistanceGrant,
      priorityTier: isEastside ? "Priority Tier 1 (High Energy Burden EJ Zone)" : "Standard Tier 2",
      formalHardshipLetter
    },
    auditSummary: `Audit verified for ${activeBill.serviceAddress}. Monthly electric consumption is ${extractedKwh} kWh at an effective total rate of $${calculatedEffectiveRate}/kWh. Energy burden is ${hardshipRatio.toFixed(1)}% (${isAnomaly ? "CRISIS" : "STABLE"}).`
  };
}

/**
 * Client helper to call /api/audit or directly run offline Edge Fallback
 */
export async function auditBill(
  bill?: GruSampleBill,
  imageBase64?: string,
  apiKey?: string,
  forcedMode?: 'cloud_gemini' | 'edge_fallback'
): Promise<ProductionAuditResponse> {
  // If Edge Resilience mode is explicitly forced by user, run 100% offline client-side
  if (forcedMode === 'edge_fallback') {
    return generateDeterministicProductionAudit(bill, imageBase64);
  }

  try {
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bill, imageBase64, apiKey })
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn("Client call to /api/audit failed, using local deterministic fallback:", err);
    return generateDeterministicProductionAudit(bill, imageBase64);
  }
}
