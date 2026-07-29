"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaymentMethod = 'upi' | 'card' | 'netbanking';

const PLAN_FEATURES = [
  'Unlimited Employees',
  'All Core Features',
  'Multi-Branch Support',
  'Leave Management',
  'Payroll-Ready Reports',
  'Admin & HR Dashboards',
  'Secure Cloud Storage',
  'Email & Chat Support',
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = React.useState('');
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [selectedBank, setSelectedBank] = React.useState('');
  const [agreed, setAgreed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-3">You&apos;re all set!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your Unite Attendance account is being set up. You&apos;ll receive a confirmation email shortly.
          </p>
          <div className="bg-card border border-border rounded-2xl p-6 mb-8 text-left">
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-semibold">Pro Plan</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-muted-foreground">Billing</span>
              <span className="font-semibold">₹500/month</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trial ends</span>
              <span className="font-semibold text-green-600">14 days free</span>
            </div>
          </div>
          <Link href="/">
            <Button size="lg" className="w-full h-14 text-base font-semibold">
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight">Unite Attendance</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Left — Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">Unite Attendance</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {PLAN_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{f}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">14-day free trial</span>
                  <span className="text-green-600 font-semibold">₹0 today</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Then billed monthly</span>
                  <span className="font-semibold">₹500/month</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border mt-2">
                  <span>Due today</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 shrink-0 text-primary" />
                <span>Cancel anytime before trial ends. No charges until day 15.</span>
              </div>
            </div>
          </motion.div>

          {/* Right — Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <h1 className="text-2xl font-bold mb-2">Start your free trial</h1>
            <p className="text-muted-foreground mb-8">
              No charges today. Your card will only be billed after the 14-day free trial.
            </p>

            {/* Payment Method Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-muted rounded-xl">
              {([
                { key: 'upi', label: 'UPI', icon: Smartphone },
                { key: 'card', label: 'Card', icon: CreditCard },
                { key: 'netbanking', label: 'Net Banking', icon: Building2 },
              ] as { key: PaymentMethod; label: string; icon: React.ElementType }[]).map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setPaymentMethod(key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    paymentMethod === key
                      ? 'bg-background text-foreground shadow-sm border border-border'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* UPI */}
              {paymentMethod === 'upi' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                    />
                    <p className="text-xs text-muted-foreground mt-2">Supports all UPI apps — PhonePe, GPay, Paytm, BHIM, and more.</p>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {['PhonePe', 'GPay', 'Paytm', 'BHIM'].map((app) => (
                      <div key={app} className="border border-border rounded-xl p-3 flex items-center justify-center bg-muted/30 text-xs font-semibold text-muted-foreground">{app}</div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Card */}
              {paymentMethod === 'card' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full h-12 px-4 pr-14 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-mono"
                      />
                      <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">CVV</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Net Banking */}
              {paymentMethod === 'netbanking' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Your Bank</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                        <button
                          type="button"
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`h-12 rounded-xl border text-sm font-semibold transition-all ${
                            selectedBank === bank
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary/40'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
                    >
                      <option value="">Or select other bank…</option>
                      {['Bank of Baroda', 'Canara Bank', 'Union Bank', 'IndusInd', 'Yes Bank', 'IDFC First', 'Federal Bank'].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {/* Terms */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-primary cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  I agree to the <span className="text-primary underline underline-offset-2">Terms of Service</span> and <span className="text-primary underline underline-offset-2">Privacy Policy</span>. I understand my card will be charged ₹500/month after my 14-day free trial unless I cancel.
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base font-bold shadow-lg shadow-primary/20 mt-2"
                disabled={!agreed || loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Start Free Trial — ₹0 today
                    <ChevronRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> 256-bit SSL</span>
                <span>•</span>
                <span>PCI-DSS Compliant</span>
                <span>•</span>
                <span>Powered by PunchLogs™</span>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
