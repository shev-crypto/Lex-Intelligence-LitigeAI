import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Sparkles, Briefcase, Bell, FolderOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const practiceAreas = [
  "Litigation",
  "Corporate/Commercial",
  "Family",
  "Criminal",
  "Constitutional",
  "Real Estate",
  "Employment",
  "General Practice",
];

const yearsOptions = ["Less than 2", "2 to 5", "5 to 10", "More than 10"];

const courts = [
  "Supreme Court",
  "Court of Appeal",
  "Federal High Court",
  "State High Court",
  "National Industrial Court",
  "Magistrate Court",
  "Customary Court",
  "Tribunal",
];

const regulatoryBodies = [
  "CBN", "SEC", "FIRS", "NDPC", "CAC", "NAFDAC",
  "NITDA", "NCC", "NAICOM", "PENCOM", "NESREA", "FCCPC",
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 2 data
  const [practiceName, setPracticeName] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [yearsOfPractice, setYearsOfPractice] = useState("");
  const [selectedCourts, setSelectedCourts] = useState<string[]>([]);

  // Step 3 data
  const [selectedBodies, setSelectedBodies] = useState<string[]>([]);

  // Step 4 data
  const [matterName, setMatterName] = useState("");
  const [clientName, setClientName] = useState("");
  const [court, setCourt] = useState("");
  const [nextHearing, setNextHearing] = useState("");

  const [saving, setSaving] = useState(false);

  const toggleCourt = (c: string) => {
    setSelectedCourts((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const toggleBody = (b: string) => {
    setSelectedBodies((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const saveAndFinish = async (skippedMatter: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          practice_name: practiceName || null,
          bar_number: barNumber || null,
          primary_practice_area: practiceArea || null,
          years_of_practice: yearsOfPractice || null,
          preferred_courts: selectedCourts.length > 0 ? selectedCourts : null,
          regulatory_interests: selectedBodies.length > 0 ? selectedBodies : null,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Welcome to LitigeAI!",
        description: "Your workspace is ready.",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Onboarding save failed:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const firstName = profile?.full_name?.split(" ")[0] ?? "Counsel";

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}% complete</span>
          </div>
          <Progress value={(step / 4) * 100} className="h-1.5 bg-white/10" />
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <Card className="border-white/10 bg-white/[0.03] animate-fade-in">
            <CardContent className="p-8 text-center space-y-6">
              <div className="h-16 w-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-gold" />
              </div>
              <div>
                <h1 className="font-heading text-2xl text-white">Welcome to LitigeAI, {firstName}</h1>
                <p className="text-white/70 text-sm mt-2 font-body">
                  Let us set up your workspace in under 2 minutes
                </p>
              </div>
              <Button
                className="bg-gold text-ink hover:bg-gold/90 font-semibold w-full"
                onClick={() => setStep(2)}
              >
                Let's go <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Practice */}
        {step === 2 && (
          <Card className="border-white/10 bg-white/[0.03] animate-fade-in">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-white">Tell us about your practice</h2>
                  <p className="text-xs text-white/60">All fields are optional</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Practice or firm name</Label>
                  <Input
                    value={practiceName}
                    onChange={(e) => setPracticeName(e.target.value)}
                    placeholder="e.g. Adekunle & Associates"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Bar number</Label>
                  <Input
                    value={barNumber}
                    onChange={(e) => setBarNumber(e.target.value)}
                    placeholder="SCN/12345"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Primary practice area</Label>
                  <Select value={practiceArea} onValueChange={setPracticeArea}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select area" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceAreas.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Years of practice</Label>
                  <Select value={yearsOfPractice} onValueChange={setYearsOfPractice}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearsOptions.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Courts you practise in</Label>
                  <div className="flex flex-wrap gap-2">
                    {courts.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className={`cursor-pointer transition-colors text-xs ${
                          selectedCourts.includes(c)
                            ? "bg-gold/20 border-gold text-gold"
                            : "border-white/20 text-white/60 hover:border-white/40"
                        }`}
                        onClick={() => toggleCourt(c)}
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/5" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button className="flex-1 bg-gold text-ink hover:bg-gold/90 font-semibold" onClick={() => setStep(3)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Regulatory interests */}
        {step === 3 && (
          <Card className="border-white/10 bg-white/[0.03] animate-fade-in">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-white">Your regulatory interests</h2>
                  <p className="text-xs text-white/60">We'll prioritise alerts from these bodies</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {regulatoryBodies.map((b) => (
                  <div
                    key={b}
                    onClick={() => toggleBody(b)}
                    className={`rounded-lg border p-3 text-center cursor-pointer transition-all ${
                      selectedBodies.includes(b)
                        ? "bg-gold/15 border-gold text-gold"
                        : "border-white/10 text-white/70 hover:border-white/30"
                    }`}
                  >
                    <span className="text-sm font-semibold">{b}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/5" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button className="flex-1 bg-gold text-ink hover:bg-gold/90 font-semibold" onClick={() => setStep(4)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: First matter */}
        {step === 4 && (
          <Card className="border-white/10 bg-white/[0.03] animate-fade-in">
            <CardContent className="p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-heading text-xl text-white">Create your first matter</h2>
                  <p className="text-xs text-white/60">You can skip this and do it later</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-white/80">Matter name</Label>
                  <Input
                    value={matterName}
                    onChange={(e) => setMatterName(e.target.value)}
                    placeholder="e.g. TechCorp v. DataBridge Systems"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Client name</Label>
                  <Input
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. TechCorp Ltd"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Court</Label>
                  <Select value={court} onValueChange={setCourt}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/80">Next hearing date</Label>
                  <Input
                    type="date"
                    value={nextHearing}
                    onChange={(e) => setNextHearing(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/5" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button
                  className="flex-1 bg-gold text-ink hover:bg-gold/90 font-semibold"
                  onClick={() => saveAndFinish(false)}
                  disabled={saving}
                >
                  {saving ? "Setting up..." : "Create Matter"}
                </Button>
              </div>
              <button
                className="w-full text-center text-sm text-white/60 hover:text-gold transition-colors"
                onClick={() => saveAndFinish(true)}
                disabled={saving}
              >
                Skip for now
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
