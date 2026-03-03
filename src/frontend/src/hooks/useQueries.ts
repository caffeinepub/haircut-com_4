import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ShoppingItem } from "../backend";
import type { Booking, Comment, Coupon, Post, Salon } from "../types";
import { useActor } from "./useActor";

// ─── Stripe ───────────────────────────────────────────────────────────────────

export type CheckoutSession = { id: string; url: string };

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error("Actor not available");
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) throw new Error("Stripe session missing url");
      return session;
    },
  });
}

export function useStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: {
      secretKey: string;
      allowedCountries: string[];
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["stripeConfigured"] }),
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Salons ───────────────────────────────────────────────────────────────────

export function useSearchSalons(
  filters: {
    category?: string;
    minRating?: number;
    maxPrice?: number;
    city?: string;
    pincode?: string;
    openNow?: boolean;
    priceRange?: string;
    query?: string;
  } = {},
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["salons", "search", filters],
    queryFn: async (): Promise<Salon[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listSalons(filters);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSalonDetail(salonId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["salon", salonId],
    queryFn: async (): Promise<Salon | null> => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getSalon(salonId);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!salonId,
  });
}

export function useFeaturedSalons() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["salons", "featured"],
    queryFn: async (): Promise<Salon[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listSalons({ featured: true });
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePendingSalons() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pendingSalons"],
    queryFn: async (): Promise<Salon[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listSalons({ status: "Pending" });
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveSalon() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (salonId: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).approveSalon(salonId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingSalons"] }),
  });
}

export function useRejectSalon() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      salonId,
      reason,
    }: { salonId: string; reason: string }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).rejectSalon(salonId, reason);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingSalons"] }),
  });
}

export function useRegisterSalon() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: Partial<Salon>) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).createSalon(data);
      } catch {
        return { ...data, id: `s${Date.now()}`, approvalStatus: "Pending" };
      }
    },
  });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export function useCustomerBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings", "customer"],
    queryFn: async (): Promise<Booking[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getBookingsByCustomer();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookings() {
  return useCustomerBookings();
}

export function useSalonBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings", "salon"],
    queryFn: async (): Promise<Booking[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getBookingsBySalon();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      bookingId,
      status,
    }: { bookingId: string; status: string }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).updateBookingStatus(bookingId, status);
      } catch {
        return { bookingId, status };
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGetAvailableSlots(
  salonId: string | undefined,
  date: string | undefined,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["slots", salonId, date],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getAvailableSlots(salonId, date);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!salonId && !!date,
  });
}

// Keep old name as alias for backward compat
export function useAvailableSlots(
  salonId: string | undefined,
  date: string | undefined,
) {
  return useGetAvailableSlots(salonId, date);
}

export function useReserveSlot() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      salonId,
      date,
      slotId,
    }: { salonId: string; date: string; slotId: string }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).reserveSlot(salonId, date, slotId);
    },
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: Partial<Booking>) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).createBooking(data);
      } catch {
        return {
          ...data,
          id: `b${Date.now()}`,
          status: "Pending",
          createdAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useSalonReviews(salonId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reviews", salonId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getReviewsBySalon(salonId);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!salonId,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (reviewData: {
      bookingId: string;
      rating: number;
      reviewText: string;
      salonId?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).submitReview(reviewData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
      qc.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
}

export function useGetReviewByBooking(bookingId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["review", "booking", bookingId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getReviewByBooking(bookingId);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!bookingId,
  });
}

// ─── Social Feed ──────────────────────────────────────────────────────────────

export function useSocialFeed(principal?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["feed", principal],
    queryFn: async (): Promise<Post[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getFeed(principal);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLikePost() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      postId,
      isLiked,
    }: { postId: string; isLiked: boolean }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).likePost(postId);
      } catch {
        return { postId, isLiked };
      }
    },
    onMutate: async ({ postId, isLiked }) => {
      await qc.cancelQueries({ queryKey: ["feed"] });
      const prev = qc.getQueryData<Post[]>(["feed"]);
      qc.setQueryData<Post[]>(["feed"], (old) =>
        old?.map((p) =>
          p.id === postId
            ? { ...p, isLiked, likeCount: p.likeCount + (isLiked ? 1 : -1) }
            : p,
        ),
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(["feed"], ctx.prev);
    },
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      caption: string;
      hashtags: string[];
      imageUrl?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).createPost(data);
      } catch {
        return {
          ...data,
          id: `p${Date.now()}`,
          authorId: "u1",
          authorName: "You",
          authorType: "customer" as const,
          likeCount: 0,
          commentCount: 0,
          isLiked: false,
          createdAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });
}

