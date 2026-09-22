import { ShelterLifeSupportProfile } from "@/lib/types";

export const GAINESVILLE_SHELTER_PROFILES: ShelterLifeSupportProfile[] = [
  {
    id: "shelter-eastside",
    name: "Eastside Community Center Lifeline Shelter",
    address: "2841 E University Ave, Gainesville, FL 32641",
    zipCode: "32641",
    capacityPeople: 650,
    sqFootage: 24500,
    connectedSubstation: "Kelly Substation (138kV) via feeder F-204",
    criticalLoads: {
      medicalRefrigerationKw: 12.0,    // Insulin, baby formula, pediatric medications
      oxygenAndVentilatorsKw: 24.5,    // At-risk senior breathing support
      emergencyHvacCoolingKw: 65.0,    // 82°F Florida wet-bulb max safety threshold
      lightingAndCommsKw: 8.5,         // Starlink emergency backhaul, mesh radios, LED
      waterSanitationPumpsKw: 15.0     // Potable cistern booster pumps & hygiene
    },
    totalCriticalLoadKw: 125.0
  },
  {
    id: "shelter-reitz",
    name: "J. Wayne Reitz Student Union (UF Campus)",
    address: "655 Reitz Union Dr, Gainesville, FL 32611",
    zipCode: "32611",
    capacityPeople: 1250,
    sqFootage: 85000,
    connectedSubstation: "UF Campus Substation (69kV)",
    criticalLoads: {
      medicalRefrigerationKw: 18.0,
      oxygenAndVentilatorsKw: 15.0,
      emergencyHvacCoolingKw: 145.0,
      lightingAndCommsKw: 22.0,
      waterSanitationPumpsKw: 30.0
    },
    totalCriticalLoadKw: 230.0
  },
  {
    id: "shelter-grace",
    name: "GRACE Marketplace Empowerment Shelter",
    address: "3055 NE 28th Dr, Gainesville, FL 32609",
    zipCode: "32609",
    capacityPeople: 450,
    sqFootage: 18000,
    connectedSubstation: "Kelly Substation (138kV) via feeder F-108",
    criticalLoads: {
      medicalRefrigerationKw: 8.0,
      oxygenAndVentilatorsKw: 10.0,
      emergencyHvacCoolingKw: 48.0,
      lightingAndCommsKw: 6.0,
      waterSanitationPumpsKw: 12.0
    },
    totalCriticalLoadKw: 84.0
  },
  {
    id: "shelter-shands",
    name: "UF Health Shands Level 1 Trauma Facility",
    address: "1600 SW Archer Rd, Gainesville, FL 32608",
    zipCode: "32608",
    capacityPeople: 3200,
    sqFootage: 650000,
    connectedSubstation: "Idylwild Substation (138kV) / Dual-feed UF Substation",
    criticalLoads: {
      medicalRefrigerationKw: 120.0,
      oxygenAndVentilatorsKw: 280.0,
      emergencyHvacCoolingKw: 620.0,
      lightingAndCommsKw: 85.0,
      waterSanitationPumpsKw: 145.0
    },
    totalCriticalLoadKw: 1250.0
  }
];
