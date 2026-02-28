import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe, Zap, Heart } from 'lucide-react';
import { setPageTitle, setMetaDescription } from '../utils/seo';

export default function Vision() {
  useEffect(() => {
    setPageTitle('Our Vision - Haircut.com');
    setMetaDescription('Discover Haircut.com\'s vision to become India\'s leading salon booking platform, founded by Jikesh Kumar.');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">Our Vision</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            The Future We're <span className="text-gold">Building</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            A world where every Indian has access to quality grooming services, and every salon owner has the tools to thrive.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Vision Statement */}
        <div className="bg-gradient-to-r from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-8 mb-16 text-center">
          <Eye className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision Statement</h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto italic">
            "To become India's most trusted salon booking platform — where technology meets tradition, and every haircut tells a story of quality, convenience, and community."
          </p>
          <p className="text-gold mt-4 font-medium">— Jikesh Kumar, Founder & CEO</p>
        </div>

        {/* Pillars */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Vision <span className="text-gold">Pillars</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Globe,
                title: 'Pan-India Reach',
                desc: 'From metros to tier-3 cities, we envision Haircut.com serving every corner of India. Our goal is to list 50,000+ salons across 500+ cities by 2028, making quality grooming accessible everywhere.',
              },
              {
                icon: Zap,
                title: 'Technology Innovation',
                desc: 'We\'re building AI-powered style recommendations, AR try-on features, and predictive booking systems that will redefine how Indians interact with beauty services.',
              },
              {
                icon: Heart,
                title: 'Community Impact',
                desc: 'Beyond bookings, we aim to create a thriving ecosystem where salon owners can grow their businesses, share knowledge, and build lasting customer relationships.',
              },
              {
                icon: Eye,
                title: 'Transparency First',
                desc: 'Our vision includes a future where every customer can make informed decisions based on verified reviews, transparent pricing, and real-time availability — no surprises.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our <span className="text-gold">Roadmap</span></h2>
          <div className="space-y-4">
            {[
              { year: '2024', milestone: 'Launch', desc: 'Platform launch in Bihar with 50+ salons. Core booking and payment features.' },
              { year: '2025', milestone: 'Expansion', desc: 'Expand to 10 major Indian cities. Launch Prime Membership and referral program.' },
              { year: '2026', milestone: 'Scale', desc: 'Reach 500+ salons, 25+ cities. Launch AI recommendations and AR features.' },
              { year: '2028', milestone: 'Leadership', desc: 'Become India\'s #1 salon booking platform with 50,000+ salons nationwide.' },
            ].map(({ year, milestone, desc }, i) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-charcoal font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < 3 && <div className="w-0.5 h-full bg-gold/30 mt-2" />}
                </div>
                <div className="bg-card border border-border rounded-xl p-4 flex-1 mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gold font-bold">{year}</span>
                    <Badge className="bg-gold/20 text-gold border-gold/30 text-xs">{milestone}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
