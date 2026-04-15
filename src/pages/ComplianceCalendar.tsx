import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Bell,
  Plus,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Deadline {
  id: string;
  title: string;
  body: string;
  due: string;
  category: string;
  urgency: "overdue" | "urgent" | "upcoming" | "scheduled";
  recurring: boolean;
}

const nigerianDeadlines: Deadline[] = [
  {
    id: "1",
    title: "FIRS Annual Tax Return",
    body: "File annual Company Income Tax (CIT) returns with the Federal Inland Revenue Service within 6 months of financial year-end.",
    due: "2026-06-30",
    category: "Tax",
    urgency: "upcoming",
    recurring: true,
  },
  {
    id: "2",
    title: "CAC Annual Returns",
    body: "File annual returns with the Corporate Affairs Commission within 42 days after the AGM (CAMA 2020, s.421).",
    due: "2026-05-15",
    category: "Corporate",
    urgency: "urgent",
    recurring: true,
  },
  {
    id: "3",
    title: "SEC Quarterly Report (Q1)",
    body: "Submit quarterly financial statements to the Securities and Exchange Commission for publicly listed companies.",
    due: "2026-04-30",
    category: "Securities",
    urgency: "urgent",
    recurring: true,
  },
  {
    id: "4",
    title: "NDPC Data Protection Audit",
    body: "Submit annual data protection audit report to the Nigeria Data Protection Commission (NDPA 2023, s.29).",
    due: "2026-03-15",
    category: "Data Protection",
    urgency: "overdue",
    recurring: true,
  },
  {
    id: "5",
    title: "Withholding Tax Remittance",
    body: "Remit withholding tax deducted to FIRS within 21 days after the month of deduction.",
    due: "2026-05-21",
    category: "Tax",
    urgency: "upcoming",
    recurring: true,
  },
  {
    id: "6",
    title: "PENCOM Monthly Contribution",
    body: "Remit pension contributions to the National Pension Commission within 7 working days after salary payment.",
    due: "2026-04-22",
    category: "Pension",
    urgency: "urgent",
    recurring: true,
  },
  {
    id: "7",
    title: "NSITF Contribution",
    body: "Remit Employee Compensation Fund contributions to the Nigeria Social Insurance Trust Fund.",
    due: "2026-05-31",
    category: "Employment",
    urgency: "upcoming",
    recurring: true,
  },
  {
    id: "8",
    title: "VAT Monthly Return",
    body: "File monthly VAT returns and remit collected VAT to FIRS on or before the 21st of the following month.",
    due: "2026-05-21",
    category: "Tax",
    urgency: "upcoming",
    recurring: true,
  },
  {
    id: "9",
    title: "CBN Prudential Returns",
    body: "Submit prudential returns to the Central Bank of Nigeria (applicable to financial institutions).",
    due: "2026-07-31",
    category: "Banking",
    urgency: "scheduled",
    recurring: true,
  },
  {
    id: "10",
    title: "NERC Licence Renewal",
    body: "Renew electricity generation/distribution licence with the Nigerian Electricity Regulatory Commission.",
    due: "2026-12-31",
    category: "Energy",
    urgency: "scheduled",
    recurring: true,
  },
];

const urgencyConfig = {
  overdue: { icon: AlertTriangle, color: "text-risk-red", bg: "bg-risk-red/10", label: "Overdue", border: "border-risk-red/30" },
  urgent: { icon: Clock, color: "text-risk-amber", bg: "bg-risk-amber/10", label: "Due Soon", border: "border-risk-amber/30" },
  upcoming: { icon: Bell, color: "text-primary", bg: "bg-primary/10", label: "Upcoming", border: "border-primary/30" },
  scheduled: { icon: CheckCircle2, color: "text-risk-green", bg: "bg-risk-green/10", label: "Scheduled", border: "border-risk-green/30" },
};

const categories = ["All", "Tax", "Corporate", "Securities", "Data Protection", "Pension", "Employment", "Banking", "Energy"];

