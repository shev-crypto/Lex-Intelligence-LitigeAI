import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, AlertTriangle, CheckCircle2, Clock, Shield } from "lucide-react";

const mockResults = [
  { clause: "Limitation of Liability (Clause 8.2)", risk: "high", issue: "Liability cap set at contract value — industry standard is 2x. No carve-out for IP infringement or data breach." },
  { clause: "Termination for Convenience (Clause 12.1)", risk: "medium", issue: "30-day notice period is short for enterprise contracts. Consider 60-90 days with wind-down provisions." },
  { clause: "Governing Law (Clause 15.3)", risk: "low", issue: "Nigerian law specified. Arbitration clause references Lagos RCICAL — compliant." },
  { clause: "Force Majeure (Clause 9.1)", risk: "high", issue: "Missing pandemic/epidemic provisions. No reference to government-mandated shutdowns." },
  { clause: "Data Protection (Clause 11.4)", risk: "medium", issue: "References NDPR but missing NDPA 2023 provisions. Needs DPO appointment clause." },
  { clause: "Indemnification (Clause 7.1)", risk: "low", issue: "Mutual indemnification with reasonable scope. Notice period and defense obligations clearly stated." },
];

const riskConfig = {
  high: { icon: AlertTriangle, color: "text-risk-red", bg: "bg-risk-red/10", label: "High Risk" },
  medium: { icon: Clock, color: "text-risk-amber", bg: "bg-risk-amber/10", label: "Medium Risk" },
  low: { icon: CheckCircle2, color: "text-risk-green", bg: "bg-risk-green/10", label: "Low Risk" },
};

export default function ContractAuditor() {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setUploaded(true);
    }, 2000);
  };

  const riskSummary = {
    high: mockResults.filter((r) => r.risk === "high").length,
    medium: mockResults.filter((r) => r.risk === "medium").length,
    low: mockResults.filter((r) => r.risk === "low").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-heading">Contract Auditor</h1>
        <p className="text-muted-foreground mt-1">AI-powered clause analysis and risk scoring.</p>
      </div>

      {!uploaded ? (
        <Card className="shadow-card">
          <CardContent className="p-8">
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-12 text-center cursor-pointer hover:border-gold/50 transition-colors"
              onClick={handleUpload}
            >
              {analyzing ? (
                <div className="space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gold/10 flex items-center justify-center animate-pulse">
                    <Shield className="h-6 w-6 text-gold" />
                  </div>
                  <p className="text-sm font-medium">Analyzing contract...</p>
                  <p className="text-xs text-muted-foreground">Scanning clauses for risk and compliance issues</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Upload a contract to analyze</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT — up to 10MB</p>
                  </div>
                  <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">
                    <Upload className="mr-2 h-4 w-4" /> Choose File
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            {(["high", "medium", "low"] as const).map((level) => {
              const cfg = riskConfig[level];
              const Icon = cfg.icon;
              return (
                <Card key={level} className="shadow-card">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`h-10 w-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold">{riskSummary[level]}</p>
                      <p className="text-xs text-muted-foreground">{cfg.label} Issues</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Document info */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <FileText className="h-5 w-5 text-gold" />
              <div>
                <CardTitle className="text-base">Service_Agreement_TechCorp_2026.pdf</CardTitle>
                <p className="text-xs text-muted-foreground">Uploaded just now · 24 pages · 6 clauses flagged</p>
              </div>
            </CardHeader>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            {mockResults.map((result) => {
              const cfg = riskConfig[result.risk as keyof typeof riskConfig];
              const Icon = cfg.icon;
              return (
                <Card key={result.clause} className="shadow-card">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm">{result.clause}</h3>
                          <Badge className={`${cfg.bg} ${cfg.color} border-0`}>{cfg.label}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.issue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button variant="outline" onClick={() => setUploaded(false)}>
            Analyze Another Contract
          </Button>
        </>
      )}
    </div>
  );
}
