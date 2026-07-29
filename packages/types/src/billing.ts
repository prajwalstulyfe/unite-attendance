// ═══════════════════════════════════════════════════════════════
// Unite Attendance — Billing Types
// ═══════════════════════════════════════════════════════════════

import { Plan, type SubscriptionStatus } from './enums';

/** Subscription entity */
export interface Subscription {
  id: string;
  orgId: string;
  razorpaySubscriptionId: string | null;
  razorpayPlanId: string | null;
  plan: Plan;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Plan feature limits */
export interface PlanLimits {
  maxMembers: number; // -1 = unlimited
  maxBranches: number;
  maxAdmins: number;
  qrRegenPerMonth: number;
  csvExport: boolean;
  pdfExport: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  prioritySupport: boolean;
}

/** Plan pricing info for pricing page */
export interface PlanPricing {
  plan: Plan;
  name: string;
  description: string;
  monthlyPrice: number; // in INR
  yearlyPrice: number; // in INR (annual, per month)
  limits: PlanLimits;
  features: string[];
  isPopular: boolean;
}

/** All plan pricings */
export const PLAN_PRICING: PlanPricing[] = [
  {
    plan: Plan.FREE,
    name: 'Free',
    description: 'Perfect for trying out Unite Attendance',
    monthlyPrice: 0,
    yearlyPrice: 0,
    limits: {
      maxMembers: 25,
      maxBranches: 1,
      maxAdmins: 1,
      qrRegenPerMonth: 5,
      csvExport: false,
      pdfExport: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
    },
    features: [
      'Up to 25 members',
      '1 branch',
      'QR-based attendance',
      'Basic dashboard',
      'Email support',
    ],
    isPopular: false,
  },
  {
    plan: Plan.STARTER,
    name: 'Starter',
    description: 'For growing teams and small organizations',
    monthlyPrice: 499,
    yearlyPrice: 399,
    limits: {
      maxMembers: 100,
      maxBranches: 3,
      maxAdmins: 3,
      qrRegenPerMonth: 50,
      csvExport: true,
      pdfExport: false,
      customBranding: false,
      apiAccess: false,
      prioritySupport: false,
    },
    features: [
      'Up to 100 members',
      '3 branches',
      'CSV export',
      'Attendance rules engine',
      'Department management',
      'Email support',
    ],
    isPopular: false,
  },
  {
    plan: Plan.PRO,
    name: 'Pro',
    description: 'For established organizations needing full control',
    monthlyPrice: 999,
    yearlyPrice: 799,
    limits: {
      maxMembers: 500,
      maxBranches: 10,
      maxAdmins: 10,
      qrRegenPerMonth: -1,
      csvExport: true,
      pdfExport: true,
      customBranding: true,
      apiAccess: false,
      prioritySupport: true,
    },
    features: [
      'Up to 500 members',
      '10 branches',
      'CSV + PDF export',
      'GPS geo-fencing',
      'Custom branding',
      'Advanced reports',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    plan: Plan.ENTERPRISE,
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    monthlyPrice: 2499,
    yearlyPrice: 1999,
    limits: {
      maxMembers: -1,
      maxBranches: -1,
      maxAdmins: -1,
      qrRegenPerMonth: -1,
      csvExport: true,
      pdfExport: true,
      customBranding: true,
      apiAccess: true,
      prioritySupport: true,
    },
    features: [
      'Unlimited members',
      'Unlimited branches',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'On-premise option',
    ],
    isPopular: false,
  },
];

/** Create subscription request */
export interface CreateSubscriptionRequest {
  plan: Plan;
  billingCycle: 'monthly' | 'yearly';
}

/** Razorpay webhook event payload */
export interface RazorpayWebhookPayload {
  event: string;
  payload: {
    subscription?: {
      entity: {
        id: string;
        plan_id: string;
        status: string;
        current_start: number;
        current_end: number;
      };
    };
    payment?: {
      entity: {
        id: string;
        amount: number;
        currency: string;
        status: string;
        method: string;
      };
    };
  };
}
