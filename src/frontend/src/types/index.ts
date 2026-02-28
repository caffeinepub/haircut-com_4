export type Gender = 'Male' | 'Female' | 'Kids' | 'Unisex';

export type BookingStatus = 'Pending' | 'Accepted' | 'Declined' | 'Completed' | 'Cancelled' | 'No-show';

export type SalonCategory = 'Men' | 'Women' | 'Kids' | 'Unisex';

export type SalonApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface UserProfile {
  id: string;
  name: string;
  gender: Gender;
  address: string;
  profilePhoto?: string;
  role: 'customer' | 'owner' | 'admin';
  referralCode: string;
  membershipActive: boolean;
  membershipExpiry?: string;
  walletBalance: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  category?: SalonCategory;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface WorkingHours {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface Salon {
  id: string;
  name: string;
  ownerName: string;
  ownerPrincipal?: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  category: SalonCategory;
  services: Service[];
  staff: Staff[];
  workingHours: WorkingHours[];
  photos: string[];
  approvalStatus: SalonApprovalStatus;
  rating: number;
  reviewCount: number;
  priceRange: string;
  isOpen: boolean;
  distance?: number;
  description?: string;
  bankDetails?: BankDetails;
  commissionRate?: number;
  payableBalance?: number;
  createdAt: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  salonId: string;
  salonName: string;
  services: Service[];
  staffId?: string;
  staffName?: string;
  date: string;
  timeSlot: string;
  status: BookingStatus;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  totalAmount: number;
  couponCode?: string;
  discountAmount?: number;
  createdAt: string;
}

export interface Review {
  id: string;
  salonId: string;
  customerId: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  authorType: 'customer' | 'owner';
  salonId?: string;
  imageUrl?: string;
  caption: string;
  hashtags: string[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  replies?: Comment[];
}

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  description: string;
  amount: number;
  date: string;
  bookingId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'flat' | 'percent';
  discountValue: number;
  minCartValue: number;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  category?: SalonCategory;
  salonId?: string;
  isActive: boolean;
}

export interface CommissionRates {
  global: number;
  byCategory: Record<SalonCategory, number>;
  bySalon: Record<string, number>;
}

export interface Payout {
  id: string;
  salonId: string;
  salonName: string;
  amount: number;
  period: string;
  status: 'Pending' | 'Processed';
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  customerName: string;
  salonName: string;
  reason: string;
  amount: number;
  status: 'Open' | 'Resolved' | 'Refunded';
  createdAt: string;
}

export interface Analytics {
  totalBookings: number;
  gmv: number;
  platformRevenue: number;
  cancellationRate: number;
  topSalons: { name: string; bookings: number }[];
  bookingsByDay: { day: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}
