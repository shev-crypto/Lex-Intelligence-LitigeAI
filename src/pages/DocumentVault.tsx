import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FolderOpen, Calendar, FileText, ChevronRight } from "lucide-react";
import { useState } from "react";

const matters = [
  { id: "1", title: "TechCorp Ltd v. DataBridge Systems", client: "TechCorp Ltd", type: "Commercial Litigation", status: "active", docs: 14, nextHearing: "Apr 28, 2026" },
  { id: "2", title: "Adekunle Estate Administration", client: "Adekunle Family", type: "Probate", status: "active", docs: 8, nextHearing: "May 5, 2026" },
  { id: "3", title: "First National Bank — Loan Recovery", client: "First National Bank", type: "Debt Recovery", status: "active", docs: 22, nextHearing: "Apr 22, 2026" },
  { id: "4", title: "GreenEnergy Nigeria — Regulatory Compliance", client: "GreenEnergy Nigeria", type: "Regulatory", status: "pending", docs: 6, nextHearing: null },
  { id: "5", title: "Okafor & Sons — Partnership Dispute", client: "Okafor & Sons", type: "Commercial", status: "active", docs: 11, nextHearing: "May 12, 2026" },
  { id: "6", title: "Lagos State v. MetroBuilders", client: "MetroBuilders Inc", type: "Construction", status: "closed", docs: 31, nextHearing: null },
];

const statusColors = {
  active: "bg-risk-green/10 text-risk-green",
  pending: "bg-risk-amber/10 text-risk-amber",
  closed: "bg-muted text-muted-foreground",
};

export default function DocumentVault() {
  const [search, setSearch] = useState("");

  const filtered = matters.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase()) ||
    m.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Document Vault</h1>
          <p className="text-muted-foreground mt-1">Centralized matter and document management.</p>
        </div>
        <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2">
          <Plus className="h-4 w-4" /> New Matter
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search matters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Matters list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No matters found.</p>
        )}
        {filtered.map((matter) => (
          <Link key={matter.id} to={`/document-vault/${matter.id}`}>
            <Card className="shadow-card hover:shadow-card-hover transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <FolderOpen className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm truncate">{matter.title}</h3>
                      <Badge className={`${statusColors[matter.status as keyof typeof statusColors]} border-0 capitalize text-xs`}>
                        {matter.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{matter.client}</span>
                      <span>·</span>
                      <span>{matter.type}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {matter.docs} docs</span>
                      {matter.nextHearing && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {matter.nextHearing}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
