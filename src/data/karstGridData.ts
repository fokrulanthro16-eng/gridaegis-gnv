import { GridNode, GridEdge } from "@/lib/types";

export const INITIAL_GRID_NODES: GridNode[] = [
  // 1. Generation Stations
  {
    id: "gen-deerhaven",
    name: "Deerhaven Generating Station (DGS)",
    type: "generator",
    kvRating: 230,
    x: 280,
    y: 45,
    floodVulnerability: 12,
    windThresholdCat: 4,
    elevationFt: 168,
    capacityMw: 410,
    status: "online",
    description: "GRU's primary combined-cycle generating complex located north of Gainesville. High elevation makes it flood-resilient, but high-voltage export corridors pass through dense live-oak canopy."
  },
  {
    id: "gen-jr-kelly",
    name: "J.R. Kelly Generating Station",
    type: "generator",
    kvRating: 138,
    x: 340,
    y: 195,
    floodVulnerability: 48,
    windThresholdCat: 3,
    elevationFt: 110,
    capacityMw: 110,
    status: "online",
    description: "Downtown Gainesville quick-start peaking facility and bulk switchyard. Adjacent to Sweetwater Branch surface karst conduit."
  },

  // 2. 138kV/23kV Transmission Substations
  {
    id: "sub-sugarfoot",
    name: "Sugarfoot Substation (138kV/23kV)",
    type: "substation",
    kvRating: 138,
    x: 140,
    y: 210,
    floodVulnerability: 82, // Severe flood hazard in Hogtown Basin!
    windThresholdCat: 2,
    elevationFt: 84,
    capacityMw: 135,
    status: "online",
    description: "Key western transmission hub located inside the active Hogtown Creek floodplain. High susceptibility to karst erosion and flash inundation during heavy precipitation."
  },
  {
    id: "sub-kanapaha",
    name: "Kanapaha Substation (138kV/23kV)",
    type: "substation",
    kvRating: 138,
    x: 180,
    y: 330,
    floodVulnerability: 32,
    windThresholdCat: 3,
    elevationFt: 120,
    capacityMw: 160,
    status: "online",
    description: "Southwestern bulk substation feeding the Archer Road commercial corridor and providing primary transmission intertie to UF Health Shands."
  },
  {
    id: "sub-springhill",
    name: "Springhill Substation (138kV/23kV)",
    type: "substation",
    kvRating: 138,
    x: 440,
    y: 200,
    floodVulnerability: 58,
    windThresholdCat: 2,
    elevationFt: 104,
    capacityMw: 125,
    status: "online",
    description: "East Gainesville primary distribution terminal feeding MLK Jr. Center, Eastside community, and Waldo Rd industrial facilities."
  },

  // 3. Karst & Hydrological Hazard Zones
  {
    id: "hazard-hogtown",
    name: "Hogtown Creek Flood Basin",
    type: "hazard_zone",
    x: 130,
    y: 155,
    floodVulnerability: 95,
    windThresholdCat: 1,
    elevationFt: 70,
    status: "online",
    description: "Major karst stormwater collector conveying western runoff towards Haile Sink. Flash surges undermine transmission footings."
  },
  {
    id: "hazard-sweetwater",
    name: "Sweetwater Branch Sinkhole Corridor",
    type: "hazard_zone",
    x: 375,
    y: 235,
    floodVulnerability: 88,
    windThresholdCat: 1,
    elevationFt: 80,
    status: "online",
    description: "Limestone dissolution fracture zone draining into Paynes Prairie. Subterranean cavitation threatens underground conduits."
  },

  // 4. Critical Facilities & Designated Emergency Shelters
  {
    id: "shelter-shands",
    name: "UF Health Shands Hospital (Level 1 Trauma)",
    type: "shelter",
    kvRating: 23,
    x: 230,
    y: 320,
    floodVulnerability: 18,
    windThresholdCat: 4,
    elevationFt: 138,
    backupGeneratorKw: 4800,
    criticalNeeds: ["Surgical ICUs", "Ventilator Wards", "Life-Support Chillers", "Trauma Blood Bank"],
    status: "online",
    description: "North-Central Florida's sole Level 1 Trauma Hospital. Critical medical life-support dependent on continuous electrical stability."
  },
  {
    id: "shelter-reitz",
    name: "J. Wayne Reitz Union (Red Cross Shelter)",
    type: "shelter",
    kvRating: 23,
    x: 240,
    y: 250,
    floodVulnerability: 22,
    windThresholdCat: 3,
    elevationFt: 132,
    backupGeneratorKw: 850,
    criticalNeeds: ["Campus Evacuees", "Medical Refrigeration", "Emergency Comms Hub", "Mobile Charging Stations"],
    status: "online",
    description: "Designated primary Red Cross hurricane shelter accommodating over 1,200 evacuees on the University of Florida campus."
  },
  {
    id: "shelter-mlk",
    name: "MLK Jr. Multipurpose Center (East Shelter)",
    type: "shelter",
    kvRating: 12.47,
    x: 460,
    y: 140,
    floodVulnerability: 42,
    windThresholdCat: 2,
    elevationFt: 118,
    backupGeneratorKw: 220,
    criticalNeeds: ["East GNV Residents", "Vulnerable Seniors", "Oxygen Concentrators", "Insulin Preservation"],
    status: "online",
    description: "Primary municipal hurricane and cooling shelter for East Gainesville. Directly fed from Springhill Substation."
  },
  {
    id: "shelter-grace",
    name: "GRACE Marketplace (Homeless Services)",
    type: "shelter",
    kvRating: 12.47,
    x: 430,
    y: 85,
    floodVulnerability: 45,
    windThresholdCat: 2,
    elevationFt: 120,
    backupGeneratorKw: 150,
    criticalNeeds: ["Unhoused Population", "Heat Exhaustion Triage", "Community Kitchen", "Water Cistern"],
    status: "online",
    description: "Low-barrier emergency shelter serving unhoused residents on NE 39th Ave. Historically exposed to extended post-storm restorative delays."
  }
];

