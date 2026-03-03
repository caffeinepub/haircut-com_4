import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  Check,
  ChevronLeft,
  Clock,
  Loader2,
  Tag,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import type { ShoppingItem } from "../backend";
import {
  useAvailableSlots,
  useCreateBooking,
  useCreateCheckoutSession,
  useSalonDetail,
  useValidateCoupon,
} from "../hooks/useQueries";
import type { Service, Staff, TimeSlot } from "../types";

const STEPS = ["Services", "Date & Time", "Staff", "Summary", "Payment"];

export function BookingFlow() {
  const { salonId } = useParams({ from: "/booking/$salonId" });
  const navigate = useNavigate();
  const { data: salon, isLoading } = useSalonDetail(salonId);

  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);

  const dateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : undefined;
  const { data: slots, isLoading: slotsLoading } = useAvailableSlots(
    salonId,
    dateStr,
  );
  const validateCoupon = useValidateCoupon();
  const createCheckout = useCreateCheckoutSession();
  const createBooking = useCreateBooking();

  const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const finalTotal = Math.max(0, total - appliedDiscount);

  // Countdown timer
  useEffect(() => {
    if (!selectedSlot) {
      setCountdown(null);
      return;
    }
    setCountdown(600);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setSelectedSlot(null);
          toast.error("Slot reservation expired. Please select again.");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedSlot]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    try {
      const result = await validateCoupon.mutateAsync({
        code: couponCode,
        cartValue: total,
      });
      const discount = (result as any)?.discount ?? 0;
      setAppliedDiscount(discount);
      toast.success(`Coupon applied! ₹${discount} off`);
    } catch (err: unknown) {
      const e = err as Error;
      setCouponError(e.message || "Invalid coupon");
      setAppliedDiscount(0);
    }
  };

  const handlePayment = async () => {
    if (!salon) return;
    const items: ShoppingItem[] = selectedServices.map((s) => ({
      productName: s.name,
      currency: "inr",
      quantity: BigInt(1),
      priceInCents: BigInt(s.price * 100),
      productDescription: `${s.name} at ${salon.name}`,
    }));
    try {
      const session = await createCheckout.mutateAsync(items);
      if (!session?.url) throw new Error("Stripe session missing url");
      await createBooking.mutateAsync({
        salonId: salon.id,
        salonName: salon.name,
        services: selectedServices,
        staffId: selectedStaff?.id,
        staffName: selectedStaff?.name,
        date: dateStr || "",
        timeSlot: selectedSlot?.time || "",
        totalAmount: finalTotal,
        couponCode: appliedDiscount > 0 ? couponCode : undefined,
        discountAmount: appliedDiscount,
        paymentStatus: "Paid",
        customerId: "u1",
        customerName: "Demo User",
      });
      window.location.href = session.url;
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || "Payment failed. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!salon)
    return (
      <div className="text-center py-20 text-muted-foreground">
        Salon not found.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i < step
                    ? "bg-gold-500 text-charcoal-900"
                    : i === step
                      ? "bg-gold-500 text-charcoal-900 ring-4 ring-gold-500/30"
                      : "bg-muted text-muted-foreground",
                )}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 md:w-12 mx-1 transition-all",
                    i < step ? "bg-gold-500" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-foreground">
          {STEPS[step]}
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 min-h-[400px]">
        {/* Step 0: Services */}
        {step === 0 && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg text-foreground mb-4">
              Select Services
            </h2>
            {salon.services?.map((service: Service) => {
              const isSelected = selectedServices.some(
                (s) => s.id === service.id,
              );
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() =>
                    setSelectedServices((prev) =>
                      isSelected
                        ? prev.filter((s) => s.id !== service.id)
                        : [...prev, service],
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left",
                    isSelected
                      ? "border-gold-500 bg-gold-500/5"
                      : "border-border hover:border-gold-300",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                        isSelected
                          ? "border-gold-500 bg-gold-500"
                          : "border-muted-foreground",
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3 h-3 text-charcoal-900" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">
                        {service.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.duration} min
                        {service.description ? ` · ${service.description}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gold-600 dark:text-gold-400">
                    ₹{service.price}
                  </span>
                </button>
              );
            })}
            {selectedServices.length > 0 && (
              <div className="pt-2 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selectedServices.length} service(s) selected
                </span>
                <span className="font-bold text-foreground">₹{total}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">
              Select Date & Time
            </h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date()}
              className="rounded-xl border border-border mx-auto"
            />
            {selectedDate && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-3">
                  Available Slots
                </p>
                {slotsLoading ? (
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }, (_, n) => `sk-${n}`).map(
                      (key) => (
                        <Skeleton key={key} className="h-10 rounded-lg" />
                      ),
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {slots && slots.length > 0 ? (
                      slots.map((slot: TimeSlot) => (
                        <button
                          type="button"
                          key={slot.id}
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all",
                            !slot.isAvailable
                              ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                              : selectedSlot?.id === slot.id
                                ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400"
                                : "border-border hover:border-gold-300 text-foreground",
                          )}
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-muted-foreground text-sm py-4">
                        No slots available for this date.
                      </p>
                    )}
                  </div>
                )}
                {countdown !== null && (
                  <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-gold-500/10 border border-gold-500/30">
                    <Clock className="w-4 h-4 text-gold-600" />
                    <span className="text-sm font-medium text-gold-700 dark:text-gold-400">
                      Slot reserved for{" "}
                      <span className="font-bold">
                        {formatCountdown(countdown)}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Staff */}
        {step === 2 && (
          <div className="space-y-3">
            <h2 className="font-bold text-lg text-foreground">
              Select Staff (Optional)
            </h2>
            <button
              type="button"
              onClick={() => setSelectedStaff(null)}
              className={cn(
                "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                !selectedStaff
                  ? "border-gold-500 bg-gold-500/5"
                  : "border-border hover:border-gold-300",
              )}
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                🎲
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  No Preference
                </p>
                <p className="text-xs text-muted-foreground">
                  Any available staff member
                </p>
              </div>
            </button>
            {salon.staff?.map((member: Staff) => (
              <button
                type="button"
                key={member.id}
                onClick={() => setSelectedStaff(member)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                  selectedStaff?.id === member.id
                    ? "border-gold-500 bg-gold-500/5"
                    : "border-border hover:border-gold-300",
                )}
              >
                <div className="w-10 h-10 rounded-full bg-gold-100 dark:bg-gold-900/20 flex items-center justify-center font-bold text-gold-600">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">
              Booking Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salon</span>
                <span className="font-medium">{salon.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="font-medium">
                  {selectedDate?.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span className="font-medium">{selectedSlot?.time}</span>
              </div>
              {selectedStaff && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Staff</span>
                  <span className="font-medium">{selectedStaff.name}</span>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              {selectedServices.map((s) => (
                <div key={s.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{s.name}</span>
                  <span>₹{s.price}</span>
                </div>
              ))}
            </div>
            {/* Coupon */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={couponCode}
                    onChange={(e) =>
                      setCouponCode(e.target.value.toUpperCase())
                    }
                    placeholder="Coupon code"
                    className="pl-9 h-10 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || validateCoupon.isPending}
                  variant="outline"
                  className="h-10 rounded-xl"
                >
                  {validateCoupon.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
              {couponError && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {couponError}
                </p>
              )}
              {appliedDiscount > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  ✓ ₹{appliedDiscount} discount applied!
                </p>
              )}
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{total}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-₹{appliedDiscount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-gold-600 dark:text-gold-400">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto">
              <span className="text-3xl">💳</span>
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">
                Complete Payment
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                You'll be redirected to Stripe to complete your payment
                securely.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salon</span>
                <span className="font-medium">{salon.name}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-gold-600 dark:text-gold-400">
                  ₹{finalTotal}
                </span>
              </div>
            </div>
            <Button
              onClick={handlePayment}
              disabled={createCheckout.isPending || createBooking.isPending}
              className="btn-gold w-full py-3 rounded-xl text-base font-semibold gap-2"
            >
              {createCheckout.isPending || createBooking.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : null}
              Pay ₹{finalTotal} Securely
            </Button>
            <p className="text-xs text-muted-foreground">
              Powered by Stripe · 256-bit SSL encryption
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Button
          variant="outline"
          onClick={() =>
            step === 0
              ? navigate({ to: "/salon/$salonId", params: { salonId } })
              : setStep((s) => s - 1)
          }
          className="gap-2 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? "Back" : "Previous"}
        </Button>
        {step < STEPS.length - 1 && (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 && selectedServices.length === 0) ||
              (step === 1 && (!selectedDate || !selectedSlot))
            }
            className="btn-gold gap-2 rounded-xl flex-1"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
