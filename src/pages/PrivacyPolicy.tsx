import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
        <h1 className="font-heading text-4xl text-gold mb-2">Privacy Policy</h1>
        <p className="text-white/60 text-sm mb-10">Last updated: April 15, 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/80 leading-relaxed">
          <section>
            <h2 className="text-white text-lg font-semibold">1. Introduction</h2>
            <p>
              LitigeAI ("we", "our", "us") is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, in compliance with the Nigeria Data Protection Act 2023 (NDPA), the Nigeria Data Protection Regulation 2019 (NDPR), and other applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">2. Data Controller</h2>
            <p>
              LitigeAI is the data controller for personal data processed through this platform. For enquiries, contact our Data Protection Officer at <a href="mailto:dpo@litigeai.com" className="text-gold hover:underline">dpo@litigeai.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">3. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, firm name, bar number, practice area.</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, session duration, device information.</li>
              <li><strong>Documents:</strong> Contracts, legal documents, and case files you upload for analysis.</li>
              <li><strong>Payment Information:</strong> Processed securely through Paystack and Flutterwave — we do not store card details.</li>
              <li><strong>Communications:</strong> Messages, feedback, and support enquiries.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">4. Legal Basis for Processing</h2>
            <p>We process your data based on:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Consent:</strong> When you create an account and agree to these terms.</li>
              <li><strong>Contractual necessity:</strong> To provide the services you subscribe to.</li>
              <li><strong>Legitimate interest:</strong> To improve our platform and detect fraud.</li>
              <li><strong>Legal obligation:</strong> To comply with Nigerian law and regulatory requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">5. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide and maintain our AI legal compliance services.</li>
              <li>Process contract audits, trial preparation, and regulatory monitoring.</li>
              <li>Send regulatory alerts and compliance deadline reminders.</li>
              <li>Process payments and manage subscriptions.</li>
              <li>Improve our AI models and user experience (using anonymised data only).</li>
              <li>Comply with legal obligations under Nigerian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active. Upon account deletion, your data will be permanently removed within 30 days, except where retention is required by law (e.g., financial records under CAMA 2020 or tax records under FIRS regulations).
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">7. Data Sharing</h2>
            <p>We do not sell your personal data. We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Payment processors:</strong> Paystack and Flutterwave for transaction processing.</li>
              <li><strong>Cloud infrastructure:</strong> Hosted on secure, encrypted servers.</li>
              <li><strong>Legal authorities:</strong> When required by Nigerian law or court order.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">8. Your Rights (NDPA 2023)</h2>
            <p>Under the Nigeria Data Protection Act 2023, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access your personal data.</li>
              <li>Rectify inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to data processing.</li>
              <li>Data portability.</li>
              <li>Withdraw consent at any time.</li>
              <li>Lodge a complaint with the Nigeria Data Protection Commission (NDPC).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">9. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your data, including encryption at rest and in transit, access controls, and regular security audits in compliance with NDPA 2023 requirements.
            </p>
          </section>

          <section>
            <h2 className="text-white text-lg font-semibold">10. Contact</h2>
            <p>
              For privacy-related enquiries, contact us at <a href="mailto:privacy@litigeai.com" className="text-gold hover:underline">privacy@litigeai.com</a> or write to our Data Protection Officer.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
