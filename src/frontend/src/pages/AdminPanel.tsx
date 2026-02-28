import React, { useState, useEffect } from 'react';
import {
  useIsCallerAdmin,
  usePendingSalons,
  useApproveSalon,
  useRejectSalon,
  useUserList,
  useCommissionRates,
  useUpdateCommissionRates,
  usePendingPayouts,
  useMarkPayoutProcessed,
  useAnalytics,
  useReportedPosts,
  useModeratePost,
  useDisputes,
  useResolveDispute,
  useIsStripeConfigured,
  useSetStripeConfiguration,
} from '../hooks/useQueries';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  XCircle,
  Users,
  Settings,
  BarChart3,
  Shield,
  AlertTriangle,
  CreditCard,
  Loader2,
  TrendingUp,
  DollarSign,
  Percent,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export function AdminPanel() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: stripeConfigured } = useIsStripeConfigured();

  if (adminLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-gold-500" />
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        {!isAdmin && (
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Demo Mode
          </Badge>
        )}
      </div>

      {!stripeConfigured && <StripeSetupBanner />}

      <Tabs defaultValue="approvals">
        <TabsList className="flex flex-wrap gap-1 h-auto mb-6 bg-muted p-1 rounded-xl">
          <TabsTrigger value="approvals" className="rounded-lg text-xs gap-1">
            <CheckCircle className="w-3.5 h-3.5" />Approvals
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg text-xs gap-1">
            <Users className="w-3.5 h-3.5" />Users
          </TabsTrigger>
          <TabsTrigger value="commission" className="rounded-lg text-xs gap-1">
            <Percent className="w-3.5 h-3.5" />Commission
          </TabsTrigger>
          <TabsTrigger value="payouts" className="rounded-lg text-xs gap-1">
            <DollarSign className="w-3.5 h-3.5" />Payouts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg text-xs gap-1">
            <BarChart3 className="w-3.5 h-3.5" />Analytics
          </TabsTrigger>
          <TabsTrigger value="moderation" className="rounded-lg text-xs gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />Moderation
          </TabsTrigger>
          <TabsTrigger value="disputes" className="rounded-lg text-xs gap-1">
            <Shield className="w-3.5 h-3.5" />Disputes
          </TabsTrigger>
          <TabsTrigger value="stripe" className="rounded-lg text-xs gap-1">
            <CreditCard className="w-3.5 h-3.5" />Stripe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approvals"><SalonApprovals /></TabsContent>
        <TabsContent value="users"><UserManagement /></TabsContent>
        <TabsContent value="commission"><CommissionSettings /></TabsContent>
        <TabsContent value="payouts"><PayoutManagement /></TabsContent>
        <TabsContent value="analytics"><AnalyticsDashboard /></TabsContent>
        <TabsContent value="moderation"><ContentModeration /></TabsContent>
        <TabsContent value="disputes"><DisputeManagement /></TabsContent>
        <TabsContent value="stripe"><StripeSetup /></TabsContent>
      </Tabs>
    </div>
  );
}

function StripeSetupBanner() {
  return (
    <div className="mb-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-3">
      <CreditCard className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <p className="text-sm text-yellow-700 dark:text-yellow-400">
        Stripe is not configured. Go to the <strong>Stripe</strong> tab to set up payments.
      </p>
    </div>
  );
}

