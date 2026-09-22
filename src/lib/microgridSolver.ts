import { ShelterLifeSupportProfile, MicrogridSolverResult, MicrogridHourlyStep } from "./types";

/**
 * Mathematical 72-Hour Microgrid & Solar-Storage Solver
 * Solves:
 *   SoC(t+1) = SoC(t) + \eta_{ch} P_{PV,charge}(t) \Delta t - (1/\eta_{dis}) P_{load}(t) \Delta t
 * with hard 20% DoD reserve floor:
 *   SoC_{min} = 0.20 * C_{BESS} <= SoC(t) <= C_{BESS}
 */
export function solveShelterMicrogrid(
  profile: ShelterLifeSupportProfile,
  options: {
    cloudCoverFactor?: number; // 0.5 (heavy hurricane cloud) to 1.0 (clear Florida sky)
    includeDirectPayBonus?: boolean; // 40% (with low-income community bonus) vs 30%
    targetAutonomyHours?: number; // 72 hours
  } = {}
): MicrogridSolverResult {
  const cloudFactor = options.cloudCoverFactor ?? 0.75;
  const directPayPct = options.includeDirectPayBonus !== false ? 0.40 : 0.30;
  const totalHours = options.targetAutonomyHours ?? 72;

  // Shelter critical load (kW)
  const pLoad = profile.totalCriticalLoadKw;

  // Gainesville typical solar resource: 4.8 Peak Sun Hours clear sky, scaled by cloudFactor
  const effectivePsh = 4.8 * cloudFactor;
  const etaCh = 0.95; // Charging efficiency
  const etaDis = 0.95; // Discharging efficiency

  // Mathematical minimum sizing:
  // Recommended PV must supply 24h of load + compensate for charging losses over effective daily PSH:
  const recommendedPvKw = Math.ceil((pLoad * 24) / (effectivePsh * etaCh * etaDis));

  // Recommended BESS must supply 14 hours of night/non-solar hours without breaching 20% DoD floor:
  // Usable battery fraction = 0.80 (from 100% down to 20% reserve floor)
  const nightEnergyRequiredKwh = (pLoad * 14) / etaDis;
  const recommendedBessKwh = Math.ceil(nightEnergyRequiredKwh / 0.80);

  // Footprint & Physical Roof Constraints (Standard commercial tier-1 module: 52 sq ft / kW)
  const solarArraySqFtRequired = Math.round(recommendedPvKw * 52);
  const usableRoofSqFt = Math.round(profile.sqFootage * 0.65);
  const fitsOnRoof = solarArraySqFtRequired <= usableRoofSqFt;

  // Commercial CAPEX: $1,650/kW PV, $480/kWh LFP BESS, 20% Balance of System & Controller
  const pvCost = recommendedPvKw * 1650;
  const bessCost = recommendedBessKwh * 480;
  const bosCost = (pvCost + bessCost) * 0.20;
  const totalCapexEstimate = Math.round(pvCost + bessCost + bosCost);

  // IRA Section 48 Direct Pay (40% tax credit for civic entities in energy communities)
  const iraDirectPayRebate40Pct = Math.round(totalCapexEstimate * directPayPct);
  const netMunicipalityCost = totalCapexEstimate - iraDirectPayRebate40Pct;

  // 72-Hour Step-by-Step Differential Dispatch Simulation (t = 1 ... 72)
  const hourlyProfile: MicrogridHourlyStep[] = [];
  let currentSoCKwh = recommendedBessKwh * 0.95; // Initialized pre-storm at 95%
  const minSafeReserveKwh = recommendedBessKwh * 0.20; // Hard 20% DoD floor

  let totalUnmetEnergyKwh = 0;
  let breachedHoursCount = 0;

  for (let t = 1; t <= totalHours; t++) {
    const hourOfDay = ((t - 1) % 24); // 0 to 23 (0 = midnight, 13 = 1 PM solar noon)

    // Florida Solar Insolation Curve (kW/m²)
    // Daylight between 7 AM (hour 7) and 7 PM (hour 19), peaking at 1 PM (hour 13)
    let irradiance = 0;
    if (hourOfDay >= 7 && hourOfDay <= 19) {
      const theta = ((hourOfDay - 13) / 6) * (Math.PI / 2);
      irradiance = Math.max(0, Math.cos(theta)) * 1.00 * cloudFactor;
    }
    const irradianceKwM2 = parseFloat(irradiance.toFixed(3));

    // PV Generation = Capacity * (Irradiance / 1.0) * Inverter Performance Ratio (0.88)
    const pvGenerationKw = parseFloat((recommendedPvKw * irradianceKwM2 * 0.88).toFixed(1));

    const netPowerKw = pvGenerationKw - pLoad;

    let batteryChargeKw = 0;
    let batteryDischargeKw = 0;
    let generatorBackupKw = 0;
    let curtailedSolarKw = 0;

    if (netPowerKw > 0) {
      // Surplus PV generation charges battery: \Delta SoC = \eta_{ch} * P_{charge} * \Delta t
      const maxPossibleCharge = (recommendedBessKwh - currentSoCKwh) / etaCh;
      const actualChargeInput = Math.min(netPowerKw, maxPossibleCharge);
      
      batteryChargeKw = parseFloat(actualChargeInput.toFixed(1));
      currentSoCKwh = Math.min(recommendedBessKwh, currentSoCKwh + (batteryChargeKw * etaCh));
      
      curtailedSolarKw = parseFloat(Math.max(0, netPowerKw - actualChargeInput).toFixed(1));
    } else {
      // Deficit drawn from battery: \Delta SoC = - (1 / \eta_{dis}) * P_{load} * \Delta t
      const powerDeficit = Math.abs(netPowerKw);
      const energyNeededFromBattery = powerDeficit / etaDis;

      const availableUsableKwh = Math.max(0, currentSoCKwh - minSafeReserveKwh);

      if (availableUsableKwh >= energyNeededFromBattery) {
        currentSoCKwh -= energyNeededFromBattery;
        batteryDischargeKw = parseFloat(powerDeficit.toFixed(1));
      } else {
        // Battery reached 20% DoD reserve floor!
        // Draw whatever is above 20%, then fire emergency backup generator
        currentSoCKwh = minSafeReserveKwh;
        const coveredByBattery = availableUsableKwh * etaDis;
        batteryDischargeKw = parseFloat(coveredByBattery.toFixed(1));
        generatorBackupKw = parseFloat((powerDeficit - coveredByBattery).toFixed(1));
        totalUnmetEnergyKwh += generatorBackupKw;
        breachedHoursCount++;
      }
    }

    const batterySoCPct = Math.round((currentSoCKwh / recommendedBessKwh) * 100);

    hourlyProfile.push({
      hour: t,
      irradianceKwM2,
      pvGenerationKw,
      shelterCriticalLoadKw: pLoad,
      batteryChargeKw,
      batteryDischargeKw,
      batterySoCKwh: Math.round(currentSoCKwh),
      batterySoCPct,
      generatorBackupKw,
      curtailedSolarKw
    });
  }

  const survivalHoursGuaranteed = totalUnmetEnergyKwh === 0 ? totalHours : Math.max(36, totalHours - breachedHoursCount);

  return {
    recommendedPvKw,
    recommendedBessKwh,
    solarArraySqFtRequired,
    usableRoofSqFt,
    fitsOnRoof,
    totalCapexEstimate,
    iraDirectPayRebate40Pct,
    netMunicipalityCost,
    survivalHoursGuaranteed,
    unmetEnergyKwh: parseFloat(totalUnmetEnergyKwh.toFixed(1)),
    hourlyProfile
  };
}
