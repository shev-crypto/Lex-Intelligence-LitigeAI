import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <Link to="/">
            <span className="font-heading text-xl text-gold">LitigeAI</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="text-white/70 hover:text-white gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="font-heading text-4xl text-gold mb-2">Terms of Service</h1>
        <p className="text-white/60 text-sm mb-10">Last updated: April 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold">1. Agreement</h2>
            <p>
              By accessing or using LitigeAI ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. These terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">2. Eligibility</h2>
            <p>
              The Platform is designed for Nigerian legal professionals. By registering, you confirm that you are a licensed legal practitioner, law firm, or authorised representative with a valid Nigerian Bar Association (NBA) enrolment, or an individual or entity requiring legal compliance services.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">3. Services</h2>
            <p>LitigeAI provides AI-powered legal compliance tools including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Regulatory Feed:</strong> Real-time regulatory alerts from Nigerian regulatory bodies.</li>
              <li><strong>Contract Auditor:</strong> AI-driven clause analysis and risk scoring.</li>
              <li><strong>Document Vault:</strong> Centralised matter and document management.</li>
              <li><strong>Trial Prep Studio:</strong> Case analysis and preparation tools.</li>
              <li><strong>Compliance Calendar:</strong> Filing deadline tracking and reminders.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">4. Disclaimer</h2>
            <p>
              <strong>LitigeAI is a legal technology tool, not a law firm.</strong> The Platform does not provide legal advice. All AI-generated analyses, risk scores, and recommendations are for informational purposes only and should be independently verified by a qualified legal professional. We do not guarantee the accuracy, completeness, or timeliness of any information provided.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">5. Subscriptions & Payment</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Subscription plans are billed monthly or annually in Nigerian Naira (₦).</li>
              <li>Payments are processed through Paystack and Flutterwave.</li>
              <li>A 14-day free trial is offered on Solo and Chambers plans.</li>
              <li>You may cancel anytime; access continues until the current billing period ends.</li>
              <li>Refunds are not provided for partial billing periods.</li>
              <li>We reserve the right to change pricing with 30 days' written notice.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Platform are owned by LitigeAI and protected by Nigerian copyright law (Copyright Act 2022) and international intellectual property treaties. You retain ownership of all documents and data you upload.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">7. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use the Platform for unlawful purposes.</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code.</li>
              <li>Share your account credentials with unauthorised persons.</li>
              <li>Upload malicious files or content.</li>
              <li>Circumvent usage limits or security measures.</li>
              <li>Use the Platform to provide legal advice to third parties without proper licensing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Nigerian law, LitigeAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid for the service in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">9. Dispute Resolution</h2>
            <p>
              Any dispute arising from these Terms shall first be resolved through mediation. If mediation fails, disputes shall be referred to arbitration in Lagos, Nigeria, under the Arbitration and Mediation Act 2023. The language of arbitration shall be English.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Federal Republic of Nigeria. The courts of Lagos State shall have non-exclusive jurisdiction over any proceedings arising from these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">11. Contact</h2>
            <p>
              For questions about these Terms, contact us at <a href="mailto:legal@litigeai.com" className="text-gold hover:underline">legal@litigeai.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
