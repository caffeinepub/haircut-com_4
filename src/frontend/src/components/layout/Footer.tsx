import { Link } from "@tanstack/react-router";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || "haircut-com");

  return (
    <footer className="bg-charcoal text-foreground border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-10">
        {/* Four-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Navigate */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary">Navigate</h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/", label: "Home" },
                { to: "/search", label: "Browse Salons" },
                { to: "/blog", label: "Blog" },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary">Company</h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/about", label: "About Us" },
                { to: "/career", label: "Career" },
                { to: "/vision", label: "Vision" },
                { to: "/mission", label: "Mission" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary">Legal</h3>
            <ul className="flex flex-col gap-2">
              {[
                { to: "/terms", label: "Terms of Service" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-primary">Contact Us</h3>
            <div className="flex flex-col gap-2">
              <p className="text-base font-bold text-foreground">
                Jikesh Kumar
              </p>
              <p className="text-sm text-foreground/70">Founder &amp; CEO</p>
              <div className="flex items-start gap-2 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Dubauli Dularpur, Bhojpur, Bihar, India – 802206</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="tel:+919693567545"
                  className="hover:text-primary transition-colors"
                >
                  +91 9693567545
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href="mailto:hello@haircut.com"
                  className="hover:text-primary transition-colors"
                >
                  hello@haircut.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-foreground/50">
            &copy; {year} Haircut.com. All rights reserved.
          </p>
          <p className="text-xs text-foreground/50 flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-primary fill-primary" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
