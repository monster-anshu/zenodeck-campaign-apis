import 'dotenv/config';

export const PORT = +(process.env.PORT || 3000);
export const CAMPAIGN_APP_API_KEY = process.env.CAMPAIGN_APP_API_KEY as string;
export const MONGO_DEFAULT_URI = process.env.MONGO_DEFAULT_URI as string;
export const MONGO_COMMON_URI = process.env.MONGO_COMMON_URI as string;

export const ENCRYPTION_IV = process.env.ENCRYPTION_IV as string;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
