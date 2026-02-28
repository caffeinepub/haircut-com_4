import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Code, Megaphone, HeadphonesIcon, BarChart3 } from 'lucide-react';
import { setPageTitle, setMetaDescription } from '../utils/seo';

const openings = [
  {
    icon: Code,
    title: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Remote / Bihar',
    desc: 'Build and scale our platform using modern web technologies. Experience with React, TypeScript, and distributed systems preferred.',
  },
  {
    icon: Megaphone,
    title: 'Digital Marketing Manager',
    type: 'Full-time',
    location: 'Bihar, India',
    desc: 'Drive growth through SEO, social media, and performance marketing. Experience in the beauty/lifestyle sector is a plus.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Customer Success Executive',
    type: 'Full-time',
    location: 'Bihar, India',
    desc: 'Help our customers and salon partners get the most out of Haircut.com. Excellent communication skills required.',
  },
  {
    icon: BarChart3,
    title: 'Business Development Executive',
    type: 'Full-time',
    location: 'Pan India',
    desc: 'Onboard new salons and expand our network across Indian cities. Strong sales and relationship-building skills needed.',
  },
];

export default function Career() {
  useEffect(() => {
    setPageTitle('Careers - Haircut.com');
    setMetaDescription('Join the Haircut.com team and help revolutionize salon booking in India. View open positions.');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">Join Our Team</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Build the Future of <span className="text-gold">Beauty</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Join Haircut.com and help us transform how India discovers and books salon services. We're a passionate team building something meaningful.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        {/* Culture */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Why <span className="text-gold">Haircut.com</span>?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Impactful Work', desc: 'Your work directly impacts thousands of salon owners and customers across India every day.' },
              { title: 'Growth Opportunities', desc: 'We\'re a fast-growing startup. Early team members grow with the company and take on leadership roles.' },
              { title: 'Flexible Culture', desc: 'We believe in results over hours. Work from anywhere in India with flexible schedules.' },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gold mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Open <span className="text-gold">Positions</span></h2>
          <div className="space-y-4">
            {openings.map(({ icon: Icon, title, type, location, desc }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                  <div className="flex gap-3 mb-2">
                    <Badge variant="outline" className="text-xs border-gold/30 text-gold">{type}</Badge>
                    <Badge variant="outline" className="text-xs">{location}</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{desc}</p>
                </div>
                <a href="mailto:hello@haircut.com?subject=Application: {title}">
                  <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold/10 flex-shrink-0">
                    Apply Now
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gold/20 to-gold/10 border border-gold/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Don't See Your Role?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented people. Send us your resume and tell us how you can contribute to Haircut.com's mission.
          </p>
          <a href="mailto:hello@haircut.com">
            <Button className="bg-gold hover:bg-gold-dark text-charcoal font-semibold">
              <Mail className="w-4 h-4 mr-2" />
              hello@haircut.com
            </Button>
          </a>
        </div>
      </section>
    </div>
  );
}
