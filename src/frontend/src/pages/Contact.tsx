import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSubmitContactMessage } from "../hooks/useQueries";
import { setMetaDescription, setPageTitle } from "../utils/seo";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const submitContact = useSubmitContactMessage();

  useEffect(() => {
    setPageTitle("Contact Us - Haircut.com");
    setMetaDescription(
      "Get in touch with the Haircut.com team. We're here to help!",
    );
  }, []);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email address";
    if (!message.trim()) newErrors.message = "Message is required";
    else if (message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await submitContact.mutateAsync({ name, email, message });
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-charcoal to-charcoal-light py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-gold/20 text-gold border-gold/30">
            Get In Touch
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Our Contact Details
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Jikesh Kumar
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Founder & CEO, Haircut.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Address</p>
                    <p className="text-muted-foreground text-sm">
                      Dubauli Dularpur, Bhojpur,
                      <br />
                      Bihar, India – 802206
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <a
                      href="tel:+919693567545"
                      className="text-gold hover:underline text-sm"
                    >
                      +91 9693567545
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <a
                      href="mailto:hello@haircut.com"
                      className="text-gold hover:underline text-sm"
                    >
                      hello@haircut.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Send Us a Message
                </h2>
                <div>
                  <Label
                    htmlFor="name"
                    className="text-foreground mb-1.5 block"
                  >
                    Your Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-foreground mb-1.5 block"
                  >
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="message"
                    className="text-foreground mb-1.5 block"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how we can help..."
                    rows={5}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-destructive text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal font-semibold"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
