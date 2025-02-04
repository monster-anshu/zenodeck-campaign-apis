import { ObjectCannedACL, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { BadRequestException } from '@nestjs/common';
import { extension, extensionFromPath, types } from '~/mime';
import { S3_BUCKETS } from '../folders';
import { getRandomFilePath } from './utills';

const client = new S3Client({});

interface UploadSetting {
  bucket: string;
  maxFileSizeInMB?: number;
  folder?: string;
  acl?: ObjectCannedACL;
}

const moduleBucketMapping: Record<string, UploadSetting> = {
  default: {
    bucket: S3_BUCKETS.TEMP,
  },
};

const mimeTypeMap: Record<string, string> = {
  'application/x-zip-compressed': 'application/zip',
  'application/zip-compressed': 'application/zip',
};
const invalidMimeTypes = ['application/x-msdownload'];

export const getSignedUrl = async ({
  appId,
  mimeType,
  fileName,
  module = 'default',
}: {
  appId: string;
  mimeType: string;
  fileName: string;
  module?: string;
}) => {
  const finalMimeType = mimeTypeMap[mimeType] || mimeType;
  const ext = extensionFromPath(fileName) || extension(finalMimeType);
  if (
    !ext ||
    !types[ext as string] ||
    invalidMimeTypes.includes(finalMimeType)
  ) {
    throw new BadRequestException('INVALID_MIME_TYPE');
  }

  const bucketSetting = moduleBucketMapping[module];
  if (!bucketSetting) {
    throw new BadRequestException('INVALID_MODULE');
  }

  const { Key } = getRandomFilePath({
    appId,
    fileName,
    mimeType: finalMimeType,
    ext: ext as string,
    prependKey: bucketSetting.folder,
  });

  const { url, fields } = await createPresignedPost(client, {
    Bucket: bucketSetting.bucket,
    Key,
    Conditions: [
      [
        'content-length-range',
        0,
        (bucketSetting.maxFileSizeInMB || 5) * 1000000,
      ],
    ],
    Fields: {
      'Content-Type': finalMimeType,
      ...(bucketSetting.acl ? { acl: bucketSetting.acl } : {}),
    },
    Expires: 300,
  });

  return {
    url: url.replace(/\/$/, ''),
    fields,
  };
};
