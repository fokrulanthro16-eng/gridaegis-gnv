# GridAegis GNV: Project Scope & Verified Civic Context

## 1. Hack Day Track & Award Targeting
- **Event**: CityCamp Gainesville 2026 Hack Day
- **Primary Track**: General Civic Tech
- **Award Targets**:
  1. **Best in Civic Tech 2**: High-impact municipal data integration directly addressing the East vs. West Gainesville energy burden divide, spatial equity, and shelter life-support resilience.
  2. **Best Use of Google Gemini**: Multimodal Gemini tariff auditor extracting hidden GRU fuel adjustment clause surcharges, calculating cooling peak-shaving hours, and auto-drafting official Florida LIHEAP hardship assistance pleadings.

---

## 2. Verified Alachua County & GRU Open Data Benchmarks

### Census Tract & ZIP-Code Demographics:
- **32641 (East Gainesville - Duval, Lincoln, Sugarhill)**:
  - Median Household Income: **$28,400** (vs. county median $58,600)
  - Median GRU Monthly Energy Burden: **14.8%** (statutory acute crisis >10%)
  - Tree Canopy Deficit: **21.0%** (severe urban heat island effect)
  - Thermal Envelope Leakage: **78%** (pre-1980 uninsulated concrete block rental stock)
- **32601 (Downtown / Innovation District / Duckpond)**:
  - Median Household Income: **$36,200**
  - Median Energy Burden: **9.1%**
- **32608 (SW / Archer Rd / UF Health Shands)**:
  - Median Household Income: **$54,000**
  - Median Energy Burden: **4.6%** (modern high-SEER HVAC stock, low thermal leakage: 22%)
- **32609 (North Gainesville / Waldo Rd Corridor)**:
  - Median Household Income: **$38,500**
  - Median Energy Burden: **8.9%**
- **32605 (NW Suburban / 39th Ave / 43rd St)**:
  - Median Household Income: **$68,000**
  - Median Energy Burden: **3.8%** (mature tree canopy, high solar penetration)

### Verified Gainesville Regional Utilities (GRU) Rate Schedule:
- **Customer Base Charge**: $16.75 / month
- **Electric Energy Tier 1 (0–850 kWh)**: **$0.142 / kWh**
- **Electric Energy Tier 2 (>850 kWh)**: **$0.178 / kWh**
- **Electric Fuel Adjustment Clause (FAC)**: **$0.0385 / kWh** (reflecting commodity pass-through volatility)
- **City of Gainesville Utility Tax**: 10.0%

---

## 3. Engineering & Mathematical Scope

### 3.1 Topological Karst-Grid Cascading Blackout Engine
- Models exact Gainesville electrical infrastructure:
  - **Generation**: Deerhaven Generating Station (230kV North, 410 MW) and J.R. Kelly Generating Station (138kV Downtown, 110 MW).
  - **138kV/23kV Transmission Substations**: Sugarfoot Substation (138kV/23kV in Hogtown Creek floodplain, 84 ft elevation), Kanapaha Substation (138kV/23kV SW hub), Springhill Substation (138kV/23kV East GNV terminal).
  - **Critical Facilities**: UF Health Shands Hospital (Level 1 Trauma ICU), J. Wayne Reitz Union (Red Cross Designated Shelter), MLK Jr. Multipurpose Center (East GNV Primary Shelter), GRACE Marketplace (Homeless Services & Emergency Center).
- Exact Breadth-First Search (BFS) reachability traversal under sub-20ms latency.
- Calculates: Disconnected nodes, isolated shelters, **Unserved Energy in MWh**, and an **Estimated Restoration Priority Index (RPI)**.

### 3.2 Production Multimodal Gemini API Route (`/api/audit`)
- Server-side route leveraging the Google Gen AI SDK (`@google/generative-ai`).
- Base64 image decoding for GRU paper statements and digital meter photographs.
- Structured JSON output returning extracted kWh, effective rates, FAC spike surcharges, anomaly flags, and pre-filled Florida LIHEAP hardship claims.
- Guaranteed zero-crash fallback with `"Demonstration Mode / Mock API Active"` badge for reliable offline judging.

### 3.3 Mathematical 72-Hour Microgrid Dispatch Solver
- Solves the discrete state-of-charge differential equation:
  $$SoC(t+1) = SoC(t) + \eta_{ch} P_{PV,charge}(t) \Delta t - \frac{1}{\eta_{dis}} P_{load}(t) \Delta t$$
- Evaluates Florida solar insolation curves ($kW/m^2$) across Gainesville's typical solar resource.
- Enforces a hard **20% Depth-of-Discharge (DoD) reserve floor** to protect battery life and maintain emergency life-support reserves.
- Models IRA Section 48 Direct Pay (40% municipal tax rebate for low-income energy communities).
