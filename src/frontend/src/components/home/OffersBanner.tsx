import { Skeleton } from "@/components/ui/skeleton";
import { Tag, X } from "lucide-react";
import React, { useState } from "react";
import { useActiveCoupons } from "../../hooks/useQueries";

export function OffersBanner() {
  const { data: coupons, isLoading } = useActiveCoupons();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;
  if (isLoading) return <Skeleton className="h-14 w-full rounded-xl" />;

  const coupon = coupons?.[0];
  if (!coupon) return null;

  return (
    <div className="relative gradient-gold rounded-xl px-4 py-3 flex items-center gap-3 shadow-gold">
      <Tag className="w-5 h-5 text-charcoal-800 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-charcoal-900 font-semibold text-sm">
          🎉 Use code{" "}
          <span className="font-bold bg-charcoal-900/10 px-1.5 py-0.5 rounded">
            {coupon.code}
          </span>{" "}
          —{" "}
          {coupon.discountType === "percent"
            ? `${coupon.discountValue}% OFF`
            : `₹${coupon.discountValue} OFF`}
        </p>
        <p className="text-charcoal-700 text-xs">
          Min. cart ₹{coupon.minCartValue} · Expires {coupon.expiryDate}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="text-charcoal-700 hover:text-charcoal-900 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
