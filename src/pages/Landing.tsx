import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  FileSearch,
  Scale,
  Bell,
  BookOpen,
  Zap,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Bell,
    title: "Regulatory Feed",
    description:
      "Real-time alerts from SEC, CBN, FIRS, CAC and 20+ Nigerian regulatory bodies. Never miss a compliance deadline.",
  },
  {
    icon: FileSearch,
    title: "Contract Auditor",
    description:
      "AI-powered clause analysis that flags risks, missing provisions, and non-compliant language in seconds.",
  },
  {
    icon: BookOpen,
    title: "Document Vault",
    description:
      "Centralized matter management with hearing dates, document storage, notes, and deadline tracking.",
  },
  {
    icon: Scale,
    title: "Trial Prep Studio",
    description:
      "Multi-document analysis for case strategy, precedent research, and argument preparation.",
  },
  {
    icon: Shield,
    title: "Compliance Scoring",
    description:
      "Automated risk assessment with red/amber/green scoring across all your contracts and regulatory obligations.",
  },
  {
    icon: Zap,
    title: "AI Legal Assistant",
    description:
      "Ask questions in plain English, get answers grounded in Nigerian law, case precedent, and your own documents.",
  },
];

const regulatoryBodies = [
  "SEC",
  "CBN",
  "FIRS",
  "CAC",
  "NAICOM",
  "PENCOM",
  "NDIC",
  "NCC",
  "NERC",
  "FCCPC",
];