function SalonApprovals() {
  const { data: salons, isLoading } = usePendingSalons();
  const approve = useApproveSalon();
  const reject = useRejectSalon();
  const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

  if (isLoading) return <div className="space-y-4"><SkeletonLoader variant="card" count={2} /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">Pending Salon Approvals ({salons?.length || 0})</h2>
      {salons?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No pending approvals.</p>
        </div>
      ) : (
        salons?.map(salon => (
          <div key={salon.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-foreground">{salon.name}</h3>
                <p className="text-sm text-muted-foreground">{salon.ownerName} · {salon.category}</p>
                <p className="text-xs text-muted-foreground">{salon.address}, {salon.city}</p>
              </div>
              <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-500/30">Pending</Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Services: {salon.services.map(s => s.name).join(', ') || 'None listed'}
            </div>
            <Input
              value={rejectReasons[salon.id] || ''}
              onChange={e => setRejectReasons(p => ({ ...p, [salon.id]: e.target.value }))}
              placeholder="Rejection reason (optional)"
              className="rounded-xl h-9 text-sm"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  approve.mutate(salon.id);
                  toast.success('Salon approved!');
                }}
                disabled={approve.isPending}
                className="flex-1 gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  reject.mutate({ salonId: salon.id, reason: rejectReasons[salon.id] || '' });
                  toast.success('Salon rejected');
                }}
                disabled={reject.isPending}
                className="flex-1 gap-1.5 rounded-xl text-destructive border-destructive/30"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function UserManagement() {
  const { data: users, isLoading } = useUserList();

  if (isLoading) return <div className="space-y-3"><SkeletonLoader variant="text" count={5} /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">All Users ({users?.length || 0})</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Role</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Joined</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
              <th className="text-left py-2 px-3 text-muted-foreground font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map(user => (
              <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-medium text-foreground">{user.name}</td>
                <td className="py-2.5 px-3">
                  <Badge variant="outline" className="text-xs capitalize">{user.role}</Badge>
                </td>
                <td className="py-2.5 px-3 text-muted-foreground">{user.createdAt}</td>
                <td className="py-2.5 px-3">
                  <span className="text-xs font-medium text-green-600">{user.status}</span>
                </td>
                <td className="py-2.5 px-3">
                  <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive">
                    Deactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CommissionSettings() {
  const { data: rates, isLoading } = useCommissionRates();
  const updateRates = useUpdateCommissionRates();
  const [global, setGlobal] = useState('');
  const [categoryRates, setCategoryRates] = useState<Record<string, string>>({});

  useEffect(() => {
    if (rates) {
      setGlobal(String(rates.global));
      const cr: Record<string, string> = {};
      Object.entries(rates.byCategory).forEach(([k, v]) => {
        cr[k] = String(v);
      });
      setCategoryRates(cr);
    }
  }, [rates]);

  const handleSave = async () => {
    const byCategory: Record<string, number> = {};
    Object.entries(categoryRates).forEach(([k, v]) => {
      byCategory[k] = Number(v);
    });
    await updateRates.mutateAsync({ global: Number(global), byCategory });
    toast.success('Commission rates updated!');
  };

  if (isLoading) return <div className="space-y-3"><SkeletonLoader variant="card" count={2} /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Global Commission Rate</h2>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Label className="text-xs mb-1 block">Default Rate (%)</Label>
            <Input
              type="number"
              value={global}
              onChange={e => setGlobal(e.target.value)}
              placeholder="10"
              className="rounded-xl"
            />
          </div>
          <div className="pt-5">
            <Percent className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold text-foreground">Category-wise Rates</h2>
        <div className="grid grid-cols-2 gap-3">
          {['Men', 'Women', 'Kids', 'Unisex'].map(cat => (
            <div key={cat}>
              <Label className="text-xs mb-1 block">{cat} (%)</Label>
              <Input
                type="number"
                value={categoryRates[cat] || ''}
                onChange={e => setCategoryRates(p => ({ ...p, [cat]: e.target.value }))}
                placeholder="10"
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={handleSave}
        disabled={updateRates.isPending}
        className="btn-gold w-full rounded-xl gap-2"
      >
        {updateRates.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
        Save Commission Rates
      </Button>
    </div>
  );
}

function PayoutManagement() {
  const { data: payouts, isLoading } = usePendingPayouts();
  const markProcessed = useMarkPayoutProcessed();

  if (isLoading) return <div className="space-y-3"><SkeletonLoader variant="card" count={3} /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">Payout Management</h2>
      <div className="space-y-3">
        {payouts?.map(payout => (
          <div
            key={payout.id}
            className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground text-sm">{payout.salonName}</p>
              <p className="text-xs text-muted-foreground">{payout.period}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-bold text-gold-600 dark:text-gold-400">
                ₹{payout.amount.toLocaleString('en-IN')}
              </p>
              <Badge
                className={cn(
                  'text-xs',
                  payout.status === 'Pending'
                    ? 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'
                    : 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30'
                )}
              >
                {payout.status}
              </Badge>
            </div>
            {payout.status === 'Pending' && (
              <Button
                size="sm"
                onClick={() => {
                  markProcessed.mutate(payout.id);
                  toast.success('Payout marked as processed');
                }}
                disabled={markProcessed.isPending}
                className="btn-gold rounded-xl text-xs gap-1 flex-shrink-0"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Process
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const CHART_COLORS = ['#C9A84C', '#8B6914', '#E8C97A', '#A07830', '#F0DFA0'];

function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) return <div className="space-y-4"><SkeletonLoader variant="card" count={3} /></div>;
  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Bookings', value: analytics.totalBookings.toLocaleString(), icon: BarChart3 },
          { label: 'GMV', value: `₹${(analytics.gmv / 100000).toFixed(1)}L`, icon: TrendingUp },
          { label: 'Revenue', value: `₹${(analytics.platformRevenue / 1000).toFixed(0)}K`, icon: DollarSign },
          { label: 'Cancellation', value: `${analytics.cancellationRate}%`, icon: XCircle },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <kpi.icon className="w-5 h-5 text-gold-500 mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Bookings by Day */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Bookings by Day of Week</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics.bookingsByDay}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#C9A84C" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue by Month */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={analytics.revenueByMonth}>
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#C9A84C"
              strokeWidth={2}
              dot={{ fill: '#C9A84C' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Salons */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Top Salons by Bookings</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={analytics.topSalons}
              dataKey="bookings"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }: { name: string; percent: number }) =>
                `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`
              }
            >
              {analytics.topSalons.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ContentModeration() {
  const { data: posts, isLoading } = useReportedPosts();
  const moderate = useModeratePost();

  if (isLoading) return <div className="space-y-4"><SkeletonLoader variant="post-card" count={2} /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">Reported Posts ({posts?.length || 0})</h2>
      {posts?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No reported posts.</p>
        </div>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        posts?.map((post: any) => (
          <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden">
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.caption} className="w-full h-40 object-cover" />
            )}
            <div className="p-4 space-y-3">
              <div>
                <p className="font-semibold text-sm text-foreground">{post.authorName}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{post.caption}</p>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">
                  {post.reportReason} · {post.reportCount} reports
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    moderate.mutate({ postId: post.id, action: 'approve' });
                    toast.success('Post approved');
                  }}
                  disabled={moderate.isPending}
                  className="flex-1 gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Keep
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    moderate.mutate({ postId: post.id, action: 'remove' });
                    toast.success('Post removed');
                  }}
                  disabled={moderate.isPending}
                  className="flex-1 gap-1.5 rounded-xl text-destructive border-destructive/30"
                >
                  <XCircle className="w-3.5 h-3.5" /> Remove
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function DisputeManagement() {
  const { data: disputes, isLoading } = useDisputes();
  const resolve = useResolveDispute();

  if (isLoading) return <div className="space-y-3"><SkeletonLoader variant="card" count={2} /></div>;

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-foreground">Open Disputes ({disputes?.length || 0})</h2>
      {disputes?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No open disputes.</p>
        </div>
      ) : (
        disputes?.map(dispute => (
          <div key={dispute.id} className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground text-sm">Booking #{dispute.bookingId}</p>
                <p className="text-xs text-muted-foreground">
                  {dispute.customerName} vs {dispute.salonName}
                </p>
              </div>
              <Badge
                className={cn(
                  'text-xs flex-shrink-0',
                  dispute.status === 'Open'
                    ? 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
                    : 'bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30'
                )}
              >
                {dispute.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{dispute.reason}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-gold-600 dark:text-gold-400">₹{dispute.amount}</span>
              {dispute.status === 'Open' && (
                <Button
                  size="sm"
                  onClick={() => {
                    resolve.mutate(dispute.id);
                    toast.success('Dispute resolved with refund');
                  }}
                  disabled={resolve.isPending}
                  className="btn-gold rounded-xl gap-1.5 text-xs"
                >
                  {resolve.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Resolve & Refund
                </Button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function StripeSetup() {
  const { data: isConfigured, isLoading } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB,IN,AU');

  const handleSave = async () => {
    if (!secretKey.startsWith('sk_')) {
      toast.error('Invalid Stripe secret key. Must start with sk_');
      return;
    }
    const allowedCountries = countries
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);
    await setConfig.mutateAsync({ secretKey, allowedCountries });
    toast.success('Stripe configured successfully!');
    setSecretKey('');
  };

  if (isLoading) return <SkeletonLoader variant="card" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CreditCard className="w-5 h-5 text-gold-500" />
        <h2 className="font-semibold text-foreground">Stripe Payment Setup</h2>
        {isConfigured ? (
          <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30 text-xs">
            Configured
          </Badge>
        ) : (
          <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 text-xs">
            Not Configured
          </Badge>
        )}
      </div>

      {isConfigured ? (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center space-y-2">
          <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
          <p className="font-semibold text-foreground">Stripe is configured and active</p>
          <p className="text-sm text-muted-foreground">Payments are being processed through Stripe.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Configure Stripe to enable online payments. Get your secret key from the{' '}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-500 hover:underline"
            >
              Stripe Dashboard
            </a>.
          </p>
          <div>
            <Label className="text-sm mb-1.5 block">Stripe Secret Key</Label>
            <Input
              type="password"
              value={secretKey}
              onChange={e => setSecretKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              className="rounded-xl font-mono"
            />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Allowed Countries (comma-separated)</Label>
            <Input
              value={countries}
              onChange={e => setCountries(e.target.value)}
              placeholder="US,CA,GB,IN"
              className="rounded-xl"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={!secretKey || setConfig.isPending}
            className="btn-gold w-full rounded-xl gap-2"
          >
            {setConfig.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Save Stripe Configuration
          </Button>
        </div>
      )}
    </div>
  );
}
