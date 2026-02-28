import React from 'react';
import { useWalletBalance, useWalletTransactions } from '../hooks/useQueries';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, TrendingUp, TrendingDown, Crown } from 'lucide-react';
import { Transaction } from '../types';
import { cn } from '@/lib/utils';

export function CustomerWallet() {
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { data: transactions, isLoading: txLoading } = useWalletTransactions();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Wallet</h1>

      {/* Balance Card */}
      <div className="gradient-gold rounded-2xl p-6 shadow-gold-lg">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-charcoal-800" />
          <span className="font-semibold text-charcoal-800">Wallet Balance</span>
        </div>
        {balanceLoading ? (
          <Skeleton className="h-12 w-40 bg-charcoal-900/20" />
        ) : (
          <p className="text-4xl font-bold text-charcoal-900">₹{balance?.toLocaleString('en-IN')}</p>
        )}
        <p className="text-charcoal-700 text-sm mt-1">Available for bookings</p>
      </div>

      {/* Membership Card */}
      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
        <img src="/assets/generated/prime-badge.dim_256x256.png" alt="Prime" className="w-12 h-12 object-contain" onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-gold-500" />
            <span className="font-semibold text-foreground">Prime Membership</span>
          </div>
          <p className="text-sm text-muted-foreground">Not active · Get 20% off on all bookings</p>
        </div>
        <button className="btn-gold px-4 py-2 rounded-xl text-sm font-semibold">Activate</button>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="font-semibold text-foreground mb-3">Transaction History</h2>
        {txLoading ? (
          <div className="space-y-3"><SkeletonLoader variant="card" count={4} /></div>
        ) : transactions?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {transactions?.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionItem({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0', tx.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10')}>
        {tx.type === 'credit' ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-1">{tx.description}</p>
        <p className="text-xs text-muted-foreground">{tx.date}</p>
      </div>
      <span className={cn('font-bold text-sm flex-shrink-0', tx.type === 'credit' ? 'text-green-600' : 'text-red-500')}>
        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
      </span>
    </div>
  );
}
