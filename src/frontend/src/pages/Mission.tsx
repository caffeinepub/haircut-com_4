import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target } from "lucide-react";
import { useEffect } from "react";
import { setMetaDescription, setPageTitle } from "../utils/seo";

export default function Mission() {
  useEffect(() => {
    setPageTitle("Our Mission - Haircut.com");
    setMetaDescription(
      "Haircut.com's mission to connect customers with quality salons across India and empower salon owners.",
    );
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
            Our Mission
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why We <span className="text-gold">Exist</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Connecting customers with quality salons across India while
            empowering salon owners with the tools they need to succeed.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-8 mb-16 text-center">
          <Target className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Our Mission Statement
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            To democratize access to quality grooming services across India by
            building a transparent, reliable, and empowering platform that
            connects customers with skilled salon professionals.
          </p>
        </div>

        {/* For Customers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              For <span className="text-gold">Customers</span>
            </h2>
            <div className="space-y-4">
              {[
                "Discover verified salons with transparent pricing and real reviews",
                "Book appointments instantly without phone calls or uncertainty",
                "Access exclusive deals and Prime membership benefits",
                "Compare services across multiple salons in your area",
                "Enjoy a seamless, secure payment experience",
                "Build a grooming history and get personalized recommendations",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              For <span className="text-gold">Salon Owners</span>
            </h2>
            <div className="space-y-4">
              {[
                "Reach thousands of potential customers in your city",
                "Manage bookings, schedules, and staff from one dashboard",
                "Receive secure, timely payouts for completed services",
                "Build your online reputation through verified reviews",
                "Create promotions and coupons to attract new customers",
                "Access analytics to understand and grow your business",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitment */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Our <span className="text-gold">Commitments</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Quality Assurance",
                desc: "Every salon on our platform is verified and reviewed. We maintain strict quality standards to ensure you always get the best experience.",
              },
              {
                title: "Fair Economics",
                desc: "We charge fair commissions that allow salon owners to thrive while keeping prices competitive for customers. No hidden fees, ever.",
              },
              {
                title: "India First",
                desc: "Built in India, for India. We understand the unique needs of Indian customers and salon owners, and our platform reflects that deeply.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gold mb-3">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
