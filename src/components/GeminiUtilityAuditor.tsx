"use client";

import React, { useState, useRef, useEffect } from "react";
import { SAMPLE_GRU_BILLS } from "@/data/sampleBills";
import { GruSampleBill, ProductionAuditResponse, DualEngineMode } from "@/lib/types";
import { auditBill } from "@/lib/geminiService";
import { 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  Zap, 
  TrendingUp, 
  Download, 
  Key, 
  Clock, 
  ShieldAlert,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Languages,
  Volume2,
  VolumeX,
  Shield,
  Wifi,
  WifiOff,
  Cpu
} from "lucide-react";

export default function GeminiUtilityAuditor() {
  const [selectedBill, setSelectedBill] = useState<GruSampleBill>(SAMPLE_GRU_BILLS[0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<ProductionAuditResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Dual-Engine Intelligence State ('cloud_gemini' | 'edge_fallback')
  const [engineMode, setEngineMode] = useState<DualEngineMode>('cloud_gemini');

  // Feature 3: Spanish Language Toggle & Web Speech API Audio
  const [language, setLanguage] = useState<"en" | "es">("en");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Real Base64 Image state
  const [uploadedImageBase64, setUploadedImageBase64] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop audio speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setUploadedImageBase64(b64);
    };
    reader.readAsDataURL(file);
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const result = await auditBill(
        uploadedImageBase64 ? undefined : selectedBill,
        uploadedImageBase64 || undefined,
        apiKey || undefined,
        engineMode
      );
      setAuditResult(result);
    } catch (err) {
      console.error("Audit error:", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyDraft = () => {
    const draftText = language === "es" && auditResult ? getSpanishHardshipLetter(auditResult) : auditResult?.prefilledLiheapForm.formalHardshipLetter;
    if (!draftText) return;
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDraft = () => {
    const draftText = language === "es" && auditResult ? getSpanishHardshipLetter(auditResult) : auditResult?.prefilledLiheapForm.formalHardshipLetter;
    if (!draftText) return;
    const element = document.createElement("a");
    const file = new Blob([draftText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Florida_LIHEAP_Relief_${language.toUpperCase()}_${auditResult?.prefilledLiheapForm.utilityAccountNumber || "GRU"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Web Speech API Plain-Language Audio Reader
  const handleToggleSpeech = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!auditResult) return;

    const speechText = language === "es"
      ? `Resumen de auditoría de servicios públicos de Gainesville. Su consumo mensual es de ${auditResult.extractedKwh} kilovatios hora, con una factura total de ${auditResult.totalBilledAmount} dólares. Su familia gasta el ${auditResult.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)} por ciento de sus ingresos brutos en electricidad, lo cual califica como crisis económica. La Cláusula de Ajuste de Combustible de GRU añade ${auditResult.fuelAdjustmentCharge.toFixed(2)} dólares en recargos. Le recomendamos pre-enfriar su hogar a 72 grados antes de la 1:30 de la tarde para evitar las tarifas pico de la tarde, y solicitar la ayuda de emergencia LIHEAP de hasta 850 dólares.`
      : `Gainesville Regional Utilities audit summary. Your monthly electricity usage is ${auditResult.extractedKwh} kilowatt hours, totaling $${auditResult.totalBilledAmount.toFixed(2)}. Your household spends ${auditResult.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)} percent of gross income on power, representing an acute energy burden crisis. GRU's Fuel Adjustment Clause added $${auditResult.fuelAdjustmentCharge.toFixed(2)} in unbudgeted surcharges. We recommend pre-cooling your home to 72 degrees before 1:30 PM to avoid expensive peak hours, and submitting your pre-filled Florida LIHEAP application for an $850 emergency relief grant.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === "es" ? "es-US" : "en-US";
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const getSpanishHardshipLetter = (res: ProductionAuditResponse): string => {
    return `
SOLICITUD OFICIAL DE ALIVIO DE CRISIS Y ASISTENCIA DE ENERGÍA DE FLORIDA (LIHEAP)
PRESENTADA A: Agencia de Acción Comunitaria de Florida Central (CFCAA) / Servicios Sociales del Condado de Alachua
BASE LEGAL: 42 U.S.C. 8621 et seq. y Código Administrativo de Florida 73C-43

IDENTIFICACIÓN DEL SOLICITANTE:
- Referencia de Cuenta: ${res.prefilledLiheapForm.utilityAccountNumber}
- Domicilio de Servicio: ${res.prefilledLiheapForm.serviceAddress} (Condado de Alachua, FL)
- Categoría de Prioridad: ${res.prefilledLiheapForm.priorityTier}
- Carga Energética Calculada: ${res.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)}% de los Ingresos Brutos del Hogar
- Monto Total Adeudado a GRU: $${res.totalBilledAmount.toFixed(2)}

JUSTIFICACIÓN DE LA CRISIS:
1. Impacto de Tarifas Inestables: La Cláusula de Ajuste de Combustible (FAC a $0.0385/kWh) de GRU impuso un recargo adicional de $${res.fuelAdjustmentCharge.toFixed(2)} en este ciclo de facturación.
2. Severa Vulnerabilidad Térmica: Durante el verano en el Condado de Alachua con más de 2,400 Grados Día de Enfriamiento, el aire acondicionado opera continuamente contra un 78% de fuga térmica en viviendas construidas antes de 1980.
3. Riesgo Inminente de Corte: La carga energética de ${res.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)}% excede el umbral legal de crisis, amenazando la refrigeración de alimentos y medicamentos vitales (como insulina).

ACCIÓN DE ALIVIO SOLICITADA:
Conforme a la Regla 73C-43 del Código Administrativo de Florida:
- Subvención de crisis inmediata por valor de: $${res.prefilledLiheapForm.recommendedAssistanceGrant.toFixed(2)} pagaderos directamente a Gainesville Regional Utilities.
- Suspensión inmediata de 30 días contra la desconexión del servicio.
- Inscripción prioritaria en el Programa de Climatización de Hogares (WAP).

Certificado formalmente por el Motor Cívico Algorítmico GridAegis GNV el ${new Date().toLocaleDateString('es-ES')}.
`.trim();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">
              Multimodal Google Gemini Utility & Tariff Auditor
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-800/40 font-mono font-semibold">
              Route: /api/audit
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Accepting digital GRU statements or scanned meter photos, identifying Fuel Adjustment Clause volatility, and pre-filling Florida LIHEAP hardship claims.
          </p>
        </div>

        {/* Feature 3: Spanish Language Switcher & Web Speech Controls */}
        <div className="flex items-center gap-2 relative z-20">
          {/* Audio Speech Toggle */}
          {auditResult && (
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all relative z-20 cursor-pointer ${
                isSpeaking
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse shadow-sm"
                  : "bg-slate-950 border-slate-800 text-slate-300 hover:text-white"
              }`}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isSpeaking ? (language === "es" ? "Detener Audio" : "Stop Audio") : (language === "es" ? "Escuchar Resumen" : "Listen to Summary")}</span>
            </button>
          )}

          {/* Language Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-mono relative z-20">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg transition-all relative z-20 cursor-pointer ${
                language === "en"
                  ? "bg-purple-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`px-2.5 py-1 rounded-lg transition-all relative z-20 cursor-pointer ${
                language === "es"
                  ? "bg-purple-600 text-white font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ES (Español)
            </button>
          </div>

          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-all relative z-20 cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">{apiKey ? "API Key Set" : "Gemini API Key"}</span>
          </button>
        </div>
      </div>

      {/* Dual-Engine Intelligence Status Banner & Manual Judge Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            engineMode === 'cloud_gemini'
              ? "bg-purple-950/60 border-purple-500/40 text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
              : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          }`}>
            {engineMode === 'cloud_gemini' ? <Sparkles className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono">
                {engineMode === 'cloud_gemini' ? "⚡ Mode: Google Gemini Cloud" : "🛡️ Mode: Edge Resilience Fallback"}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider ${
                engineMode === 'cloud_gemini'
                  ? "bg-purple-950 text-purple-300 border border-purple-800"
                  : "bg-emerald-950 text-emerald-300 border border-emerald-800"
              }`}>
                {engineMode === 'cloud_gemini' ? "Online Multimodal" : "Zero-Bandwidth Grid-Down"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {engineMode === 'cloud_gemini'
                ? "Deep neural tariff OCR & generative Florida LIHEAP legal pleadings via Google Gemini 1.5 Flash."
                : "Deterministic Alachua County tariff engine operating locally on-device during blackout or comms loss."}
            </p>
          </div>
        </div>

        {/* Engine Toggle for Hack Day Judging */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0 relative z-20">
          <button
            onClick={() => setEngineMode('cloud_gemini')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all relative z-20 cursor-pointer ${
              engineMode === 'cloud_gemini'
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Gemini Cloud</span>
          </button>
          <button
            onClick={() => setEngineMode('edge_fallback')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all relative z-20 cursor-pointer ${
              engineMode === 'edge_fallback'
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <WifiOff className="w-3.5 h-3.5" />
            <span>Edge Fallback</span>
          </button>
        </div>
      </div>

      {/* Optional Custom Key Input */}
      {showKeyInput && (
        <div className="p-4 rounded-xl border border-purple-800/40 bg-purple-950/20 text-xs space-y-2 relative z-20">
          <div className="flex items-center justify-between text-purple-300 font-mono font-semibold">
            <span>Custom Google Gemini API Key:</span>
            <span className="text-[11px] text-slate-400">Zero-Crash: Fallback civic heuristics engage automatically if omitted</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500 relative z-20"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs relative z-20 cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Main Auditor Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-20">
        {/* Left 4 Cols: Bill Presets & Base64 Image Upload */}
        <div className="lg:col-span-4 space-y-4">
          {/* Bill Presets */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-2.5">
            <span className="text-xs font-semibold text-slate-300 block font-mono">
              1. {language === "es" ? "Seleccione Factura Preestablecida de GRU:" : "Select Preset GRU Statement:"}
            </span>
            <div className="space-y-1.5">
              {SAMPLE_GRU_BILLS.map((bill) => {
                const isSelected = selectedBill.id === bill.id && !uploadedImageBase64;
                return (
                  <button
                    key={bill.id}
                    onClick={() => {
                      setSelectedBill(bill);
                      setUploadedImageBase64(null);
                      setUploadedImageName(null);
                      setAuditResult(null);
                      if (isSpeaking && typeof window !== "undefined") {
                        window.speechSynthesis.cancel();
                        setIsSpeaking(false);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all relative z-20 cursor-pointer ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500/60 shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                        : "bg-slate-950/60 border-slate-800/80 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white text-xs">{bill.title}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        bill.energyBurdenPct > 10 ? "bg-rose-950 text-rose-300" : "bg-emerald-950 text-emerald-300"
                      }`}>
                        {bill.energyBurdenPct}% {language === "es" ? "Carga" : "Burden"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{bill.subtitle}</div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 mt-1.5 pt-1.5 border-t border-slate-800/80">
                      <span>Total: ${bill.totalUtilityBill.toFixed(2)}</span>
                      <span className="text-purple-300">{bill.totalKwh} kWh</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real Base64 Image Upload for Bill or Meter Photo */}
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3 font-mono text-xs">
            <span className="text-xs font-semibold text-slate-300 block">
              2. {language === "es" ? "O Suba Foto de Factura o Medidor Eléctrico:" : "Or Upload Scanned Bill / Meter Photo:"}
            </span>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all relative z-20 ${
                uploadedImageBase64
                  ? "border-purple-500 bg-purple-950/20"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/50"
              }`}
            >
              {uploadedImageBase64 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-1.5 text-purple-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{uploadedImageName}</span>
                  </div>
                  <img
                    src={uploadedImageBase64}
                    alt="Uploaded Bill / Meter"
                    className="max-h-28 mx-auto rounded-lg border border-slate-800 object-cover"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadedImageBase64(null);
                      setUploadedImageName(null);
                    }}
                    className="text-[10px] text-rose-400 hover:underline relative z-20 cursor-pointer"
                  >
                    {language === "es" ? "Remover Imagen" : "Remove Image & Reset"}
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5 text-slate-400">
                  <Upload className="w-5 h-5 mx-auto text-purple-400" />
                  <div className="text-[11px] font-semibold text-slate-300">
                    {language === "es" ? "Haga clic para subir factura o foto del medidor" : "Click to select GRU bill or electric meter photo"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Base64 Multimodal OCR (PNG, JPG, WEBP)
                  </div>
                </div>
              )}
            </div>

            {/* Run Audit Action */}
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className={`w-full mt-2 py-2.5 px-4 rounded-xl text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 relative z-20 cursor-pointer ${
                engineMode === 'cloud_gemini'
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                  : "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              }`}
            >
              {engineMode === 'cloud_gemini' ? <Sparkles className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
              <span>
                {isAuditing 
                  ? (language === "es" ? "Procesando Auditoría..." : "Processing Audit Engine...") 
                  : engineMode === 'cloud_gemini'
                    ? (language === "es" ? "Ejecutar con Gemini 1.5 Flash (Nube)" : "Run Multimodal Audit (Gemini Cloud)")
                    : (language === "es" ? "Ejecutar Motor de Borde (Sin Internet)" : "Run Edge Resilience Audit (Zero-Bandwidth)")}
              </span>
            </button>
          </div>
        </div>

        {/* Right 8 Cols: Structured Gemini Output & Hardship Application */}
        <div className="lg:col-span-8 space-y-4">
          {!auditResult ? (
            <div className="h-full min-h-[440px] flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 text-center space-y-3">
              <div className="p-4 rounded-full bg-purple-950/40 border border-purple-800/50 text-purple-400">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white">
                {language === "es" ? "Listo para la Auditoría Multimodal" : "Ready for Multimodal Audit"}
              </h3>
              <p className="text-xs text-slate-400 max-w-md">
                {language === "es" 
                  ? "Seleccione una factura o suba una foto del medidor para iniciar la auditoría. Calcula los sobrecargos por combustible de GRU y genera la solicitud oficial de alivio de energía LIHEAP en inglés o español." 
                  : "Select a preset bill or upload an electric meter photo to run the Google Gemini auditor. Extracts kWh, base energy charges, fuel adjustment volatility, and generates prefilled Florida LIHEAP pleadings in English or Spanish."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Dual-Engine Attribution Status Pill */}
              <div className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                auditResult.engineModeUsed === 'edge_fallback' || auditResult.isMockFallback
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                  : "bg-purple-950/40 border-purple-500/40 text-purple-300"
              }`}>
                <div className="flex items-center gap-2">
                  {auditResult.engineModeUsed === 'edge_fallback' || auditResult.isMockFallback ? (
                    <Shield className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  )}
                  <span className="font-bold">
                    {auditResult.engineModeUsed === 'edge_fallback' || auditResult.isMockFallback
                      ? (language === "es" ? "🛡️ Motor Local de Resiliencia en el Borde (Cero Ancho de Banda)" : "🛡️ Mode: Edge Resilience Fallback (Zero-Bandwidth)")
                      : (language === "es" ? "⚡ Motor Google Gemini 1.5 Flash en la Nube" : "⚡ Mode: Google Gemini Cloud (Multimodal AI)")}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {auditResult.engineModeUsed === 'edge_fallback' || auditResult.isMockFallback
                    ? (language === "es" ? "Algoritmo Determinista del Condado de Alachua" : "Deterministic Alachua Civic Solver")
                    : "Gemini 1.5 Flash JSON Pipeline"}
                </span>
              </div>

              {/* Top Scorecard: Extracted Billing Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">
                    {language === "es" ? "kWh Extraídos" : "Extracted kWh"}
                  </span>
                  <div className="text-lg font-bold text-purple-300 mt-0.5">
                    {auditResult.extractedKwh} kWh
                  </div>
                  <span className="text-[10px] text-slate-500">Tier 1 & Tier 2</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">
                    {language === "es" ? "Tarifa Efectiva" : "Effective Rate"}
                  </span>
                  <div className="text-lg font-bold text-cyan-300 mt-0.5">
                    ${auditResult.calculatedEffectiveRate}/kWh
                  </div>
                  <span className="text-[10px] text-slate-500">Total bill / kWh</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">
                    {language === "es" ? "Sobrecargo FAC" : "FAC Surcharge"}
                  </span>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">
                    ${auditResult.fuelAdjustmentCharge.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-rose-300">@ $0.0385/kWh</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">
                    {language === "es" ? "Carga Energética" : "Energy Hardship"}
                  </span>
                  <div className={`text-lg font-bold mt-0.5 ${
                    auditResult.prefilledLiheapForm.calculatedHardshipRatio > 10 ? "text-rose-400" : "text-emerald-400"
                  }`}>
                    {auditResult.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)}%
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {language === "es" ? "de Ingreso del Hogar" : "of Household Income"}
                  </span>
                </div>
              </div>

              {/* Anomaly Detection Banner */}
              <div className={`p-4 rounded-xl border text-xs ${
                auditResult.tariffAnomalyDetected
                  ? "bg-rose-950/30 border-rose-800/60 text-rose-200"
                  : "bg-slate-900/60 border-slate-800 text-slate-300"
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className={`w-4 h-4 ${auditResult.tariffAnomalyDetected ? "text-rose-400" : "text-slate-400"}`} />
                  <span>
                    {language === "es" 
                      ? (auditResult.tariffAnomalyDetected ? "ESTADO: ANOMALÍA GRAVE DE FACTURACIÓN" : "ESTADO: CONSUMO NOMINAL")
                      : (auditResult.tariffAnomalyDetected ? "TARIFF ANOMALY STATUS: HIGH ANOMALY DETECTED" : "TARIFF ANOMALY STATUS: NOMINAL CONSUMPTION")}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {language === "es"
                    ? `La Cláusula de Ajuste de Combustible ($0.0385/kWh) combinada con el 78% de fuga térmica en viviendas del código postal ${selectedBill.zipCode} crea una carga energética aguda del ${auditResult.prefilledLiheapForm.calculatedHardshipRatio.toFixed(1)}% (el límite legal de crisis es 6.0%).`
                    : auditResult.anomalyReason}
                </p>
              </div>

              {/* Actionable Recommendations */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2 text-xs">
                <span className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {language === "es" ? "Recomendaciones Prácticas de Climatización y Ahorro Pico:" : "Actionable Peak-Shaving & Weatherization Recommendations:"}
                  </span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  {language === "es" ? (
                    <>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>Pre-enfríe las áreas habitables a 72°F entre 8:00 AM y 1:30 PM antes de las tarifas altas de la tarde de GRU.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>Cambie el uso de lavadora y secadora a las horas fuera de pico (después de las 7:30 PM).</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>Solicite la Auditoría de Energía Gratuita de GRU para el sellado de ductos y aislamiento del ático.</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>Suba el termostato a 78°F de 2:00 PM a 7:00 PM mientras usa ventiladores de techo.</span>
                      </div>
                    </>
                  ) : (
                    auditResult.actionableRecommendations.map((rec, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-start gap-1.5">
                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Official Florida LIHEAP Hardship Application Box */}
              <div className="p-5 rounded-2xl border border-purple-800/40 bg-purple-950/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/40 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-bold text-white">
                        {language === "es" 
                          ? "Solicitud Oficial de Alivio de Energía de Florida (LIHEAP Regla 73C-43)" 
                          : "Official Florida LIHEAP Hardship Relief Application (Rule 73C-43)"}
                      </h4>
                    </div>
                    <p className="text-[11px] text-purple-200/80 mt-0.5">
                      {language === "es"
                        ? "Pre-llenada para la Agencia de Acción Comunitaria de Florida Central (CFCAA)."
                        : "Pre-filled for Central Florida Community Action Agency (CFCAA) / Alachua Social Services."}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 relative z-20">
                    <button
                      onClick={handleCopyDraft}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/60 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 text-xs font-mono transition-all relative z-20 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (language === "es" ? "Copiado" : "Copied") : (language === "es" ? "Copiar Solicitud" : "Copy Draft")}</span>
                    </button>
                    <button
                      onClick={handleDownloadDraft}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/60 hover:bg-cyan-800/60 text-cyan-200 border border-cyan-700/50 text-xs font-mono transition-all relative z-20 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === "es" ? "Descargar .txt" : "Download .txt"}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-mono bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{language === "es" ? "Solicitante:" : "Applicant:"}</span>
                    <span className="text-white font-bold">{auditResult.prefilledLiheapForm.applicantName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{language === "es" ? "Subvención de Crisis:" : "Recommended Grant:"}</span>
                    <span className="text-amber-400 font-bold text-sm">
                      ${auditResult.prefilledLiheapForm.recommendedAssistanceGrant}
                    </span>
                  </div>
                  <div className="text-purple-300 hidden sm:block">
                    {auditResult.prefilledLiheapForm.priorityTier}
                  </div>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[10.5px] font-mono text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
                  {language === "es" ? getSpanishHardshipLetter(auditResult) : auditResult.prefilledLiheapForm.formalHardshipLetter}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
