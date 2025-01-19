import { Schema } from 'mongoose';
import { MONGO_CONNECTION } from '~/mongo/connections';
import {
  BiilingDetail,
  BillingFrequency,
  CompanyProduct,
  CurrentPlan,
  CurrentPlanAddon,
} from '../types';
import CompanyModel from './Company';

export const BillingDetailSchema = new Schema<BiilingDetail>(
  {
    name: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    postalCode: { type: String },
    taxNumber: { type: String },
  },
  {
    _id: false,
  }
);

const CurrentPlanAddonSchema = new Schema<CurrentPlanAddon>(
  {
    addonId: Schema.Types.ObjectId,
    quantity: Number,
    type: String,
  },
  {
    timestamps: true,
  }
);

const CurrentPlanSchema = new Schema<CurrentPlan>(
  {
    packageId: { type: Schema.Types.ObjectId },
    packagePrice: Number,
    addons: [CurrentPlanAddonSchema],
    billingFrequency: {
      type: String,
      enum: Object.values(BillingFrequency),
    },
    startDate: { type: Date },
    expiryDate: { type: Date },
    billingDetails: BillingDetailSchema,
    paymentGateway: String,
    currencyCode: { type: String, enum: ['INR', 'USD'] },
    isRecurring: Boolean,
    subscriptionId: String,
    totalAmount: { type: Number },
    isTrialPlan: Boolean,
    isStopped: Boolean,
    isFreemiumPackage: Boolean,
    isAutoDowngraded: Boolean,
    downgradeInfo: {
      packageId: Schema.Types.ObjectId,
      startDate: Date,
      expiryDate: Date,
      isTrialPlan: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyProductSchema = new Schema<CompanyProduct>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: CompanyModel,
    },
    productId: { type: String },
    status: { type: String, default: 'ACTIVE' },
    currentPlan: CurrentPlanSchema,
  },
  {
    timestamps: true,
  }
);

const CompanyProductModel = MONGO_CONNECTION.COMMON.model<CompanyProduct>(
  'CompanyProduct',
  CompanyProductSchema
);

export default CompanyProductModel;
