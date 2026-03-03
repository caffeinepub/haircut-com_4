import { Badge } from "@/components/ui/badge";
import { Scissors, Star, TrendingUp, Users } from "lucide-react";
import { useEffect } from "react";
import { setMetaDescription, setPageTitle } from "../utils/seo";

export default function About() {
  useEffect(() => {
    setPageTitle("About Us - Haircut.com");
    setMetaDescription(
      "Learn about Haircut.com, India's premier salon booking platform founded by Jikesh Kumar.",
    );
  }, []);

  const stats = [
    { icon: Scissors, label: "Salons Listed", value: "500+" },
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: TrendingUp, label: "Cities Covered", value: "25+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-gold">Haircut.com</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Revolutionizing salon discovery and booking across India, one
            appointment at a time.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl p-6 text-center"
            >
              <Icon className="w-8 h-8 text-gold mx-auto mb-3" />
              <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
              <p className="text-muted-foreground text-sm">{label}</p>
            </div>
          ))}
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our <span className="text-gold">Story</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Haircut.com was born from a simple frustration: finding a good
              salon in India shouldn't be this hard. Founder Jikesh Kumar
              experienced firsthand the challenges of discovering quality
              salons, comparing prices, and booking appointments without the
              hassle of phone calls and uncertainty.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In 2024, Jikesh set out to build a platform that would transform
              how Indians discover and book salon services. Starting from Bihar,
              Haircut.com has grown to serve customers across 25+ cities,
              connecting them with hundreds of verified salons.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, Haircut.com is more than just a booking platform — it's a
              community that empowers local salon owners with digital tools
              while giving customers the transparency and convenience they
              deserve.
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                <span className="text-2xl font-bold text-gold">JK</span>
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">
                  Jikesh Kumar
                </p>
                <p className="text-muted-foreground text-sm">Founder & CEO</p>
              </div>
            </div>
            <blockquote className="text-muted-foreground italic leading-relaxed border-l-4 border-gold pl-4">
              "My vision is to make quality grooming accessible to every Indian,
              while helping local salon owners thrive in the digital age.
              Haircut.com is our commitment to that vision."
            </blockquote>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Our <span className="text-gold">Values</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Transparency",
                desc: "Clear pricing, honest reviews, and no hidden fees. What you see is what you get.",
              },
              {
                title: "Empowerment",
                desc: "We give salon owners the digital tools they need to grow their business and reach more customers.",
              },
              {
                title: "Community",
                desc: "We're building a community of beauty professionals and customers who support each other.",
              },
            ].map(({ title, desc }) => (
              <div
                key={title}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gold mb-2">
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
