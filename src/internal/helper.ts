// import dayjs from '~/lib/dayjs';
// import AddonsModel from '~/mongo/common/schema/Addons';
// import CompanyProductModel from '~/mongo/common/schema/CompanyProduct';
// import PackageModel from '~/mongo/common/schema/Package';
// import { Addons, BillingFrequency } from '~/mongo/common/types';

// export async function getCurrentPlan(companyId: string) {
//   const companyProduct = await CompanyProductModel.findOne({
//     companyId,
//     productId: 'BOOKINGS',
//     status: 'ACTIVE',
//   }).lean();
//   const currentPlan = companyProduct?.currentPlan;
//   if (!currentPlan) {
//     return null;
//   }
//   const {
//     packageId,
//     isTrialPlan,
//     billingFrequency,
//     paymentGateway,
//     isRecurring,
//     totalAmount,
//     addons = [],
//     billingDetails,
//     currencyCode,
//     startDate,
//     expiryDate: expiryDate1,
//     isAutoDowngraded,
//     downgradeInfo,
//   } = currentPlan;

//   const packageInfo = await PackageModel.findOne({
//     productId: 'CAMPAIGN',
//     _id: packageId,
//   }).lean();

//   const isFreemiumPackage =
//     !!currentPlan.isFreemiumPackage || packageInfo?.key == 'FREEMIUM';

//   const today = dayjs();
//   const expiryDate = isFreemiumPackage ? null : dayjs(expiryDate1);
//   // const isExpired = new Date().getTime() > expiryDate.getTime();
//   const isExpired = today.isAfter(expiryDate);
//   const showPayBtnDate = expiryDate?.subtract(10, 'day');

//   let isInGracePeriod = false;
//   let graceRemainingTime;
//   if (!isTrialPlan && isExpired) {
//     const gracePeriod = billingFrequency == BillingFrequency.ANNUAL ? 21 : 7;
//     const gracePeriodDate = expiryDate?.add(gracePeriod, 'day');
//     isInGracePeriod = gracePeriodDate?.isAfter(today) || false;
//     if (isInGracePeriod && gracePeriodDate) {
//       graceRemainingTime = gracePeriodDate.unix() - today.unix();
//     }
//   }
//   const showRenewal = showPayBtnDate?.isBefore(today);

//   const packageAddons = packageInfo?.addons || [];
//   const allAddons = [...packageAddons, ...addons];
//   const addonIds = allAddons.map((cur) => cur.addonId);
//   const addonsInfo = await AddonsModel.find({
//     productId: 'BOOKINGS',
//     _id: {
//       $in: addonIds,
//     },
//   }).lean();
//   const addonObj: Record<string, Addons> = {};
//   addonsInfo.forEach((cur) => {
//     addonObj[cur._id.toString()] = cur;
//   });
//   const features = packageInfo?.features || [];
//   const featureObj: CompanyFeatures = {};
//   features.forEach((cur) => {
//     featureObj[cur.feature] = {
//       quantity: cur.quantity,
//       type: 'FEATURE',
//     };
//   });
//   allAddons.forEach((cur) => {
//     const addOnInfo = addonObj[cur.addonId.toString()];
//     const type = addOnInfo?.type;
//     if (!type) return;

//     if (!featureObj[type]) {
//       featureObj[type] = { quantity: 0, type: 'ADDON' };
//     }

//     const feature = featureObj[type];

//     if (!feature) return;

//     if (type == 'STORAGE') {
//       feature.quantity =
//         (feature.quantity || 0) +
//         (addOnInfo?.configuration?.storageAmount || 0);
//     } else {
//       feature.quantity =
//         (featureObj[type]?.quantity || 0) + (cur.quantity || 0);
//     }
//   });
//   return {
//     packageId,
//     isTrialPlan: isTrialPlan && !isFreemiumPackage,
//     isFreemiumPackage: isFreemiumPackage,
//     billingFrequency,
//     paymentGateway,
//     isRecurring,
//     totalAmount,
//     addons,
//     packageAddons,
//     billingDetails,
//     currencyCode,
//     startDate,
//     expiryDate: expiryDate?.toDate(),
//     featureObj,
//     isExpired,
//     isInGracePeriod,
//     showRenewal,
//     remainingTime: isExpired
//       ? 0
//       : expiryDate
//         ? expiryDate.unix() - today.unix()
//         : 0,
//     graceRemainingTime,
//     packageInfo: {
//       key: packageInfo?.key,
//       displayName: packageInfo?.displayName,
//       packageType: packageInfo?.packageType,
//     },
//     isAutoDowngraded,
//     isTrialTaken: companyProduct.isTrialTaken,
//     downgradeInfo,
//   };
// }
