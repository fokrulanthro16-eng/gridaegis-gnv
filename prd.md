# Product Requirements Document (PRD): GridAegis GNV

## 1. Product Vision
GridAegis GNV is an autonomous spatial energy burden optimizer, karst-resilient grid failure simulator, and multimodal Google Gemini utility triage platform specifically tailored to Alachua County and Gainesville Regional Utilities (GRU) systemic challenges.

Targeting **CityCamp Gainesville 2026 Hack Day** (*Best in Civic Tech 2* and *Best Use of Google Gemini*), the platform provides municipal leaders, emergency directors, and community case managers with mathematically verified tools for energy justice, disaster simulation, and utility hardship intervention.

---

## 2. Key Personas & Use Cases
1. **Alachua County Social Services & CFCAA Case Managers**:
   - Rapidly triage GRU utility statements or electric meter photos using multimodal AI.
   - Detect fuel adjustment clause (FAC) volatility and high thermal envelope leakage.
   - Generate pre-filled, legally certified Florida LIHEAP hardship claims under Florida Admin Code 73C-43.
2. **City of Gainesville Sustainability & Climate Officers**:
   - Interrogate spatial GIS choropleths highlighting the East Gainesville (32641) 14.8% energy burden crisis against West Gainesville (32605: 3.8%, 32608: 4.6%).
   - Target tree canopy expansion and weatherization grant investments based on verified census data.
3. **Emergency Operations Center (EOC) & Grid Dispatchers**:
   - Model cascading electrical line trips when Hogtown Creek and Sweetwater Branch flood Sugarfoot and Springhill substations.
   - Analyze isolated critical shelters, unserved energy (MWh), and ranked restoration priorities within <20ms.
4. **Shelter Emergency Directors (Shands, Reitz Union, MLK Center, GRACE Marketplace)**:
   - Size Solar PV (kW) and BESS storage (kWh) using mathematical differential equations ($SoC$) to guarantee 72 hours of uninterrupted life-support under overcast conditions with a hard 20% DoD reserve floor.

---

## 3. Detailed Functional Requirements

### FR-1: Open Data GIS & Energy Burden Mapping
- **FR-1.1**: Display interactive vector choropleths for Alachua County ZIP codes (32601, 32605, 32607, 32608, 32609, 32641, 32653).
- **FR-1.2**: Support 4 switchable data layers:
  - Energy Burden (% of median income).
  - Tree Canopy Deficit Index (%).
  - Structural Inefficiency / Thermal Leakage Score (0–100).
  - Annual Cooling Degree Days (CDD).
- **FR-1.3**: Interactive Inspector Drawer presenting verified census income, monthly utility bills, and critical facility listings.

### FR-2: Topological Karst-Grid Cascading Engine
- **FR-2.1**: Model verified Gainesville power nodes:
  - Generators: Deerhaven Generating Station (230kV North), J.R. Kelly Generating Station (138kV Downtown).
  - Substations: Sugarfoot Substation (138kV/23kV West), Kanapaha Substation (138kV/23kV SW), Springhill Substation (138kV/23kV East).
  - Hazards: Hogtown Creek Basin, Sweetwater Sinkhole Swarm.
  - Shelters: UF Health Shands, Reitz Union, MLK Jr. Center, GRACE Marketplace.
- **FR-2.2**: Sliders for Hurricane Intensity (Cat 1–4) and Karst Basin Rainfall (0"–15").
- **FR-2.3**: Sub-20ms Breadth-First Search (BFS) reachability traversal calculating:
  - Disconnected and compromised nodes
  - Isolated and blacked-out shelters
  - **Unserved Energy in MWh**
  - **Restoration Priority Index (RPI)** queue
- **FR-2.4**: Pre-emptive civic hardening toggles to evaluate municipal microgrid investments.

### FR-3: Production Multimodal Gemini API Route (`/api/audit`)
- **FR-3.1**: Server route supporting base64 image decoding for GRU bills and meter photos.
- **FR-3.2**: Structured JSON parsing (`response_mime_type: "application/json"`) returning:
  - `extractedKwh`, `totalBilledAmount`, `baseEnergyCharge`, `fuelAdjustmentCharge`, `calculatedEffectiveRate`, `peakHoursPercentage`
  - `tariffAnomalyDetected`, `anomalyReason`
  - `actionableRecommendations`
  - `prefilledLiheapForm`: `{ applicantName, serviceAddress, utilityAccountNumber, calculatedHardshipRatio, recommendedAssistanceGrant, formalHardshipLetter }`
- **FR-3.3**: Zero-crash graceful fallback to high-fidelity Alachua County simulation with `"Demonstration Mode / Mock API Active"` badge when `GEMINI_API_KEY` is not present.
- **FR-3.4**: Export options: "Copy Draft" and "Download .txt".

### FR-4: Mathematical 72-Hour Microgrid Dispatch Solver
- **FR-4.1**: Compute optimal Solar PV (kW) and BESS Battery Storage (kWh) for 72 hours of off-grid operation.
- **FR-4.2**: Enforce discrete differential equation:
  $$SoC(t+1) = SoC(t) + \eta_{ch} P_{PV,charge}(t) \Delta t - \frac{1}{\eta_{dis}} P_{load}(t) \Delta t$$
- **FR-4.3**: Enforce a strict **20% Depth-of-Discharge (DoD) reserve floor**.
- **FR-4.4**: 72-hour hourly dispatch curve visualizer showing solar insolation, battery state of charge (SoC %), and backup offset.
- **FR-4.5**: Financial optimizer calculating IRA Section 48 Direct Pay (40% tax credit) and net civic capital requirements.

---

## 4. Non-Functional Requirements
- **Performance**: Sub-20ms BFS graph traversal on client devices.
- **Reliability**: 100% testable uptime via deterministic fallback heuristics.
- **Type Safety**: 100% strict TypeScript types with zero compile warnings.
- **Security**: Non-root container execution (`nextjs` UID 1001) in Dockerfile.
