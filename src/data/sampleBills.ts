import { GruSampleBill } from "@/lib/types";

// Official GRU Rate Structure:
// Base Customer Charge: $16.75
// Tier 1 Energy Rate (0-850 kWh): $0.142 / kWh
// Tier 2 Energy Rate (>850 kWh): $0.178 / kWh
// Electric Fuel Adjustment Clause (FAC): $0.0385 / kWh
// City Utility Tax: 10%

export const SAMPLE_GRU_BILLS: GruSampleBill[] = [
  {
    id: "gru-bill-32641-crisis",
    title: "East Gainesville Resident (32641)",
    subtitle: "1972 Cinderblock Home, 78% Thermal Leakage",
    accountNumber: "GRU-0048291-8",
    serviceAddress: "1422 SE 15th St, Gainesville, FL 32641",
    zipCode: "32641",
    billingPeriod: "July 12 - August 11, 2026",
    totalKwh: 1560,
    fuelAdjustmentCost: 60.06, // 1560 kWh * $0.0385/kWh
    baseEnergyCost: 247.18, // (850 * 0.142) + (710 * 0.178) = 120.70 + 126.38 + 16.75 base
    totalElectricBill: 337.96, // 16.75 base + 120.70 + 126.38 + 60.06 FAC + 14.07 tax
    totalUtilityBill: 422.50, // Including water, wastewater & stormwater
    monthlyHouseholdIncomeEst: 2366.67, // ~$28,400 / 12 mo
    energyBurdenPct: 14.8, // Verified 14.8% Acute Crisis
    narrative: "Severe energy burden crisis. Electric Fuel Adjustment Clause (FAC) adds $60.06 directly to the bill. Due to 78% thermal envelope leakage in pre-1980 cinderblock housing, cooling runs 18 hours/day during peak summer.",
    lineItems: [
      { name: "Electric Customer Base Charge", amount: 16.75 },
      { name: "Electric Tier 1 (First 850 kWh @ $0.142/kWh)", quantity: 850, unit: "kWh", rate: 0.142, amount: 120.70 },
      { name: "Electric Tier 2 (Excess 710 kWh @ $0.178/kWh)", quantity: 710, unit: "kWh", rate: 0.178, amount: 126.38 },
      { name: "Electric Fuel Adjustment Clause (FAC @ $0.0385/kWh)", quantity: 1560, unit: "kWh", rate: 0.0385, amount: 60.06, isFuelAdjustment: true },
      { name: "City of Gainesville Utility Tax (10%)", amount: 14.07 },
      { name: "Alachua County Stormwater Clean Water Fee", amount: 12.50 },
      { name: "Water Consumption Charge (5 kgal)", amount: 32.80 },
      { name: "Wastewater Utility Disposal Service", amount: 39.24 }
    ]
  },
  {
    id: "gru-bill-32608-student",
    title: "SW Gainesville Student Rental (32608)",
    subtitle: "Archer Road 3-BR Apartment, High-Efficiency HVAC",
    accountNumber: "GRU-0091428-2",
    serviceAddress: "3520 SW 24th Ave Apt 104, Gainesville, FL 32608",
    zipCode: "32608",
    billingPeriod: "July 15 - August 14, 2026",
    totalKwh: 920,
    fuelAdjustmentCost: 35.42, // 920 * 0.0385
    baseEnergyCost: 149.91, // 16.75 + (850 * 0.142) + (70 * 0.178) = 16.75 + 120.70 + 12.46
    totalElectricBill: 203.86,
    totalUtilityBill: 258.40,
    monthlyHouseholdIncomeEst: 4500.00, // ~$54,000 / 12
    energyBurdenPct: 4.6, // Verified 4.6%
    narrative: "Standard multi-family student housing with post-2005 building envelope. High afternoon spike from simultaneous laundry and AC usage, but shielded by low thermal envelope leakage (22%).",
    lineItems: [
      { name: "Electric Customer Base Charge", amount: 16.75 },
      { name: "Electric Tier 1 (850 kWh @ $0.142/kWh)", quantity: 850, unit: "kWh", rate: 0.142, amount: 120.70 },
      { name: "Electric Tier 2 (70 kWh @ $0.178/kWh)", quantity: 70, unit: "kWh", rate: 0.178, amount: 12.46 },
      { name: "Electric Fuel Adjustment Clause (FAC @ $0.0385/kWh)", quantity: 920, unit: "kWh", rate: 0.0385, amount: 35.42, isFuelAdjustment: true },
      { name: "City Utility Tax (10%)", amount: 18.53 },
      { name: "Water Consumption Charge (4 kgal)", amount: 26.24 },
      { name: "Wastewater Disposal Service", amount: 28.30 }
    ]
  },
  {
    id: "gru-bill-32605-solar",
    title: "NW Gainesville Solar Residence (32605)",
    subtitle: "Rooftop Solar PV + Heat Pump Water Heater",
    accountNumber: "GRU-0033190-4",
    serviceAddress: "2810 NW 34th St, Gainesville, FL 32605",
    zipCode: "32605",
    billingPeriod: "July 01 - July 31, 2026",
    totalKwh: 410,
    fuelAdjustmentCost: 15.79, // 410 * 0.0385
    baseEnergyCost: 74.97, // 16.75 + (410 * 0.142) = 16.75 + 58.22
    totalElectricBill: 99.83,
    totalUtilityBill: 114.20,
    monthlyHouseholdIncomeEst: 5666.67, // ~$68,000 / 12
    energyBurdenPct: 1.8, // Highly resilient
    narrative: "High-efficiency home with net-metered rooftop solar and mature tree shading (8% canopy deficit). Virtually insulated from GRU fuel adjustment volatility.",
    lineItems: [
      { name: "Electric Customer Base Charge", amount: 16.75 },
      { name: "Net Electric Tier 1 (410 kWh @ $0.142/kWh)", quantity: 410, unit: "kWh", rate: 0.142, amount: 58.22 },
      { name: "Electric Fuel Adjustment Clause (FAC @ $0.0385/kWh)", quantity: 410, unit: "kWh", rate: 0.0385, amount: 15.79, isFuelAdjustment: true },
      { name: "Solar Interconnect & Net Metering Credit", amount: 0.00 },
      { name: "City Utility Tax (10%)", amount: 9.07 },
      { name: "Alachua Stormwater Protection Tier 1", amount: 14.37 }
    ]
  }
];
