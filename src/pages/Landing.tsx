import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Hero Section */}
      <header className="flex items-center justify-between px-8 py-4">
        <span className="font-heading text-2xl text-gold">LitigeAI</span>
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-gold">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold">
              Start Free Trial
            </Button>
          </Link>
        </div>
      </header>

      <section className="container mx-auto flex flex-col lg:flex-row items-center gap-12 px-8 py-20">
        <div className="flex-1 space-y-6">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
            Nigeria's AI-Powered{" "}
            <span className="text-gold">Legal Compliance</span> Platform
          </h1>
          <p className="text-lg text-white/70 max-w-lg font-body">
            Real-time regulatory monitoring, contract auditing, and trial
            preparation — built for African legal professionals competing
            globally.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-gold text-ink hover:bg-gold/90 font-semibold text-base px-8"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-base px-8"
              >
                View Live Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Product preview placeholder */}
        <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-8 min-h-[350px] flex items-center justify-center">
          <p className="text-white/30 text-sm">Product Preview</p>
        </div>
      </section>
    </div>
  );
}
