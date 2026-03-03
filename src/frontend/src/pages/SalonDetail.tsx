import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  Scissors,
  Star,
  Users,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { useSalonDetail, useSalonReviews } from "../hooks/useQueries";
import {
  injectJsonLd,
  setMetaDescription,
  setOpenGraphTags,
  setPageTitle,
} from "../utils/seo";

export function SalonDetail() {
  const { salonId } = useParams({ from: "/salon/$salonId" });
  const navigate = useNavigate();
  const { data: salon, isLoading } = useSalonDetail(salonId);
  const { data: reviews } = useSalonReviews(salonId);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    if (salon) {
      setPageTitle(`${salon.name} - Haircut.com`);
      setMetaDescription(
        salon.description ||
          `Book appointments at ${salon.name} in ${salon.city}. ${salon.category} salon with ${salon.reviewCount} reviews.`,
      );
      setOpenGraphTags(
        `${salon.name} - Haircut.com`,
        salon.description ||
          `Book appointments at ${salon.name} in ${salon.city}.`,
        salon.photos?.[0],
      );
      injectJsonLd({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: salon.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: salon.address,
          addressLocality: salon.city,
          postalCode: salon.pincode,
          addressCountry: "IN",
        },
        telephone: salon.phone,
        aggregateRating:
          salon.reviewCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: salon.rating,
                reviewCount: salon.reviewCount,
              }
            : undefined,
      });
    }
  }, [salon]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <SkeletonLoader variant="image" className="h-72 w-full" />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Salon not found.</p>
        <Button onClick={() => navigate({ to: "/search" })} className="mt-4">
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Photo Gallery */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-charcoal-800">
        {salon.photos && salon.photos.length > 0 ? (
          <img
            src={salon.photos[photoIndex]}
            alt={salon.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Scissors className="w-16 h-16 text-muted-foreground opacity-30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {salon.photos && salon.photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setPhotoIndex(
                  (i) => (i - 1 + salon.photos.length) % salon.photos.length,
                )
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPhotoIndex((i) => (i + 1) % salon.photos.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {salon.photos.map((photo: string, i: number) => (
                <button
                  type="button"
                  key={photo || `photo-${i}`}
                  onClick={() => setPhotoIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    i === photoIndex ? "bg-white w-4" : "bg-white/50",
                  )}
                />
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={() => navigate({ to: "/search" })}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">
                {salon.name}
              </h1>
              <Badge
                className={cn(
                  "text-xs",
                  salon.isOpen
                    ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30"
                    : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
                )}
              >
                {salon.isOpen ? "● Open Now" : "● Closed"}
              </Badge>
            </div>
            <Badge variant="outline" className="text-xs">
              {salon.category}
            </Badge>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 justify-end">
              <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
              <span className="font-bold text-foreground">{salon.rating}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {salon.reviewCount} reviews
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold-500" />
            <span>
              {salon.address}, {salon.city} - {salon.pincode}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4 flex-shrink-0 text-gold-500" />
            <span>{salon.phone}</span>
          </div>
          {salon.description && (
            <p className="text-muted-foreground pt-1">{salon.description}</p>
          )}
        </div>

        {/* Working Hours */}
        {salon.workingHours && salon.workingHours.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold-500" /> Working Hours
            </h2>
            <div className="grid grid-cols-2 gap-1.5">
              {salon.workingHours.map((wh: any) => (
                <div
                  key={wh.day}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground w-24">
                    {wh.day.slice(0, 3)}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      wh.isOpen ? "text-foreground" : "text-red-500",
                    )}
                  >
                    {wh.isOpen ? `${wh.openTime} – ${wh.closeTime}` : "Closed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        {salon.services && salon.services.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gold-500" /> Services & Pricing
            </h2>
            <div className="space-y-2">
              {salon.services.map((service: any) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {service.name}
                    </p>
                    {service.description && (
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {service.duration} min
                    </p>
                  </div>
                  <span className="font-bold text-gold-600 dark:text-gold-400">
                    ₹{service.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff */}
        {salon.staff && salon.staff.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-500" /> Our Team
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {salon.staff.map((member: any) => (
                <div key={member.id} className="flex-shrink-0 text-center w-20">
                  <div className="w-14 h-14 rounded-full bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center mx-auto mb-1.5 text-xl font-bold text-gold-600">
                    {member.name.charAt(0)}
                  </div>
                  <p className="text-xs font-medium text-foreground line-clamp-1">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        {reviews && reviews.length > 0 && (
          <div>
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" /> Reviews
            </h2>
            <div className="space-y-3">
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-foreground">
                      {review.customerName}
                    </p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, n) => n).map((n) => (
                        <Star
                          key={n}
                          className={cn(
                            "w-3.5 h-3.5",
                            n < review.rating
                              ? "fill-gold-500 text-gold-500"
                              : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border md:relative md:bg-transparent md:border-0 md:p-0 md:px-6 md:pb-6">
        <Button
          onClick={() =>
            navigate({ to: "/booking/$salonId", params: { salonId: salon.id } })
          }
          className="btn-gold w-full py-3 rounded-xl text-base font-semibold"
        >
          Book Appointment
        </Button>
      </div>
    </div>
  );
}
