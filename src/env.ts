import 'dotenv/config';

export const PORT = +(process.env.PORT || 3000);
export const STAGE = process.env.STAGE as string;

export const CAMPAIGN_APP_API_KEY = process.env.CAMPAIGN_APP_API_KEY as string;
export const MONGO_DEFAULT_URI = process.env.MONGO_DEFAULT_URI as string;
export const MONGO_COMMON_URI = process.env.MONGO_COMMON_URI as string;

export const ENCRYPTION_IV = process.env.ENCRYPTION_IV as string;
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

export const SESSION_JWT_SECRET = process.env.SESSION_JWT_SECRET as string;
export const ROOT_DOMAIN = process.env.ROOT_DOMAIN as string;
export const USER_SERVICE_DOMAIN = 'accounts.' + ROOT_DOMAIN;

export const S3_HOST = process.env.S3_HOST as string;
export const S3_TEMP_BUCKET = process.env.S3_TEMP_BUCKET as string;
export const S3_CAMPAIGN_UPLOAD_BUCKET = process.env
  .S3_CAMPAIGN_UPLOAD_BUCKET as string;
