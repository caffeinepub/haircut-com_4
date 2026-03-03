import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRegisterSalon } from "../hooks/useQueries";
import type { SalonCategory, Service, WorkingHours } from "../types";

const STEPS = ["Shop Info", "Services", "Hours", "Bank Details", "Documents"];
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface BankDetailsForm {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

interface ShopInfoForm {
  name: string;
  category: SalonCategory;
  address: string;
  city: string;
  pincode: string;
  phone: string;
}

export function SalonOwnerRegistration() {
  const navigate = useNavigate();
  const registerSalon = useRegisterSalon();
  const [step, setStep] = useState(0);

  const [shopInfo, setShopInfo] = useState<ShopInfoForm>({
    name: "",
    category: "Men",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [services, setServices] = useState<
    Array<{ uid: string; name: string; price: string }>
  >([{ uid: "svc-0", name: "", price: "" }]);

  const [hours, setHours] = useState<WorkingHours[]>(
    DAYS.map((day) => ({
      day,
      isOpen: day !== "Sunday",
      openTime: "09:00",
      closeTime: "20:00",
    })),
  );

  const [bankDetails, setBankDetails] = useState<BankDetailsForm>({
    accountHolderName: "",
    accountNumber: "",
    routingNumber: "",
    bankName: "",
  });

  const addService = () =>
    setServices((prev) => [
      ...prev,
      { uid: `svc-${Date.now()}`, name: "", price: "" },
    ]);
  const removeService = (i: number) =>
    setServices((prev) => prev.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: "name" | "price", value: string) =>
    setServices((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );
  const updateHours = (
    i: number,
    field: keyof WorkingHours,
    value: string | boolean,
  ) =>
    setHours((prev) =>
      prev.map((h, idx) => (idx === i ? { ...h, [field]: value } : h)),
    );

  const canProceed = () => {
    if (step === 0)
      return (
        shopInfo.name &&
        shopInfo.address &&
        shopInfo.city &&
        shopInfo.pincode &&
        shopInfo.phone
      );
    if (step === 1) return services.some((s) => s.name.trim());
    return true;
  };

  const handleSubmit = async () => {
    try {
      const parsedServices: Service[] = services
        .filter((s) => s.name.trim())
        .map((s, i) => ({
          id: `sv-new-${i}`,
          name: s.name,
          price: Number(s.price) || 0,
          duration: 30,
        }));

      await registerSalon.mutateAsync({
        ...shopInfo,
        services: parsedServices,
        workingHours: hours,
        staff: [],
        photos: [],
        approvalStatus: "Pending",
        rating: 0,
        reviewCount: 0,
        priceRange:
          parsedServices.length > 0
            ? `₹${Math.min(...parsedServices.map((s) => s.price))} - ₹${Math.max(...parsedServices.map((s) => s.price))}`
            : "",
        isOpen: false,
        ownerName: "Owner",
        createdAt: new Date().toISOString(),
        bankDetails,
      });
      navigate({ to: "/owner/pending" });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Register Your Salon
      </h1>

      {/* Progress */}
      <div className="flex items-center justify-between mb-6">
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
                  "h-0.5 w-6 md:w-10 mx-1 transition-all",
                  i < step ? "bg-gold-500" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-sm font-semibold text-foreground mb-6">
        {STEPS[step]}
      </p>

      <div className="bg-card border border-border rounded-2xl p-5 min-h-[400px]">
        {/* Step 0: Shop Info */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">
              Shop Information
            </h2>
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-1.5 block">Shop Name *</Label>
                <Input
                  value={shopInfo.name}
                  onChange={(e) =>
                    setShopInfo((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="e.g. The Royal Barber"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Category *</Label>
                <Select
                  value={shopInfo.category}
                  onValueChange={(v) =>
                    setShopInfo((p) => ({ ...p, category: v as SalonCategory }))
                  }
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      ["Men", "Women", "Kids", "Unisex"] as SalonCategory[]
                    ).map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Address *</Label>
                <Input
                  value={shopInfo.address}
                  onChange={(e) =>
                    setShopInfo((p) => ({ ...p, address: e.target.value }))
                  }
                  placeholder="Street address"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm mb-1.5 block">City *</Label>
                  <Input
                    value={shopInfo.city}
                    onChange={(e) =>
                      setShopInfo((p) => ({ ...p, city: e.target.value }))
                    }
                    placeholder="City"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-sm mb-1.5 block">Pincode *</Label>
                  <Input
                    value={shopInfo.pincode}
                    onChange={(e) =>
                      setShopInfo((p) => ({ ...p, pincode: e.target.value }))
                    }
                    placeholder="110001"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Phone *</Label>
                <Input
                  value={shopInfo.phone}
                  onChange={(e) =>
                    setShopInfo((p) => ({ ...p, phone: e.target.value }))
                  }
                  placeholder="+91 98765 43210"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Services */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">
              Services & Pricing
            </h2>
            <div className="space-y-3">
              {services.map((service, i) => (
                <div key={service.uid} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs mb-1 block">Service Name</Label>
                    <Input
                      value={service.name}
                      onChange={(e) => updateService(i, "name", e.target.value)}
                      placeholder="e.g. Haircut"
                      className="rounded-xl h-9"
                    />
                  </div>
                  <div className="w-24">
                    <Label className="text-xs mb-1 block">Price (₹)</Label>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        updateService(i, "price", e.target.value)
                      }
                      placeholder="350"
                      className="rounded-xl h-9"
                    />
                  </div>
                  {services.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(i)}
                      className="h-9 w-9 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addService}
              className="gap-2 rounded-xl w-full"
            >
              <Plus className="w-4 h-4" /> Add Service
            </Button>
          </div>
        )}

        {/* Step 2: Working Hours */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Working Hours</h2>
            <div className="space-y-3">
              {hours.map((h, i) => (
                <div key={h.day} className="flex items-center gap-3">
                  <span className="w-24 text-sm font-medium text-foreground">
                    {h.day.slice(0, 3)}
                  </span>
                  <Switch
                    checked={h.isOpen}
                    onCheckedChange={(v) => updateHours(i, "isOpen", v)}
                  />
                  {h.isOpen ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        type="time"
                        value={h.openTime}
                        onChange={(e) =>
                          updateHours(i, "openTime", e.target.value)
                        }
                        className="rounded-xl h-8 text-xs flex-1"
                      />
                      <span className="text-muted-foreground text-xs">–</span>
                      <Input
                        type="time"
                        value={h.closeTime}
                        onChange={(e) =>
                          updateHours(i, "closeTime", e.target.value)
                        }
                        className="rounded-xl h-8 text-xs flex-1"
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Closed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Bank Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Bank Details</h2>
            <p className="text-sm text-muted-foreground">
              Your earnings will be transferred to this account every weekend.
            </p>
            <div className="space-y-3">
              <div>
                <Label className="text-sm mb-1.5 block">
                  Account Holder Name
                </Label>
                <Input
                  value={bankDetails.accountHolderName}
                  onChange={(e) =>
                    setBankDetails((p) => ({
                      ...p,
                      accountHolderName: e.target.value,
                    }))
                  }
                  placeholder="Full name as on bank account"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Account Number</Label>
                <Input
                  value={bankDetails.accountNumber}
                  onChange={(e) =>
                    setBankDetails((p) => ({
                      ...p,
                      accountNumber: e.target.value,
                    }))
                  }
                  placeholder="Account number"
                  className="rounded-xl"
                  type="password"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">
                  IFSC / Routing Number
                </Label>
                <Input
                  value={bankDetails.routingNumber}
                  onChange={(e) =>
                    setBankDetails((p) => ({
                      ...p,
                      routingNumber: e.target.value,
                    }))
                  }
                  placeholder="IFSC code"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm mb-1.5 block">Bank Name</Label>
                <Input
                  value={bankDetails.bankName}
                  onChange={(e) =>
                    setBankDetails((p) => ({ ...p, bankName: e.target.value }))
                  }
                  placeholder="e.g. State Bank of India"
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-bold text-lg text-foreground">Documents</h2>
            <p className="text-sm text-muted-foreground">
              Upload required documents for verification.
            </p>
            <div className="space-y-3">
              {["GST Certificate", "Shop License", "Owner ID Proof"].map(
                (doc) => (
                  <div
                    key={doc}
                    className="border-2 border-dashed border-border rounded-xl p-4 text-center"
                  >
                    <p className="text-sm font-medium text-foreground mb-1">
                      {doc}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      PDF, JPG, PNG (max 5MB)
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Upload
                    </Button>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <Button
          variant="outline"
          onClick={() =>
            step === 0 ? navigate({ to: "/" }) : setStep((s) => s - 1)
          }
          className="gap-2 rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 0 ? "Cancel" : "Back"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="btn-gold gap-2 rounded-xl flex-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={registerSalon.isPending}
            className="btn-gold gap-2 rounded-xl flex-1"
          >
            {registerSalon.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Submit Registration
          </Button>
        )}
      </div>
    </div>
  );
}
