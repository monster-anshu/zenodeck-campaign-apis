import type { Types } from 'mongoose';

export interface User {
  _id?: string;
  firstName?: string;
  lastName?: string;
  emailId: string;
  emailVerified?: boolean;
  emailVerifiedTstamp?: Date;
  countryCode?: string;
  mobileNo?: string;
  password?: string;
  status?: 'ACTIVE' | 'UNVERIFIED';
  timezone?: string;
}

export interface Addons {
  _id?: string;
  key: string;
  displayName?: string;
  type?: string;
  status?: string;
  productId: Product;
  price: {
    annual: {
      inr: number;
      usd: number;
    };
    monthly: {
      inr: number;
      usd: number;
    };
  };
  configuration: {
    storageAmount?: number;
    agentCount?: number;
  };
  packageIds: [Types.ObjectId];
}

export interface Package {
  _id?: string;
  key?: string;
  productId: Product;
  displayName?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  price?: {
    annual: {
      inr: number;
      usd: number;
    };
    monthly: {
      inr: number;
      usd: number;
    };
  };
  addons?: {
    addonId: string;
    quantity: number;
  }[];
  features?: { feature: string; quantity: number }[];
  isDefaultPackage?: boolean;
}

export interface CurrentPlanAddon {
  addonId: Types.ObjectId;
  quantity: number;
  type: string;
}

export interface CurrentPlan {
  packageId: Types.ObjectId;
  packagePrice: number;
  addons?: CurrentPlanAddon[];
  billingFrequency: BillingFrequency;
  startDate: Date;
  expiryDate: Date;
  billingDetails: BiilingDetail;
  paymentGateway: 'PAYPAL' | 'RAZORPAY' | 'PHONEPE';
  currencyCode: 'INR' | 'USD';
  isRecurring: boolean;
  subscriptionId?: string;
  totalAmount: number;
  isTrialPlan: boolean;
  isStopped: boolean;
  isFreemiumPackage?: boolean;
  isAutoDowngraded?: boolean;
  downgradeInfo?: {
    packageId: Types.ObjectId;
    startDate: Date;
    expiryDate: Date;
    isTrialPlan: boolean;
  };
}

export enum BillingFrequency {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export interface BiilingDetail {
  name: string;
  phoneNumber: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  taxNumber: string;
}

export interface CompanyProduct {
  _id?: string;
  companyId: Types.ObjectId;
  productId: Product;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  currentPlan: CurrentPlan;
}

export interface Company {
  companyName: string;
  companyLogo: string;
  primaryUserId: Types.ObjectId;
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}

export enum Product {
  CHAT_APP = 'CHAT_APP',
}
export interface CompanyUserPermission {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  products: Product[];
  role: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'DELETED';
}
