import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Calendar, Plus, Clock, StickyNote } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const matterData: Record<string, { title: string; client: string; type: string; status: string }> = {
  "1": { title: "TechCorp Ltd v. DataBridge Systems", client: "TechCorp Ltd", type: "Commercial Litigation", status: "active" },
  "2": { title: "Adekunle Estate Administration", client: "Adekunle Family", type: "Probate", status: "active" },
  "3": { title: "First National Bank — Loan Recovery", client: "First National Bank", type: "Debt Recovery", status: "active" },
  "4": { title: "GreenEnergy Nigeria — Regulatory Compliance", client: "GreenEnergy Nigeria", type: "Regulatory", status: "pending" },
  "5": { title: "Okafor & Sons — Partnership Dispute", client: "Okafor & Sons", type: "Commercial", status: "active" },
  "6": { title: "Lagos State v. MetroBuilders", client: "MetroBuilders Inc", type: "Construction", status: "closed" },
};

const mockDocs = [
  { name: "Statement of Claim.pdf", size: "2.4 MB", date: "Apr 10, 2026" },
  { name: "Witness Deposition — Adeyemi.pdf", size: "1.1 MB", date: "Apr 8, 2026" },
  { name: "Exhibit A — Contract.pdf", size: "3.2 MB", date: "Apr 5, 2026" },
  { name: "Court Order — Adjournment.pdf", size: "0.4 MB", date: "Mar 28, 2026" },
];

const mockNotes = [
  { text: "Client confirmed timeline of events. Key witness available for May hearing.", date: "Apr 14, 2026" },
  { text: "Opposing counsel requested adjournment — judge granted 2 weeks.", date: "Apr 8, 2026" },
  { text: "Filed motion for discovery. Awaiting court response.", date: "Mar 30, 2026" },
];

export default function MatterDetail() {
  const { id } = useParams();
  const matter = matterData[id || ""] || { title: "Unknown Matter", client: "—", type: "—", status: "—" };
  const { uploading, pickAndUpload, uploadedFiles } = useFileUpload();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/document-vault">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading">{matter.title}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>{matter.client}</span>
            <span>·</span>
            <span>{matter.type}</span>
            <Badge variant="outline" className="capitalize ml-1">{matter.status}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="hearings">Hearings</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button
              className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2"
              size="sm"
              onClick={() => pickAndUpload()}
              disabled={uploading}
            >
              <Plus className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
          {uploadedFiles.map((file) => (
            <Card key={file.path} className="shadow-card border-gold/20">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-9 w-9 rounded-lg bg-risk-green/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-risk-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB · Just uploaded</p>
                </div>
              </CardContent>
            </Card>
          ))}
          {mockDocs.map((doc) => (
            <Card key={doc.name} className="shadow-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-9 w-9 rounded-lg bg-gold/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="hearings" className="space-y-4 mt-4">
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-9 w-9 rounded-lg bg-risk-amber/10 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-risk-amber" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Next Hearing — Federal High Court, Lagos</p>
                <p className="text-xs text-muted-foreground">Apr 28, 2026 · 10:00 AM · Courtroom 4</p>
              </div>
              <Badge className="bg-risk-amber/10 text-risk-amber border-0">Upcoming</Badge>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Previous Hearing — Federal High Court, Lagos</p>
                <p className="text-xs text-muted-foreground">Mar 15, 2026 · Adjourned for 6 weeks</p>
              </div>
              <Badge variant="outline">Completed</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2" size="sm">
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          </div>
          {mockNotes.map((note) => (
            <Card key={note.date} className="shadow-card">
              <CardContent className="flex items-start gap-4 p-4">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <StickyNote className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{note.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
