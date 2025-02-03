import { S3_CAMPAIGN_UPLOAD_BUCKET, S3_TEMP_BUCKET } from '~/env';

export const S3_BUCKET_FOLDER = {
  EMAIl_ATTACHMENT: 'email-attachment',
} as const;

export const S3_BUCKETS = {
  CAMPAIGN_UPLOAD_BUCKET: S3_CAMPAIGN_UPLOAD_BUCKET,
  TEMP: S3_TEMP_BUCKET,
} as const;