export function usePostComments(postId: string | undefined) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async (): Promise<Comment[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getComments(postId);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useAddComment() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).addComment(postId, text);
      } catch {
        return {
          id: `c${Date.now()}`,
          postId,
          authorId: "u1",
          authorName: "You",
          text,
          createdAt: new Date().toISOString(),
        };
      }
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["comments", vars.postId] }),
  });
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export function useWalletBalance(principal?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["wallet", "balance", principal],
    queryFn: async (): Promise<number> => {
      if (!actor) return 0;
      try {
        const result = await (actor as any).getWalletBalance(principal);
        return result ?? 0;
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWalletTransactions(principal?: string) {
  return useTransactions(principal);
}

export function useTransactions(principal?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["transactions", principal],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getTransactions(principal);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export function useActiveCoupons() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["coupons", "active"],
    queryFn: async (): Promise<Coupon[]> => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listActiveCoupons();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useValidateCoupon() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      code,
      cartValue,
      cartTotal,
      category,
    }: {
      code: string;
      cartValue?: number;
      cartTotal?: number;
      category?: string;
    }) => {
      const value = cartValue ?? cartTotal ?? 0;
      if (!actor) throw new Error("Actor not available");
      return (actor as any).validateCoupon(code, value, category);
    },
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: Partial<Coupon>) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).createCoupon(data);
      } catch {
        return { ...data, id: `cp${Date.now()}`, usedCount: 0, isActive: true };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["coupons"] }),
  });
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function useUserList() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userList"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listUsers();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCommissionRates() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["commissionRates"],
    queryFn: async () => {
      if (!actor)
        return {
          global: 10,
          byCategory: { Men: 10, Women: 12, Kids: 8, Unisex: 10 },
          bySalon: {},
        };
      try {
        const result = await (actor as any).getCommissionRates();
        return (
          result ?? {
            global: 10,
            byCategory: { Men: 10, Women: 12, Kids: 8, Unisex: 10 },
            bySalon: {},
          }
        );
      } catch {
        return {
          global: 10,
          byCategory: { Men: 10, Women: 12, Kids: 8, Unisex: 10 },
          bySalon: {},
        };
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateCommissionRates() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (rates: {
      global: number;
      byCategory: Record<string, number>;
    }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).configureCommissionRate(rates);
      } catch {
        return rates;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["commissionRates"] }),
  });
}

export function usePendingPayouts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pendingPayouts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listPendingPayouts();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkPayoutProcessed() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (payoutId: string) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).markPayoutProcessed(payoutId);
      } catch {
        return payoutId;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pendingPayouts"] }),
  });
}

export function useAnalytics() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getAnalytics();
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAdminAnalytics() {
  return useAnalytics();
}

export function useReportedPosts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["reportedPosts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listReportedPosts();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useModeratePost() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      postId,
      action,
    }: { postId: string; action: "approve" | "remove" }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).moderatePost(postId, action);
      } catch {
        return { postId, action };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reportedPosts"] }),
  });
}

export function useDisputes() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["disputes"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listDisputes();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useResolveDispute() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      disputeId,
      resolution,
    }: { disputeId: string; resolution: string }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).resolveDispute(disputeId, resolution);
      } catch {
        return { disputeId, resolution };
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["disputes"] }),
  });
}

// ─── Membership ───────────────────────────────────────────────────────────────

export function useGetMembershipStatus(principal?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["membership", principal],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getMembershipStatus(principal);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

export function useGetSalonSchedule(
  salonId: string,
  startDate?: string,
  endDate?: string,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["schedule", salonId, startDate, endDate],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getSalonSlots(
          salonId,
          startDate,
          endDate,
        );
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!salonId,
  });
}

export function useSalonSchedule(salonId?: string) {
  return useGetSalonSchedule(salonId ?? "", undefined, undefined);
}

export function useSetSalonSlots() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      salonId,
      dayOfWeek,
      slots,
    }: { salonId: string; dayOfWeek: number; slots: any[] }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).setSalonSlots(salonId, dayOfWeek, slots);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedule"] }),
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: { slots?: any[]; salonId?: string }) => {
      if (!actor) throw new Error("Actor not available");
      try {
        return (actor as any).updateSchedule(data);
      } catch {
        return data;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedule"] }),
  });
}

export function useMarkHoliday() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      salonId,
      date,
    }: { salonId: string; date: string }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).markHoliday(salonId, date);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["schedule"] }),
  });
}

// ─── Earnings ─────────────────────────────────────────────────────────────────

export function useGetSalonEarnings(
  salonId?: string,
  period?: "daily" | "weekly" | "monthly",
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["earnings", salonId, period],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getSalonEarnings(salonId, period);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSalonEarnings(salonId?: string) {
  return useGetSalonEarnings(salonId, "monthly");
}

export function usePayoutHistory(salonId?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["payout-history", salonId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).getPayoutHistory(salonId);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRequestPayout() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (salonId?: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).requestPayout(salonId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["payout-history"] });
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export function useListBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["blog", "posts"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listBlogPosts();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(postId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["blog", "post", postId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const result = await (actor as any).getBlogPost(postId);
        return result ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!postId,
  });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (postData: {
      title: string;
      body: string;
      excerpt: string;
      coverImageUrl?: string;
      author: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).createBlogPost(postData);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog"] }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).deleteBlogPost(postId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blog"] }),
  });
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function useListFAQs() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listFAQs();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpsertFAQ() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (faqData: {
      id?: string;
      question: string;
      answer: string;
      category: string;
      order?: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).upsertFAQ(faqData);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFAQ() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (faqId: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).deleteFAQ(faqId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

// ─── Contact ──────────────────────────────────────────────────────────────────

export function useSubmitContactMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).submitContactMessage(
        data.name,
        data.email,
        data.message,
      );
    },
  });
}

export function useListContactMessages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contact", "messages"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (actor as any).listContactMessages();
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkContactMessageRead() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (messageId: string) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).markContactMessageRead(messageId);
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["contact", "messages"] }),
  });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const qc = useQueryClient();
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (profile: {
      name: string;
      email?: string;
      phone?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return (actor as any).saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function usePayouts() {
  return usePendingPayouts();
}
