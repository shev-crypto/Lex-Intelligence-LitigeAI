import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email,
        name: name || null,
        firm_name: firmName || null,
        interest: "enterprise",
        source: "pricing_page",
      });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the waitlist!", description: "We'll be in touch soon." });
          setSubmitted(true);
        } else {
          throw error;
        }
      } else {
        setSubmitted(true);
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Link to="/pricing" className="flex items-center gap-1 text-sm text-white/60 hover:text-gold transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to pricing
        </Link>

        <Card className="border-white/10 bg-white/[0.03] animate-scale-in">
          <CardContent className="p-8">
            {submitted ? (
              <div className="text-center space-y-4">
                <div className="h-14 w-14 mx-auto rounded-full bg-risk-green/15 flex items-center justify-center">
                  <Check className="h-7 w-7 text-risk-green" />
                </div>
                <h2 className="font-heading text-xl text-white">You're on the list!</h2>
                <p className="text-sm text-white/70 font-body">
                  We'll reach out to discuss your Enterprise requirements. Thank you for your interest in LitigeAI.
                </p>
                <Link to="/">
                  <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold mt-2">
                    Back to Home
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-white">Enterprise Waitlist</h2>
                    <p className="text-xs text-white/60">We'll reach out to discuss your needs</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white/80">Email *</Label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@firm.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Your name</Label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white/80">Firm name</Label>
                    <Input
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="Your law firm or company"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold text-ink hover:bg-gold/90 font-semibold"
                  disabled={loading}
                >
                  {loading ? "Joining..." : "Join Enterprise Waitlist"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