export default function ComplianceCalendar() {
  const [filter, setFilter] = useState("All");
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customCategory, setCustomCategory] = useState("Tax");
  const [customDate, setCustomDate] = useState("");
  const [customDeadlines, setCustomDeadlines] = useState<Deadline[]>([]);

  const allDeadlines = [...nigerianDeadlines, ...customDeadlines];
  const filtered = filter === "All" ? allDeadlines : allDeadlines.filter((d) => d.category === filter);
  const sorted = [...filtered].sort((a, b) => {
    const order = { overdue: 0, urgent: 1, upcoming: 2, scheduled: 3 };
    return order[a.urgency] - order[b.urgency];
  });

  const summary = {
    overdue: allDeadlines.filter((d) => d.urgency === "overdue").length,
    urgent: allDeadlines.filter((d) => d.urgency === "urgent").length,
    upcoming: allDeadlines.filter((d) => d.urgency === "upcoming").length,
    scheduled: allDeadlines.filter((d) => d.urgency === "scheduled").length,
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedItems.size === sorted.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(sorted.map((d) => d.id)));
    }
  };

  const handleAddCustom = () => {
    if (!customTitle || !customDate) return;
    const newDeadline: Deadline = {
      id: `custom-${Date.now()}`,
      title: customTitle,
      body: "Custom reminder",
      due: customDate,
      category: customCategory,
      urgency: new Date(customDate) < new Date() ? "overdue" : "upcoming",
      recurring: false,
    };
    setCustomDeadlines((prev) => [...prev, newDeadline]);
    setCustomTitle("");
    setCustomDate("");
    setShowAddDialog(false);
  };

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)} days overdue`;
    if (diff === 0) return "Due today";
    return `${diff} days`;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading">Compliance Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Nigerian regulatory filing deadlines and custom reminders.
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-1.5">
              <Plus className="h-4 w-4" /> Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Custom Deadline</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Title</Label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. CAMA Annual Return"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={customCategory} onValueChange={setCustomCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.filter((c) => c !== "All").map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                />
              </div>
              <Button onClick={handleAddCustom} className="w-full bg-gold text-ink hover:bg-gold/90">
                Add Deadline
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        {(["overdue", "urgent", "upcoming", "scheduled"] as const).map((level) => {
          const cfg = urgencyConfig[level];
          const Icon = cfg.icon;
          return (
            <Card key={level} className="shadow-card">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`h-10 w-10 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{summary[level]}</p>
                  <p className="text-xs text-muted-foreground">{cfg.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
            className={filter === cat ? "bg-gold text-ink hover:bg-gold/90" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Select all */}
      <div className="flex items-center gap-3">
        <Checkbox
          checked={selectedItems.size === sorted.length && sorted.length > 0}
          onCheckedChange={toggleAll}
        />
        <span className="text-sm text-muted-foreground">
          {selectedItems.size > 0 ? `${selectedItems.size} selected` : "Select all"}
        </span>
      </div>

      {/* Deadline list */}
      <div className="space-y-3">
        {sorted.map((deadline) => {
          const cfg = urgencyConfig[deadline.urgency];
          const Icon = cfg.icon;
          return (
            <Card
              key={deadline.id}
              className={`shadow-card transition-all ${selectedItems.has(deadline.id) ? "ring-2 ring-gold/40" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedItems.has(deadline.id)}
                    onCheckedChange={() => toggleItem(deadline.id)}
                    className="mt-1"
                  />
                  <div className={`h-9 w-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{deadline.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {deadline.category}
                        </Badge>
                        <Badge className={`${cfg.bg} ${cfg.color} border-0`}>{cfg.label}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{deadline.body}</p>
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {new Date(deadline.due).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className={`text-xs font-medium ${cfg.color}`}>
                        {daysUntil(deadline.due)}
                      </span>
                      {deadline.recurring && (
                        <Badge variant="outline" className="text-xs">Recurring</Badge>
                      )}
                    </div>
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
