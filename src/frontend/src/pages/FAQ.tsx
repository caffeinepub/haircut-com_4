import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useListFAQs } from '../hooks/useQueries';
import { setPageTitle, setMetaDescription } from '../utils/seo';

interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  category: string;
  order?: number;
}

const STATIC_FAQS: FAQEntry[] = [
  { id: 'b1', question: 'How do I book an appointment?', answer: 'Browse salons on our platform, select your preferred salon, choose a service and time slot, then confirm your booking. You\'ll receive a confirmation notification instantly.', category: 'Bookings' },
  { id: 'b2', question: 'Can I cancel or reschedule my booking?', answer: 'Yes, you can cancel or reschedule up to 2 hours before your appointment from the "My Bookings" section. Cancellations within 2 hours may incur a fee.', category: 'Bookings' },
  { id: 'b3', question: 'What happens if the salon cancels my appointment?', answer: 'If a salon cancels your appointment, you\'ll receive a full refund within 3-5 business days and a notification to rebook at your convenience.', category: 'Bookings' },
  { id: 'p1', question: 'What payment methods are accepted?', answer: 'We accept all major credit and debit cards through our secure Stripe payment gateway. UPI and net banking support is coming soon.', category: 'Payments' },
  { id: 'p2', question: 'Is my payment information secure?', answer: 'Absolutely. All payments are processed through Stripe, a PCI-DSS compliant payment processor. We never store your card details on our servers.', category: 'Payments' },
  { id: 'p3', question: 'When will I be charged?', answer: 'Payment is collected at the time of booking confirmation. For walk-in bookings, payment is processed after the service is completed.', category: 'Payments' },
  { id: 's1', question: 'How do I register my salon on Haircut.com?', answer: 'Click "Register Your Salon" from the navigation menu, fill in your salon details, services, pricing, and upload required documents. Our team will review and approve within 24-48 hours.', category: 'Salon Owners' },
  { id: 's2', question: 'What commission does Haircut.com charge?', answer: 'We charge a competitive commission on each completed booking. The exact rate depends on your salon category and location. Contact us for detailed pricing.', category: 'Salon Owners' },
  { id: 's3', question: 'How do I receive payouts?', answer: 'Payouts are processed weekly to your registered bank account. You can also request an early payout from your dashboard.', category: 'Salon Owners' },
  { id: 'a1', question: 'How do I create an account?', answer: 'Click "Login" and authenticate using Internet Identity. Your account is created automatically on first login.', category: 'Account' },
  { id: 'a2', question: 'What is Prime Membership?', answer: 'Prime Membership gives you exclusive discounts on all bookings, priority slot access, and special offers from partner salons. Subscribe from your profile page.', category: 'Account' },
  { id: 'a3', question: 'How does the referral program work?', answer: 'Share your unique referral code with friends. When they make their first booking, both you and your friend receive reward credits.', category: 'Account' },
];

const CATEGORIES = ['Bookings', 'Payments', 'Salon Owners', 'Account'];

export default function FAQ() {
  const { data: faqs, isLoading } = useListFAQs();

  useEffect(() => {
    setPageTitle('FAQ - Haircut.com');
    setMetaDescription('Find answers to common questions about booking salons, payments, and more on Haircut.com.');
  }, []);

  const displayFaqs: FAQEntry[] = (faqs && faqs.length > 0) ? faqs : STATIC_FAQS;

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = displayFaqs.filter((f: FAQEntry) => f.category === cat);
    return acc;
  }, {} as Record<string, FAQEntry[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">Help Center</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Haircut.com
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-border rounded-xl p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {CATEGORIES.map((category) => {
              const items = grouped[category] || [];
              if (items.length === 0) return null;
              return (
                <div key={category}>
                  <h2 className="text-xl font-semibold text-gold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold inline-block" />
                    {category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-2">
                    {items.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="border border-border rounded-xl px-4 bg-card"
                      >
                        <AccordionTrigger className="text-foreground hover:text-gold text-left py-4">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