const pricingPlans = [
  {
    name: "Solo Practitioner",
    price: "₦25,000",
    period: "/month",
    description: "For individual lawyers and consultants",
    features: [
      "Regulatory feed (5 bodies)",
      "10 contract audits/month",
      "Document vault (5 matters)",
      "Email support",
    ],
    cta: "Start Free Trial",
    highlighted: false,
  },
  {
    name: "Law Firm",
    price: "₦75,000",
    period: "/month",
    description: "For teams of up to 10 legal professionals",
    features: [
      "Regulatory feed (all bodies)",
      "Unlimited contract audits",
      "Document vault (unlimited)",
      "Trial prep studio",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For corporations and large firms",
    features: [
      "Everything in Law Firm",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
      "SLA guarantee",
      "Custom AI training",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const testimonials = [
  {
    quote:
      "LitigeAI cut our regulatory compliance review time by 70%. We now catch updates from SEC and CBN the same day they're published.",
    name: "Adaeze Okonkwo",
    role: "Partner, Okonkwo & Associates",
  },
  {
    quote:
      "The contract auditor flagged a liability clause we'd missed in three rounds of manual review. It paid for itself on day one.",
    name: "Babajide Adeyemi",
    role: "General Counsel, TechFin Nigeria",
  },
  {
    quote:
      "Finally, a legal tech tool built for the Nigerian legal landscape. The regulatory feed alone is worth the subscription.",
    name: "Chidinma Eze",
    role: "Senior Associate, Eze Legal Partners",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink text-foreground">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <span className="font-heading text-2xl text-gold">LitigeAI</span>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/70 hover:text-gold transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-gold transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm text-white/70 hover:text-gold transition-colors">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/5">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-6 py-20 lg:py-28">
          <div className="flex-1 space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
              <Zap className="h-3.5 w-3.5" />
              AI-Powered Legal Intelligence
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white">
              Nigeria's Premier{" "}
              <span className="text-gold">Legal Compliance</span>{" "}
              Platform
            </h1>

            <p className="text-lg text-white/60 max-w-lg font-body leading-relaxed">
              Real-time regulatory monitoring, AI contract auditing, and trial
              preparation — built for African legal professionals competing
              globally.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gold text-ink hover:bg-gold/90 font-semibold text-base px-8 h-12"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-white/40 text-base px-8 h-12"
                >
                  View Live Demo
                </Button>
              </Link>
            </div>

            {/* Trust bar */}
            <div className="flex items-center gap-6 pt-4 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-risk-green" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-risk-green" /> No credit card required
              </span>
            </div>
          </div>

          {/* Product preview — mock dashboard */}
          <div className="flex-1 w-full max-w-xl">
            <div className="rounded-xl border border-white/10 bg-white p-1 shadow-2xl">
              <div className="rounded-lg bg-white border border-border overflow-hidden">
                {/* Mock title bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="h-2.5 w-2.5 rounded-full bg-risk-red" />
                  <div className="h-2.5 w-2.5 rounded-full bg-risk-amber" />
                  <div className="h-2.5 w-2.5 rounded-full bg-risk-green" />
                  <span className="ml-3 text-xs text-steel font-mono">dashboard.litigeai.com</span>
                </div>
                {/* Mock content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-3 w-32 rounded bg-muted" />
                      <div className="h-2 w-20 rounded bg-muted/50" />
                    </div>
                    <div className="h-8 w-24 rounded bg-gold/20 flex items-center justify-center">
                      <span className="text-xs text-gold font-semibold">3 Alerts</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Contracts", value: "24", color: "bg-gold/15 text-gold" },
                      { label: "Compliant", value: "18", color: "bg-risk-green/15 text-risk-green" },
                      { label: "At Risk", value: "6", color: "bg-risk-red/15 text-risk-red" },
                    ].map((stat) => (
                      <div key={stat.label} className={`rounded-lg p-3 ${stat.color}`}>
                        <p className="text-lg font-semibold">{stat.value}</p>
                        <p className="text-xs opacity-70">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {["SEC Notice — New disclosure requirements", "CBN Circular — FX policy update", "FIRS — Tax filing deadline"].map(
                      (item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-md bg-platinum border border-border px-3 py-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-gold" />
                          <span className="text-xs text-steel">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Regulatory Bodies Strip ─── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-xs uppercase tracking-widest text-white/30 mb-6">
            Monitoring 20+ Nigerian Regulatory Bodies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {regulatoryBodies.map((body) => (
              <span
                key={body}
                className="text-sm font-semibold text-white/20 hover:text-gold/60 transition-colors tracking-wider"
              >
                {body}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="container mx-auto px-6 py-20 lg:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
            Everything You Need to{" "}
            <span className="text-gold">Stay Compliant</span>
          </h2>
          <p className="text-white/50 font-body">
            Purpose-built tools for the Nigerian legal landscape, powered by AI
            that understands local regulations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="bg-white/[0.03] border-white/10 hover:border-gold/30 transition-all duration-300 group"
            >
              <CardContent className="p-6 space-y-4">
                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="font-heading text-lg text-white">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-body">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <h2 className="font-heading text-3xl md:text-4xl text-white text-center mb-16">
            Trusted by <span className="text-gold">Legal Professionals</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-4"
              >
                <p className="text-white/60 text-sm leading-relaxed italic font-body">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="bg-white">
        <div className="container mx-auto px-6 py-20 lg:py-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl text-ink mb-4">
              Simple, <span className="text-gold">Transparent Pricing</span>
            </h2>
            <p className="text-steel font-body">
              Start free for 14 days. No credit card required.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden ${
                  plan.highlighted
                    ? "border-gold/50 bg-gold/5 shadow-[0_0_40px_-12px_hsl(43,78%,46%,0.15)]"
                    : "border-border bg-white"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
                )}
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="font-heading text-xl text-ink">{plan.name}</h3>
                    <p className="text-xs text-steel mt-1 font-body">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-ink">{plan.price}</span>
                    <span className="text-steel text-sm">{plan.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-steel">
                        <Check className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block">
                    <Button
                      className={`w-full ${
                        plan.highlighted
                          ? "bg-gold text-ink hover:bg-gold/90 font-semibold"
                          : "bg-ink text-white hover:bg-ink/90"
                      }`}
                    >
                      {plan.cta}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="bg-ink">
        <div className="container mx-auto px-6 py-20">
          <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent p-10 md:p-16 text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-4">
              Ready to Transform Your Legal Practice?
            </h2>
            <p className="text-white/50 max-w-lg mx-auto mb-8 font-body">
              Join hundreds of Nigerian legal professionals already using LitigeAI
              to stay ahead of regulatory changes.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gold text-ink hover:bg-gold/90 font-semibold text-base px-10 h-12"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <span className="font-heading text-xl text-gold">LitigeAI</span>
              <p className="text-xs text-white/40 leading-relaxed font-body">
                AI-powered legal compliance platform built for Nigerian and
                African legal professionals.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Regulatory Feed", "Contract Auditor", "Document Vault", "Trial Prep"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Data Processing"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-sm font-semibold text-white/70 mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <span className="text-xs text-white/30 hover:text-gold cursor-pointer transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              © {new Date().getFullYear()} LitigeAI. All rights reserved.
            </p>
            <p className="text-xs text-white/20">Built in Lagos 🇳🇬</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