export const INITIAL_GRID_EDGES: GridEdge[] = [
  // 230kV / 138kV Bulk Backbone from Deerhaven
  { id: "e1", source: "gen-deerhaven", target: "sub-sugarfoot", kv: 138, capacityMva: 240, floodZoneCrossed: true, status: "energized" }, // Crosses Hogtown
  { id: "e2", source: "gen-deerhaven", target: "gen-jr-kelly", kv: 138, capacityMva: 220, floodZoneCrossed: false, status: "energized" },
  { id: "e3", source: "gen-deerhaven", target: "shelter-grace", kv: 23, capacityMva: 25, floodZoneCrossed: false, status: "energized" },

  // Downtown & Eastern Loops
  { id: "e4", source: "gen-jr-kelly", target: "sub-springhill", kv: 138, capacityMva: 180, floodZoneCrossed: true, status: "energized" }, // Crosses Sweetwater
  { id: "e5", source: "gen-jr-kelly", target: "sub-kanapaha", kv: 138, capacityMva: 160, floodZoneCrossed: false, status: "energized" },
  
  // Western Backbone
  { id: "e6", source: "sub-sugarfoot", target: "sub-kanapaha", kv: 138, capacityMva: 150, floodZoneCrossed: true, status: "energized" }, // Along Hogtown
  { id: "e7", source: "sub-sugarfoot", target: "shelter-reitz", kv: 23, capacityMva: 35, floodZoneCrossed: false, status: "energized" },

  // Critical Shelter Feeder Lines
  { id: "e8", source: "sub-kanapaha", target: "shelter-shands", kv: 23, capacityMva: 60, floodZoneCrossed: false, status: "energized" }, // Primary feed
  { id: "e9", source: "gen-jr-kelly", target: "shelter-shands", kv: 23, capacityMva: 40, floodZoneCrossed: false, status: "energized" }, // Dual-feed secondary
  { id: "e10", source: "sub-springhill", target: "shelter-mlk", kv: 12.47, capacityMva: 20, floodZoneCrossed: false, status: "energized" },
  { id: "e11", source: "sub-springhill", target: "shelter-grace", kv: 12.47, capacityMva: 18, floodZoneCrossed: false, status: "energized" }
];
