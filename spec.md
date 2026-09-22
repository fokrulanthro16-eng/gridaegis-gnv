# Technical Specification: GridAegis GNV

## 1. System Architecture

```
                                  +---------------------------------------+
                                  |         Next.js 14 Client App         |
                                  |  - Real-time Civic Telemetry Header   |
                                  |  - Executive Dashboard (Disparity)    |
                                  |  - Spatial GIS Map (Choropleth)       |
                                  |  - Karst DAG Simulator (<20ms BFS)    |
                                  |  - Multimodal Gemini Auditor UI       |
                                  |  - 72h Microgrid Differential Solver  |
                                  +-------------------+-------------------+
                                                      |
                    +---------------------------------+---------------------------------+
                    |                                 |                                 |
                    v                                 v                                 v
            +---------------+               +-------------------+             +--------------------+
            |  GIS Engine   |               |    DAG Engine     |             |  Microgrid Solver  |
            | - Census 2026 |               | - dagEngine.ts    |             | - microgridSolver  |
            | - Vector SVG  |               | - BFS Traversal   |             | - SoC(t+1) Diff Eq |
            | - alachuaZip- |               | - Unserved MWh    |             | - 20% DoD Reserve  |
            |   Data.ts     |               | - Restoration RPI |             | - IRA Section 48   |
            +---------------+               +-------------------+             +--------------------+
                                                      |
                                                      v
                                           +---------------------+
                                           |  /api/audit (Route) |
                                           |  Base64 Image OCR   |
                                           +----------+----------+
                                                      |
                              +-----------------------+-----------------------+
                              |                                               |
                              v                                               v
                    +-------------------+                           +--------------------+
                    | Google Generative |                           | Deterministic Mock |
                    | AI (Gemini Flash) |                           | Heuristic Fallback |
                    +-------------------+                           +--------------------+
```

---

## 2. Mathematical Formulations & Algorithms

### 2.1 BFS Topological Cascade Algorithm (`src/lib/dagEngine.ts`)
1. **Physical Substation Inundation**:
   $$\text{Flood Impact} = \text{RainfallInches} \times 7.5$$
   $$\text{Trip Condition: } \text{Flood Impact} > (100 - \text{floodVulnerability}) \lor (\text{Creek Basin Breach})$$
2. **Conductor Right-of-Way Trip**:
   $$\text{Severed: } (\text{FloodZoneCrossed} \land \text{Rainfall} \ge 6.5) \lor (\text{Cat} \ge 3 \land \text{kV} \le 23)$$
3. **Graph Traversal**:
   - Seeded with online generation stations: $S_{gen} = \{ \text{Deerhaven}, \text{J.R. Kelly} \}$.
   - Breadth-First Search (BFS) traverses energized conductors $E_{energized} \subseteq E$.
   - Any node $v \notin \text{BFS}(S_{gen})$ is disconnected from the bulk grid.
4. **Unserved Energy in MWh**:
   $$\text{Unserved Energy (MWh)} = \sum_{v \in V_{tripped}} P_{v, \text{MW}} \times t_{\text{outage}}$$
5. **Restoration Priority Index (RPI)**:
   $$\text{RPI}_v = \frac{1.8 \times P_{v, \text{critical kW}} + 0.4 \times \text{Pop}_v}{1 + 0.01 \times \text{FloodVulnerability}_v}$$

---

### 2.2 Discrete State-of-Charge Microgrid Differential Engine (`src/lib/microgridSolver.ts`)
1. **Solar Insolation Curve ($kW/m^2$)**:
   $$I(t) = I_{peak} \times \max\left(0, \cos\left(\frac{\pi(t_{mod24} - 13)}{12}\right)\right) \times \text{CloudFactor}$$
2. **PV Output ($kW$)**:
   $$P_{PV}(t) = C_{PV} \times \frac{I(t)}{1.00} \times PR \quad (PR = 0.88)$$
3. **Battery Differential Equation**:
   - **Charging ($P_{PV}(t) > P_{load}(t)$)**:
     $$SoC(t+1) = \min\left(C_{BESS}, SoC(t) + \eta_{ch} \cdot (P_{PV}(t) - P_{load}(t)) \cdot \Delta t\right)$$
   - **Discharging ($P_{PV}(t) \le P_{load}(t)$)**:
     $$SoC(t+1) = \max\left(0.20 \cdot C_{BESS}, SoC(t) - \frac{1}{\eta_{dis}} \cdot (P_{load}(t) - P_{PV}(t)) \cdot \Delta t\right)$$
   Where $\eta_{ch} = 0.95$ and $\eta_{dis} = 0.95$ ($\eta_{\text{roundtrip}} \approx 90.25\%$).

---

## 3. API Contract: `POST /api/audit`

### Request Payload:
```json
{
  "bill": { ... },
  "imageBase64": "data:image/jpeg;base64,...",
  "apiKey": "AIzaSy..."
}
```

### Response Payload:
```json
{
  "isMockFallback": false,
  "fallbackBadgeNotice": "Demonstration Mode / Mock API Active (Zero-Crash Fallback)",
  "extractedKwh": 1560,
  "totalBilledAmount": 422.50,
  "baseEnergyCharge": 247.18,
  "fuelAdjustmentCharge": 60.06,
  "calculatedEffectiveRate": 0.271,
  "peakHoursPercentage": 42.5,
  "tariffAnomalyDetected": true,
  "anomalyReason": "Fuel Adjustment Clause ($0.0385/kWh) combined with 78% thermal envelope leakage creates acute energy burden of 14.8%.",
  "actionableRecommendations": [
    "Pre-cool living areas to 72°F between 8:00 AM and 1:30 PM.",
    "Shift high-draw appliances past 7:30 PM."
  ],
  "prefilledLiheapForm": {
    "applicantName": "East Gainesville Resident",
    "serviceAddress": "1422 SE 15th St, Gainesville, FL 32641",
    "utilityAccountNumber": "GRU-0048291-8",
    "calculatedHardshipRatio": 14.8,
    "recommendedAssistanceGrant": 850.00,
    "priorityTier": "Priority Tier 1 (High Energy Burden EJ Zone)",
    "formalHardshipLetter": "OFFICIAL FLORIDA LIHEAP CRISIS INTERVENTION APPLICATION..."
  },
  "auditSummary": "Audit verified for 1422 SE 15th St..."
}
```
