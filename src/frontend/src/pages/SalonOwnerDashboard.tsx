import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Image,
  Loader2,
  Plus,
  Tag,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import {
  useActiveCoupons,
  useCreateCoupon,
  useSalonBookings,
  useSalonEarnings,
  useSalonSchedule,
  useUpdateBookingStatus,
  useUpdateSchedule,
} from "../hooks/useQueries";
import type { BookingStatus, TimeSlot } from "../types";

const STATUS_STYLES: Record<BookingStatus, string> = {
  Pending:
    "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30",
  Accepted:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  Declined: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  Completed:
    "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  Cancelled: "bg-muted text-muted-foreground border-border",
  "No-show":
    "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
};

export function SalonOwnerDashboard() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-foreground mb-6">
        Owner Dashboard
      </h1>
      <Tabs defaultValue="bookings">
        <TabsList className="grid grid-cols-5 w-full mb-6 rounded-xl">
          <TabsTrigger value="bookings" className="rounded-lg text-xs gap-1">
            <Calendar className="w-3.5 h-3.5" /> Bookings
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg text-xs gap-1">
            <Clock className="w-3.5 h-3.5" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="earnings" className="rounded-lg text-xs gap-1">
            <BarChart3 className="w-3.5 h-3.5" /> Earnings
          </TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-lg text-xs gap-1">
            <Tag className="w-3.5 h-3.5" /> Promos
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-lg text-xs gap-1">
            <Image className="w-3.5 h-3.5" /> Content
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bookings">
          <BookingsManagement />
        </TabsContent>
        <TabsContent value="schedule">
          <ScheduleManagement />
        </TabsContent>
        <TabsContent value="earnings">
          <EarningsDashboard />
        </TabsContent>
        <TabsContent value="promotions">
          <PromotionsSection />
        </TabsContent>
        <TabsContent value="content">
          <ContentSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingsManagement() {
  const { data: bookings, isLoading } = useSalonBookings();
  const updateStatus = useUpdateBookingStatus();

  const handleAction = async (bookingId: string, status: string) => {
    await updateStatus.mutateAsync({ bookingId, status });
    toast.success(`Booking ${status.toLowerCase()}`);
  };

  if (isLoading)
    return (
      <div className="space-y-4">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">Incoming Bookings</h2>
      {bookings?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No bookings yet.</p>
        </div>
      ) : (
        bookings?.map((booking) => (
          <div
            key={booking.id}
            className="bg-card border border-border rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground">
                  {booking.customerName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {booking.services.map((s) => s.name).join(", ")}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {booking.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {booking.timeSlot}
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <Badge
                  className={cn("text-xs mb-1", STATUS_STYLES[booking.status])}
                >
                  {booking.status}
                </Badge>
                <p className="font-bold text-gold-600 dark:text-gold-400 text-sm">
                  ₹{booking.totalAmount}
                </p>
              </div>
            </div>
            {booking.status === "Pending" && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => handleAction(booking.id, "Accepted")}
                  disabled={updateStatus.isPending}
                  className="flex-1 gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction(booking.id, "Declined")}
                  disabled={updateStatus.isPending}
                  className="flex-1 gap-1.5 rounded-xl text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <XCircle className="w-3.5 h-3.5" /> Decline
                </Button>
              </div>
            )}
            {booking.status === "Accepted" && (
              <Button
                size="sm"
                onClick={() => handleAction(booking.id, "Completed")}
                disabled={updateStatus.isPending}
                className="w-full gap-1.5 rounded-xl btn-gold"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Mark Completed
              </Button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function ScheduleManagement() {
  const { data: schedule, isLoading } = useSalonSchedule();
  const updateSchedule = useUpdateSchedule();

  const toggleSlot = async (slot: TimeSlot) => {
    if (!schedule) return;
    const updated = schedule.availableSlots.map((s) =>
      s.id === slot.id ? { ...s, isAvailable: !s.isAvailable } : s,
    );
    await updateSchedule.mutateAsync({ slots: updated });
    toast.success("Schedule updated");
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        <SkeletonLoader variant="text" count={5} />
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-foreground mb-3">
          Available Time Slots
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {schedule?.availableSlots.map((slot) => (
            <button
              type="button"
              key={slot.id}
              onClick={() => toggleSlot(slot)}
              className={cn(
                "py-2 px-3 rounded-xl text-xs font-medium border-2 transition-all",
                slot.isAvailable
                  ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-border bg-muted text-muted-foreground",
              )}
            >
              {slot.time}
            </button>
          ))}
        </div>
      </div>
      <Separator />
      <div>
        <h2 className="font-semibold text-foreground mb-3">Holiday Dates</h2>
        <div className="flex flex-wrap gap-2">
          {schedule?.holidays.map((date) => (
            <Badge key={date} variant="secondary" className="gap-1">
              {date}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Contact support to add or remove holiday dates.
        </p>
      </div>
    </div>
  );
}

function EarningsDashboard() {
  const { data: earnings, isLoading } = useSalonEarnings();

  if (isLoading)
    return (
      <div className="space-y-4">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="gradient-gold rounded-2xl p-5 shadow-gold">
        <p className="text-charcoal-800 font-semibold text-sm mb-1">
          Pending Payout
        </p>
        <p className="text-3xl font-bold text-charcoal-900">
          ₹{earnings?.pendingPayout?.toLocaleString("en-IN")}
        </p>
        <p className="text-charcoal-700 text-xs mt-1">
          Next payout: This weekend
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: earnings?.daily, icon: DollarSign },
          { label: "This Week", value: earnings?.weekly, icon: TrendingUp },
          { label: "This Month", value: earnings?.monthly, icon: BarChart3 },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-card border border-border rounded-2xl p-4 text-center"
          >
            <item.icon className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">
              ₹{item.value?.toLocaleString("en-IN")}
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Bookings</span>
          <span className="font-semibold">{earnings?.totalBookings}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Commission Deducted (10%)
          </span>
          <span className="font-semibold text-red-500">
            -₹{earnings?.commissionDeducted?.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
}

function PromotionsSection() {
  const { data: coupons } = useActiveCoupons();
  const createCoupon = useCreateCoupon();
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"flat" | "percent">(
    "percent",
  );
  const [discountValue, setDiscountValue] = useState("");
  const [minCart, setMinCart] = useState("");
  const [expiry, setExpiry] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const handleCreate = async () => {
    if (!code || !discountValue) return;
    await createCoupon.mutateAsync({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minCartValue: Number(minCart) || 0,
      expiryDate: expiry,
      usageLimit: Number(usageLimit) || 100,
      isActive: true,
    });
    toast.success("Coupon created!");
    setCode("");
    setDiscountValue("");
    setMinCart("");
    setExpiry("");
    setUsageLimit("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Create Coupon</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs mb-1 block">Coupon Code</Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. SAVE20"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Discount Type</Label>
            <Select
              value={discountType}
              onValueChange={(v) => setDiscountType(v as "flat" | "percent")}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percent">Percentage (%)</SelectItem>
                <SelectItem value="flat">Flat (₹)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs mb-1 block">Discount Value</Label>
            <Input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "percent" ? "20" : "100"}
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Min Cart (₹)</Label>
            <Input
              type="number"
              value={minCart}
              onChange={(e) => setMinCart(e.target.value)}
              placeholder="300"
              className="rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs mb-1 block">Usage Limit</Label>
            <Input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="100"
              className="rounded-xl"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs mb-1 block">Expiry Date</Label>
            <Input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="rounded-xl"
            />
          </div>
        </div>
        <Button
          onClick={handleCreate}
          disabled={!code || !discountValue || createCoupon.isPending}
          className="btn-gold w-full rounded-xl gap-2"
        >
          {createCoupon.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Create Coupon
        </Button>
      </div>

      {coupons && coupons.length > 0 && (
        <div>
          <h2 className="font-semibold text-foreground mb-3">Active Coupons</h2>
          <div className="space-y-2">
            {coupons.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
              >
                <div>
                  <span className="font-mono font-bold text-gold-600 dark:text-gold-400">
                    {c.code}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    {c.discountType === "percent"
                      ? `${c.discountValue}%`
                      : `₹${c.discountValue}`}{" "}
                    off · Expires {c.expiryDate}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {c.usedCount}/{c.usageLimit} used
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContentSection() {
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Upload Salon Photos</h2>
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center space-y-3">
          <div className="text-4xl">📸</div>
          <p className="text-sm font-medium text-foreground">Add Photos</p>
          <p className="text-xs text-muted-foreground">
            Showcase your salon, work, and ambiance
          </p>
          <Button variant="outline" className="rounded-xl gap-2">
            <Plus className="w-4 h-4" /> Upload Photos
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Create Social Post</h2>
        <div>
          <Label className="text-xs mb-1 block">Image URL</Label>
          <Input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="rounded-xl"
          />
        </div>
        <div>
          <Label className="text-xs mb-1 block">Caption</Label>
          <Input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write something about your work..."
            className="rounded-xl"
          />
        </div>
        <Button
          disabled={!caption}
          className="btn-gold w-full rounded-xl gap-2"
          onClick={() => {
            toast.success("Post created!");
            setCaption("");
            setImageUrl("");
          }}
        >
          <Plus className="w-4 h-4" /> Publish Post
        </Button>
      </div>
    </div>
  );
}
