import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Calendar, Scissors, Star, Users } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { CategoryTiles } from "../components/home/CategoryTiles";
import { FeaturedSalonsCarousel } from "../components/home/FeaturedSalonsCarousel";
import { OffersBanner } from "../components/home/OffersBanner";
import { SearchBar } from "../components/home/SearchBar";
import { TrendingFeed } from "../components/home/TrendingFeed";
import { useApp } from "../contexts/AppContext";
import {
  injectJsonLd,
  setMetaDescription,
  setOpenGraphTags,
  setPageTitle,
} from "../utils/seo";

export function Home() {
  const { t } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Haircut.com - Discover & Book Salons in India");
    setMetaDescription(
      "Find and book appointments at top-rated salons across India. Compare prices, read reviews, and get exclusive deals.",
    );
    setOpenGraphTags(
      "Haircut.com - Discover & Book Salons in India",
      "Find and book appointments at top-rated salons across India. Compare prices, read reviews, and get exclusive deals.",
      "/assets/generated/hero-banner.dim_1440x500.png",
    );
    injectJsonLd({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Haircut.com",
      founder: { "@type": "Person", name: "Jikesh Kumar" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Dubauli Dularpur, Bhojpur",
        addressRegion: "Bihar",
        postalCode: "802206",
        addressCountry: "IN",
      },
      telephone: "+91-9693567545",
      email: "hello@haircut.com",
      url: "https://haircut.com",
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[420px] md:h-[500px] overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1440x500.png"
          alt="Premium Salon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/40 to-charcoal-900/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Scissors className="w-6 h-6 text-gold-400" />
              <span className="text-gold-400 font-semibold text-sm tracking-widest uppercase">
                Premium Grooming
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white leading-tight">
              Your Perfect Look,
              <br />
              <span className="text-gold-400">One Tap Away</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto">
              Book top-rated salons & parlours near you. Instant confirmation,
              transparent pricing.
            </p>
            <div className="pt-2">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-10">
        <OffersBanner />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Users, value: "50K+", label: "Happy Customers" },
            { icon: Scissors, value: "2K+", label: "Salons Listed" },
            { icon: Star, value: "4.8", label: "Avg Rating" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-2xl bg-card border border-border"
            >
              <stat.icon className="w-6 h-6 text-gold-500 mx-auto mb-1" />
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {t("categories")}
            </h2>
          </div>
          <CategoryTiles />
        </section>

        {/* Featured Salons */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {t("featuredSalons")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/search" })}
              className="text-gold-500 gap-1"
            >
              {t("viewAll")} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <FeaturedSalonsCarousel />
        </section>

        {/* Trending Posts */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">
              {t("trendingPosts")}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/feed" })}
              className="text-gold-500 gap-1"
            >
              {t("viewAll")} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <TrendingFeed />
        </section>

        {/* CTA Banner */}
        <section className="gradient-charcoal rounded-3xl p-8 text-center space-y-4">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white">
            Own a Salon?{" "}
            <span className="text-gold-400">List it for Free!</span>
          </h2>
          <p className="text-white/70 max-w-md mx-auto">
            Join thousands of salon owners growing their business on Haircut.com
          </p>
          <Button
            onClick={() => navigate({ to: "/owner/register" })}
            className="btn-gold px-8 py-3 rounded-xl text-base font-semibold gap-2"
          >
            <Calendar className="w-4 h-4" />
            Register Your Salon
          </Button>
        </section>
      </div>
    </div>
  );
}
