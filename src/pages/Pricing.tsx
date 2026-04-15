import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  ArrowRight,
  Zap,
  Shield,
  Building2,
  User,
  Users,
  MessageSquare,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Solo",
    slug: "solo",
    tagline: "For individual practitioners",
    monthlyPrice: 15000,
    annualPrice: 150000,
    icon: User,
    features: [
      "Document Vault",
      "Contract Compliance Auditor",
      "Trial Preparation Studio",
      "Regulatory Feed (read-only)",
      "5 active matters",
      "10 contract audits/month",
      "10 trial prep reports/month",
      "2GB document storage",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: false,
  },
  {
    name: "Chambers",
    slug: "chambers",
    tagline: "For law firms and chambers",
    monthlyPrice: 45000,
    annualPrice: 432000,
    icon: Users,
    features: [
      "All Solo features",
      "Full Regulatory Feed with custom alerts",
      "Team access (up to 10 members)",
      "Shared matter management",
      "Shared document vault",
      "Unlimited matters",
      "50 contract audits/month",
      "50 trial prep reports/month",
      "20GB document storage",
    ],
    cta: "Start 14-Day Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    slug: "enterprise",
    tagline: "For large firms and corporate legal",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Building2,
    features: [
      "All Chambers features",
      "Unlimited everything",
      "Custom regulatory monitoring",
      "API access",
      "Dedicated account manager",
      "Priority support",
      "Custom onboarding",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "What happens after my 14-day free trial?",
    a: "After your trial ends, you'll need to choose a plan to continue using LitigeAI. Your data is preserved for 30 days, so you won't lose any work.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit. We use enterprise-grade infrastructure with strict access controls and regular security audits.",
  },
  {
    q: "Does LitigeAI understand Nigerian law?",
    a: "Yes. LitigeAI is built specifically for the Nigerian legal landscape. Our AI is trained on Nigerian statutes, regulations, and case law including CAMA 2020, NDPA 2023, and more.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major Nigerian bank cards, bank transfers via Paystack, and international cards (Visa, Mastercard) via Flutterwave for USD payments.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, you can upgrade or downgrade your plan at any time from your billing settings. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes! Annual billing saves you 2 months on both Solo and Chambers plans — that's a significant saving over monthly billing.",
  },
  {
    q: "How does team access work?",
    a: "On the Chambers plan, you can invite up to 10 team members. Each member gets their own login with role-based permissions (Admin, Lawyer, or Paralegal).",
  },
];

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(amount);
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [paymentModal, setPaymentModal] = useState<{ slug: string; name: string; price: number } | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCTA = (slug: string) => {
    if (slug === "enterprise") {
      navigate("/waitlist");
      return;
    }
    if (!user) {
      navigate("/signup");
      return;
    }
    const plan = plans.find((p) => p.slug === slug)!;
    const price = annual ? plan.annualPrice : plan.monthlyPrice;
    setPaymentModal({ slug, name: plan.name, price });
  };

  const handlePaystack = async () => {
    if (!paymentModal) return;
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("paystack-initialize", {
        body: { plan_slug: paymentModal.slug, billing_cycle: annual ? "annual" : "monthly" },
      });
      if (error) throw error;
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (err: any) {
      toast({ title: "Payment failed", description: err.message, variant: "destructive" });
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleFlutterwave = async () => {
    if (!paymentModal) return;
    setPaymentLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("flutterwave-initialize", {
        body: { plan_slug: paymentModal.slug, billing_cycle: annual ? "annual" : "monthly" },
      });
      if (error) throw error;

      // Load Flutterwave inline
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.onload = () => {
        // @ts-ignore
        window.FlutterwaveCheckout({
          public_key: data.public_key,
          tx_ref: data.tx_ref,
          amount: data.amount,
          currency: data.currency,
          customer: data.customer,
          customizations: data.customizations,
          meta: data.meta,
          callback: async (response: any) => {
            // Verify payment
            try {
              await supabase.functions.invoke("flutterwave-verify", {
                body: { transaction_id: response.transaction_id, tx_ref: data.tx_ref },
              });
              toast({ title: "Payment successful!", description: "Your subscription is now active." });
              setPaymentModal(null);
              navigate("/dashboard");
            } catch {
              toast({ title: "Verification failed", description: "Please contact support.", variant: "destructive" });
            }
          },
          onclose: () => {
            setPaymentLoading(false);
          },
        });
      };
      document.head.appendChild(script);
    } catch (err: any) {
      toast({ title: "Payment failed", description: err.message, variant: "destructive" });
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/">
            <span className="font-heading text-2xl bg-gradient-to-r from-gold via-gold/90 to-white bg-clip-text text-transparent">
              LitigeAI
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/5">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">Start Free Trial</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 lg:py-20 text-center">
        <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white mb-4">
          Simple, transparent pricing for{" "}
          <span className="text-gold">Nigerian legal professionals</span>
        </h1>
        <p className="text-white/75 max-w-xl mx-auto mb-10 font-body">
          Start free for 14 days. No credit card required. Choose the plan that fits your practice.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <span className={`text-sm font-medium ${!annual ? "text-white" : "text-white/60"}`}>Monthly</span>
          <Switch checked={annual} onCheckedChange={setAnnual} />
          <span className={`text-sm font-medium ${annual ? "text-white" : "text-white/60"}`}>
            Annual
          </span>
          {annual && (
            <Badge className="bg-risk-green/15 text-risk-green border-0 ml-1">Save 2 months</Badge>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const price = plan.slug === "enterprise" ? null : annual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <Card
                key={plan.slug}
                className={`relative overflow-hidden text-left ${
                  plan.highlighted
                    ? "border-gold/50 bg-gold/5 shadow-[0_0_40px_-12px_hsl(43,78%,46%,0.15)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
                    <Badge className="absolute top-4 right-4 bg-gold text-ink border-0 font-semibold">
                      Most Popular
                    </Badge>
                  </>
                )}
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl text-white">{plan.name}</h3>
                      <p className="text-xs text-white/70 font-body">{plan.tagline}</p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    {price !== null ? (
                      <>
                        <span className="text-3xl font-bold text-white">{formatNaira(price)}</span>
                        <span className="text-white/70 text-sm">/{annual ? "year" : "month"}</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-white">Custom pricing</span>
                    )}
                  </div>

                  <ul className="space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/80">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plan.highlighted
                        ? "bg-gold text-ink hover:bg-gold/90 font-semibold"
                        : plan.slug === "enterprise"
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-white/10 text-white hover:bg-white/15"
                    }`}
                    onClick={() => handleCTA(plan.slug)}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>

                  {plan.slug !== "enterprise" && (
                    <p className="text-center text-xs text-white/60">No credit card required</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5">
        <div className="container mx-auto px-6 py-16 lg:py-20 max-w-3xl">
          <h2 className="font-heading text-2xl md:text-3xl text-white text-center mb-10">
            Frequently Asked <span className="text-gold">Questions</span>
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border border-white/10 rounded-lg px-5 bg-white/[0.02]"
              >
                <AccordionTrigger className="text-sm text-white/90 hover:text-gold font-medium text-left py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white/70 leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-t border-white/5">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gold" /> Secured by Paystack & Flutterwave
            </span>
            <span className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold" /> Powered by Lovable Cloud
            </span>
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gold" /> Built for Nigerian Law
            </span>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/5">
        <div className="container mx-auto px-6 py-16 text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/70 max-w-md mx-auto mb-8 font-body">
            Join Nigerian legal professionals already using LitigeAI to stay ahead.
          </p>
          <Link to={user ? "#" : "/signup"} onClick={() => user && window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Button size="lg" className="bg-gold text-ink hover:bg-gold/90 font-semibold text-base px-10 h-12">
              {user ? "Choose a Plan Above" : "Start Your Free Trial"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Payment Gateway Modal */}
      <Dialog open={!!paymentModal} onOpenChange={() => setPaymentModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Payment Method</DialogTitle>
          </DialogHeader>
          {paymentModal && (
            <div className="space-y-4 pt-2">
              <div className="rounded-lg border p-4 bg-muted/50">
                <p className="font-semibold">{paymentModal.name} Plan</p>
                <p className="text-sm text-muted-foreground">
                  {formatNaira(paymentModal.price)} / {annual ? "year" : "month"}
                </p>
              </div>

              <Button
                className="w-full bg-[#00C3F7] text-white hover:bg-[#00C3F7]/90 font-semibold h-12"
                onClick={handlePaystack}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Pay with Paystack
                <span className="ml-auto text-xs opacity-75">NGN cards, bank transfer</span>
              </Button>

              <Button
                variant="outline"
                className="w-full h-12 font-semibold border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623]/10"
                onClick={handleFlutterwave}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                Pay with Flutterwave
                <span className="ml-auto text-xs opacity-75">Cards, mobile money</span>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Your payment is processed securely. Cancel anytime.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
