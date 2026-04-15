import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Scale, BookOpen, Lightbulb, Plus } from "lucide-react";

const mockCases = [
  { id: 1, name: "TechCorp v. DataBridge — Trial Bundle", files: 5, date: "Apr 14, 2026" },
  { id: 2, name: "First National Bank Recovery — Evidence Pack", files: 8, date: "Apr 12, 2026" },
];

export default function TrialPrep() {
  const [activeCase, setActiveCase] = useState<number | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Trial Prep Studio</h1>
          <p className="text-muted-foreground mt-1">Multi-document analysis for case strategy and preparation.</p>
        </div>
        <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2">
          <Plus className="h-4 w-4" /> New Session
        </Button>
      </div>

      {!activeCase ? (
        <div className="space-y-4">
          {mockCases.map((c) => (
            <Card
              key={c.id}
              className="shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              onClick={() => setActiveCase(c.id)}
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
              <Button className="mt-4 bg-gold text-ink hover:bg-gold/90 font-semibold">
                <Upload className="mr-2 h-4 w-4" /> Upload Files
              </Button>
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
