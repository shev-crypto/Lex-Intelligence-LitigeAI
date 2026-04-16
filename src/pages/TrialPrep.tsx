import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Upload, FileText, Scale, BookOpen, Lightbulb, Plus, Download, Save, Trash2, Clock } from "lucide-react";
import { useActivityLog } from "@/hooks/useActivityLog";
import { useSavedSessions } from "@/hooks/useSavedSessions";
import { useFileUpload } from "@/hooks/useFileUpload";
import { exportToPDFText } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

const mockCases = [
  { id: 1, name: "TechCorp v. DataBridge — Trial Bundle", files: 5, date: "Apr 14, 2026" },
  { id: 2, name: "First National Bank Recovery — Evidence Pack", files: 8, date: "Apr 12, 2026" },
];

export default function TrialPrep() {
  const [activeCase, setActiveCase] = useState<number | null>(null);
  const { logActivity } = useActivityLog();
  const { sessions, saveSession, deleteSession } = useSavedSessions("trial_prep");
  const { toast } = useToast();
  const { uploading, pickAndUpload, uploadedFiles } = useFileUpload();

  const handleSaveSession = async () => {
    const caseName = mockCases.find((c) => c.id === activeCase)?.name || "Trial Session";
    await saveSession(caseName, {
      caseId: activeCase,
      activeTab: "strategy",
    });
    toast({ title: "Session saved", description: "You can continue this later." });
  };

  const handleExportPDF = () => {
    const caseName = mockCases.find((c) => c.id === activeCase)?.name || "Trial Session";
    exportToPDFText(
      [
        {
          title: "Case Strategy",
          content:
            "Based on the uploaded documents, the strongest approach centers on establishing breach of contract through the defendant's failure to meet agreed delivery timelines (Clause 4.2). Supporting evidence includes email correspondence from March 2026 and the project milestone report. Consider emphasizing the liquidated damages clause and the defendant's prior acknowledgment of delays.",
        },
        {
          title: "Relevant Precedents",
          content: `
            <p><strong>Stabilini Visinoni Ltd v. Mallinson & Partners (2014)</strong><br/>
            Supreme Court established that delay penalties in commercial contracts are enforceable when the agreed amount represents a genuine pre-estimate of loss.</p>
            <p><strong>AG Lagos v. Eko Hotels (2006)</strong><br/>
            Court of Appeal held that contractual timelines constitute fundamental terms where time is expressed as being of the essence.</p>`,
        },
      ],
      `Trial_Prep_${caseName.replace(/\s+/g, "_")}`
    );
  };

  const openCase = (id: number) => {
    setActiveCase(id);
    logActivity("trial_prep_opened", mockCases.find((c) => c.id === id)?.name || "Trial Session");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Trial Prep Studio</h1>
          <p className="text-muted-foreground mt-1">Multi-document analysis for case strategy and preparation.</p>
        </div>
        <div className="flex items-center gap-2">
          {activeCase && (
            <>
              <Button variant="outline" size="sm" onClick={handleSaveSession} className="gap-1.5">
                <Save className="h-4 w-4" /> Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Download className="h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
          <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2">
            <Plus className="h-4 w-4" /> New Session
          </Button>
        </div>
      </div>

      {/* Saved sessions banner */}
      {!activeCase && sessions.filter((s) => s.status === "in_progress").length > 0 && (
        <Card className="shadow-card border-gold/20 bg-gold/5">
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> Continue where you left off
            </p>
            {sessions
              .filter((s) => s.status === "in_progress")
              .slice(0, 3)
              .map((s) => (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border p-3 mb-2 hover:bg-muted/50 transition-colors">
                  <button onClick={() => setActiveCase(1)} className="flex items-center gap-3 flex-1 text-left">
                    <Scale className="h-4 w-4 text-gold" />
                    <div>
                      <p className="text-sm font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">
                        Last edited {new Date(s.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                  <Button variant="ghost" size="icon" onClick={() => deleteSession(s.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      {!activeCase ? (
        <div className="space-y-4">
          {mockCases.map((c) => (
            <Card
              key={c.id}
              className="shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              onClick={() => openCase(c.id)}
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Scale className="h-5 w-5 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.files} documents · {c.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload new */}
          <Card className="shadow-card border-dashed">
            <CardContent className="p-8 text-center">
              <div className="h-12 w-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Start a new trial prep session</p>
              <p className="text-xs text-muted-foreground mt-1">Upload case files for AI analysis</p>
              <Button
                className="mt-4 bg-gold text-ink hover:bg-gold/90 font-semibold"
                onClick={() => pickAndUpload()}
                disabled={uploading}
              >
                <Upload className="mr-2 h-4 w-4" /> {uploading ? "Uploading..." : "Upload Files"}
              </Button>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-1 text-left">
                  {uploadedFiles.map((f) => (
                    <div key={f.path} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" />
                      <span>{f.name}</span>
                      <span>({(f.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Button variant="outline" onClick={() => setActiveCase(null)}>
            ← Back to Sessions
          </Button>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Scale className="h-5 w-5 text-gold" />
              <CardTitle className="text-base">{mockCases.find((c) => c.id === activeCase)?.name}</CardTitle>
            </CardHeader>
          </Card>

          <Tabs defaultValue="strategy">
            <TabsList>
              <TabsTrigger value="strategy">Case Strategy</TabsTrigger>
              <TabsTrigger value="precedents">Precedents</TabsTrigger>
              <TabsTrigger value="arguments">Arguments</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="mt-4">
              <Card className="shadow-card">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-gold mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-sm mb-2">AI Strategy Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Based on the uploaded documents, the strongest approach centers on establishing breach of contract
                        through the defendant's failure to meet agreed delivery timelines (Clause 4.2). Supporting evidence
                        includes email correspondence from March 2026 and the project milestone report. Consider emphasizing
                        the liquidated damages clause and the defendant's prior acknowledgment of delays.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="precedents" className="mt-4">
              <Card className="shadow-card">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-gold mt-0.5" />
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold">Stabilini Visinoni Ltd v. Mallinson & Partners (2014)</h4>
                        <p className="text-xs text-muted-foreground mt-1">Supreme Court established that delay penalties in commercial contracts are enforceable when the agreed amount represents a genuine pre-estimate of loss.</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">AG Lagos v. Eko Hotels (2006)</h4>
                        <p className="text-xs text-muted-foreground mt-1">Court of Appeal held that contractual timelines constitute fundamental terms where time is expressed as being of the essence.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="arguments" className="mt-4">
              <Card className="shadow-card">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground">AI-generated argument outlines will appear here after analysis.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-4 space-y-3">
              {["Statement_of_Claim.pdf", "Contract_Agreement.pdf", "Email_Correspondence.pdf", "Project_Report.pdf", "Expert_Witness_Statement.pdf"].map((doc) => (
                <Card key={doc} className="shadow-card">
                  <CardContent className="flex items-center gap-4 p-4">
                    <FileText className="h-4 w-4 text-gold" />
                    <span className="text-sm flex-1">{doc}</span>
                    <Button variant="outline" size="sm">View</Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
