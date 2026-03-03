import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { setMetaDescription, setPageTitle } from "../utils/seo";

export default function Terms() {
  useEffect(() => {
    setPageTitle("Terms & Conditions - Haircut.com");
    setMetaDescription(
      "Read the Terms & Conditions for using Haircut.com, India's premier salon booking platform.",
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
            Terms & <span className="text-gold">Conditions</span>
          </h1>
          <p className="text-muted-foreground">Last updated: February 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none space-y-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              1. Introduction
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Haircut.com, operated by Jikesh Kumar ("Founder", "we",
              "us", or "our"). By accessing or using our platform at
              haircut.com, you agree to be bound by these Terms & Conditions.
              Haircut.com is a salon discovery and appointment booking platform
              serving customers across India.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              2. Use of the Platform
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You must be at least 18 years of age to use Haircut.com. By using
              our platform, you represent that you meet this requirement. You
              agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Provide accurate and complete information when creating an
                account
              </li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Not use the platform for any unlawful or prohibited purpose
              </li>
              <li>
                Not attempt to disrupt or interfere with the platform's
                operation
              </li>
              <li>Respect the rights of salon owners and other users</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              3. Booking & Cancellation Policy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              When you book an appointment through Haircut.com:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Bookings are confirmed upon successful payment processing</li>
              <li>
                Cancellations made more than 2 hours before the appointment are
                eligible for a full refund
              </li>
              <li>
                Late cancellations (within 2 hours) may incur a cancellation fee
              </li>
              <li>No-shows may result in account restrictions</li>
              <li>
                Salon owners reserve the right to cancel appointments with prior
                notice
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              4. Payments & Stripe
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All payments on Haircut.com are processed securely through Stripe,
              a PCI-DSS Level 1 certified payment processor. By making a
              payment, you agree to Stripe's Terms of Service. Haircut.com does
              not store your payment card information. All transactions are in
              Indian Rupees (INR) unless otherwise specified. Refunds are
              processed within 5-7 business days to your original payment
              method.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              5. Salon Owner Obligations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Salon owners registered on Haircut.com agree to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Provide accurate information about services, pricing, and
                availability
              </li>
              <li>Honor confirmed bookings made through the platform</li>
              <li>Maintain professional standards of service</li>
              <li>Comply with all applicable Indian laws and regulations</li>
              <li>Pay the agreed commission on completed bookings</li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              6. Intellectual Property
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on Haircut.com, including logos, text, graphics, and
              software, is the property of Haircut.com and protected by Indian
              copyright laws. You may not reproduce, distribute, or create
              derivative works without our express written permission.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              7. Limitation of Liability
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Haircut.com acts as an intermediary platform connecting customers
              with salon service providers. We are not liable for the quality of
              services provided by salons, personal injury or property damage
              arising from salon visits, or any indirect, incidental, or
              consequential damages. Our total liability shall not exceed the
              amount paid for the specific booking in question.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              8. Dispute Resolution
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Any disputes arising from the use of Haircut.com shall be resolved
              through good-faith negotiation. If unresolved, disputes shall be
              subject to the exclusive jurisdiction of courts in Bihar, India.
              These Terms are governed by the laws of India.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-3">
              9. Contact
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at:
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
