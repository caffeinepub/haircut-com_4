import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { setMetaDescription, setPageTitle } from "../utils/seo";

export default function Privacy() {
  useEffect(() => {
    setPageTitle("Privacy Policy - Haircut.com");
    setMetaDescription(
      "Learn how Haircut.com collects, uses, and protects your personal information.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
            Legal
          </Badge>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Privacy <span className="text-gold">Policy</span>
          </h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Haircut.com, founded by Jikesh Kumar, is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              platform. By using Haircut.com, you consent to the practices
              described in this policy. This policy is governed by the
              Information Technology Act, 2000 and applicable Indian data
              protection laws.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Information We Collect
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We collect the following types of information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>
                <strong className="text-foreground">
                  Account Information:
                </strong>{" "}
                Name, email address, phone number when you create a profile
              </li>
              <li>
                <strong className="text-foreground">Booking Data:</strong>{" "}
                Appointment details, service preferences, salon visits history
              </li>
              <li>
                <strong className="text-foreground">
                  Payment Information:
                </strong>{" "}
                Transaction records (payment details are handled by Stripe and
                not stored by us)
              </li>
              <li>
                <strong className="text-foreground">Usage Data:</strong> Pages
                visited, search queries, interaction patterns on our platform
              </li>
              <li>
                <strong className="text-foreground">Device Information:</strong>{" "}
                IP address, browser type, operating system
              </li>
              <li>
                <strong className="text-foreground">Communications:</strong>{" "}
                Messages sent through our contact form or support channels
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>To process and manage your salon bookings</li>
              <li>To send booking confirmations and reminders</li>
              <li>To improve our platform and personalize your experience</li>
              <li>To process payments through Stripe</li>
              <li>To communicate important updates about our services</li>
              <li>To prevent fraud and ensure platform security</li>
              <li>To comply with legal obligations under Indian law</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Payment Data & Stripe
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All payment processing is handled by Stripe, Inc. When you make a
              payment, you are subject to Stripe's Privacy Policy in addition to
              ours. Haircut.com does not store your credit card numbers, CVV
              codes, or other sensitive payment credentials. We only retain
              transaction records (amount, date, booking reference) for
              accounting and dispute resolution purposes.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. Cookies & Tracking
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to enhance your
              experience on Haircut.com. These include session cookies
              (essential for platform functionality), preference cookies (to
              remember your settings), and analytics cookies (to understand
              usage patterns). You can control cookie settings through your
              browser preferences, though disabling certain cookies may affect
              platform functionality.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. Data Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Salon owners (only booking-relevant information)</li>
              <li>Stripe (for payment processing)</li>
              <li>Law enforcement (when required by Indian law)</li>
              <li>
                Service providers who assist in platform operations under strict
                confidentiality agreements
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              7. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Under applicable Indian data protection laws, you have the right
              to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for data processing</li>
              <li>Lodge a complaint with relevant authorities</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              8. Data Security
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement industry-standard security measures including
              encryption, secure HTTPS connections, and regular security audits
              to protect your data. However, no method of transmission over the
              internet is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              9. Jurisdiction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              This Privacy Policy is governed by the laws of India. Any disputes
              related to privacy shall be subject to the exclusive jurisdiction
              of courts in Bihar, India.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              10. Contact Us
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For privacy-related queries or to exercise your rights, contact:
              <br />
              <strong className="text-foreground">Jikesh Kumar</strong>, Founder
              & CEO
              <br />
              Dubauli Dularpur, Bhojpur, Bihar, India – 802206
              <br />
              Email:{" "}
              <a
                href="mailto:hello@haircut.com"
                className="text-gold hover:underline"
              >
                hello@haircut.com
              </a>
              <br />
              Phone:{" "}
              <a href="tel:+919693567545" className="text-gold hover:underline">
                +91 9693567545
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
