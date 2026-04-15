import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, AlertTriangle, Clock, CheckCircle2, ExternalLink, Download } from "lucide-react";
import { exportToCSV, exportToPDFText } from "@/lib/export";
import { useToast } from "@/hooks/use-toast";

const bodies = ["All", "SEC", "CBN", "FIRS", "CAC", "NAICOM", "PENCOM", "NCC", "NERC", "FCCPC", "NDPC", "AMCON", "NBA", "NITDA"];

const alerts = [
  { id: 1, body: "SEC", title: "New Disclosure Requirements for Listed Companies", summary: "The Securities and Exchange Commission has issued new guidelines requiring listed companies to disclose ESG metrics in their annual reports effective Q3 2026.", severity: "high", date: "Apr 15, 2026", category: "Disclosure" },
  { id: 2, body: "CBN", title: "Updated Foreign Exchange Policy for Commercial Banks", summary: "Central Bank of Nigeria releases amended FX guidelines affecting trade finance operations and documentary credit processes.", severity: "high", date: "Apr 14, 2026", category: "Banking" },
  { id: 3, body: "FIRS", title: "Tax Filing Deadline Extension for Q1 2026", summary: "Federal Inland Revenue Service extends corporate tax filing deadline by 30 days for companies with turnover below ₦100M.", severity: "medium", date: "Apr 13, 2026", category: "Tax" },
  { id: 4, body: "CAC", title: "Digital Compliance Certificate Now Required", summary: "Corporate Affairs Commission mandates digital compliance certificates for all registered entities starting May 2026.", severity: "medium", date: "Apr 12, 2026", category: "Corporate" },
  { id: 5, body: "NAICOM", title: "Updated Insurance Capital Adequacy Requirements", summary: "National Insurance Commission raises minimum capital requirements for general insurance underwriters.", severity: "high", date: "Apr 11, 2026", category: "Insurance" },
  { id: 6, body: "PENCOM", title: "New Guidelines for Pension Fund Administrators", summary: "Updated investment guidelines for pension fund administrators with revised asset allocation limits.", severity: "low", date: "Apr 10, 2026", category: "Pension" },
  { id: 7, body: "NCC", title: "Telecommunications Data Privacy Update", summary: "Nigerian Communications Commission issues supplementary data privacy guidelines for telecommunications operators.", severity: "medium", date: "Apr 9, 2026", category: "Telecom" },
  { id: 8, body: "FCCPC", title: "Consumer Protection Enforcement Notice", summary: "Federal Competition and Consumer Protection Commission announces new enforcement procedures for consumer complaints.", severity: "low", date: "Apr 8, 2026", category: "Consumer" },
];

const severityConfig = {
  high: { icon: AlertTriangle, color: "text-risk-red", bg: "bg-risk-red/10", label: "High" },
  medium: { icon: Clock, color: "text-risk-amber", bg: "bg-risk-amber/10", label: "Medium" },
  low: { icon: CheckCircle2, color: "text-risk-green", bg: "bg-risk-green/10", label: "Low" },
};

export default function RegulatoryFeed() {
  const [search, setSearch] = useState("");
  const [activeBody, setActiveBody] = useState("All");
  const [selectedAlerts, setSelectedAlerts] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const filtered = alerts.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    const matchesBody = activeBody === "All" || a.body === activeBody;
    return matchesSearch && matchesBody;
  });

  const toggleAlert = (id: number) => {
    setSelectedAlerts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedAlerts.size === filtered.length) {
      setSelectedAlerts(new Set());
    } else {
      setSelectedAlerts(new Set(filtered.map((a) => a.id)));
    }
  };

  const handleExportCSV = () => {
    const items = selectedAlerts.size > 0
      ? alerts.filter((a) => selectedAlerts.has(a.id))
      : filtered;
    exportToCSV(
      items.map((a) => ({
        Body: a.body,
        Title: a.title,
        Summary: a.summary,
        Severity: a.severity,
        Date: a.date,
        Category: a.category,
      })),
      "Regulatory_Alerts"
    );
    toast({ title: "Exported", description: "CSV downloaded." });
  };

  const handleExportPDF = () => {
    const items = selectedAlerts.size > 0
      ? alerts.filter((a) => selectedAlerts.has(a.id))
      : filtered;
    exportToPDFText(
      items.map((a) => ({
        title: `[${a.body}] ${a.title} <span class="badge ${a.severity}">${a.severity.toUpperCase()}</span>`,
        content: `<p>${a.summary}</p><p style="color:#6B7280;font-size:12px">${a.date} · ${a.category}</p>`,
      })),
      "Regulatory Feed Report"
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading">Regulatory Feed</h1>
          <p className="text-muted-foreground mt-1">Real-time alerts from Nigerian regulatory bodies.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" /> Export{selectedAlerts.size > 0 ? ` (${selectedAlerts.size})` : ""}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="default" className="gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Body tabs */}
      <div className="flex flex-wrap gap-2">
        {bodies.map((b) => (
          <Button
            key={b}
            variant={activeBody === b ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveBody(b)}
            className={activeBody === b ? "bg-gold text-ink hover:bg-gold/90" : ""}
          >
            {b}
          </Button>
        ))}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={filtered.length > 0 && selectedAlerts.size === filtered.length}
          onCheckedChange={toggleAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedAlerts.size > 0 ? `${selectedAlerts.size} selected` : "Select all"}
        </span>
      </div>

      {/* Alert cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No alerts found.</p>
        )}
        {filtered.map((alert) => {
          const sev = severityConfig[alert.severity as keyof typeof severityConfig];
          const Icon = sev.icon;
          const isSelected = selectedAlerts.has(alert.id);
          return (
            <Card key={alert.id} className={`shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 ${isSelected ? "ring-2 ring-gold/40" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleAlert(alert.id)}
                    className="mt-1"
                  />
                  <div className={`h-10 w-10 rounded-lg ${sev.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`h-5 w-5 ${sev.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{alert.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{alert.body}</Badge>
                          <Badge variant="outline" className="text-xs">{alert.category}</Badge>
                          <span className="text-xs text-muted-foreground">{alert.date}</span>
                        </div>
                      </div>
                      <Badge className={`${sev.bg} ${sev.color} border-0 shrink-0`}>{sev.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{alert.summary}</p>
                    <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80 -ml-2">
                      Read full notice <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
