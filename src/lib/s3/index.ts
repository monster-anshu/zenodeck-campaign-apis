import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ObjectCannedACL,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { Types } from 'mongoose';
import { S3_HOST } from '~/env';
import { FileModel, FileType } from '~/mongo/campaign';
import { CampaignAppModel } from '../campaign-app';
import { S3_BUCKETS } from './folders';

export interface FileMeta {
  size?: number;
  contentType?: string;
  name?: string;
  bucket?: string;
  key?: string;
  duration?: number;
}

export const client = new S3Client({});

export const getS3FileBuffer = async ({
  bucket = S3_BUCKETS.CAMPAIGN_UPLOAD_BUCKET,
  key,
}: {
  bucket?: string;
  key: string;
}) => {
  const getCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const data = await client.send(getCommand);
  return data.Body;
};

export const getFileMeta = async ({
  bucket = S3_BUCKETS.CAMPAIGN_UPLOAD_BUCKET,
  key,
}: {
  bucket?: string;
  key: string;
}): Promise<FileMeta> => {
  const headCommand = new HeadObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  const data = await client.send(headCommand);
  return {
    size: data.ContentLength,
    contentType: data.ContentType,
    name: key.split('/').pop(),
    bucket,
    key,
  };
};

export const deleteTempFile = async ({ key }: { key: string }) => {
  const deleteComand = new DeleteObjectCommand({
    Bucket: S3_BUCKETS.TEMP,
    Key: key,
  });
  await client.send(deleteComand);
};

export const moveTempFileToAnotherBucket = async ({
  url,
  key,
  bucketToMove = S3_BUCKETS.CAMPAIGN_UPLOAD_BUCKET,
  bucketFolder,
  acl,
  addToCollection = true,
  appId,
}: {
  url?: string;
  key?: string;
  bucketToMove?: string;
  bucketFolder?: string;
  acl?: ObjectCannedACL;
  addToCollection?: boolean;
  appId: string;
}) => {
  if (!key && !url) {
    return {
      url,
      key,
    };
  }
  let sourceKey = key;
  const sourceBucket = S3_BUCKETS.TEMP;
  if (!sourceKey) {
    const urlWithoutProtocol = url?.replace(/^https?:\/\//, '') || '';
    sourceKey = urlWithoutProtocol
      .replace(`${S3_HOST}/${sourceBucket}/`, '')
      .replace(`${sourceBucket}.${S3_HOST}/`, '');
    if (sourceKey == urlWithoutProtocol) {
      return {
        url,
        key: sourceKey,
      };
    }
  }
  let destinationKey = sourceKey;
  if (bucketFolder) {
    if (!bucketFolder.endsWith('/')) {
      bucketFolder = bucketFolder + '/';
    }
    destinationKey = destinationKey.replace(
      new RegExp('^' + appId + '/'),
      appId + '/' + bucketFolder
    );
  }
  const copyCommand = new CopyObjectCommand({
    CopySource: sourceBucket + '/' + sourceKey,
    Bucket: bucketToMove,
    Key: destinationKey,
    ACL: acl || undefined,
  });
  await client.send(copyCommand);
  await deleteTempFile({ key: sourceKey });

  let fileMeta: FileMeta | undefined;
  if (addToCollection && appId) {
    const { fileMeta: meta } = await captureFile({
      appId: appId,
      bucket: bucketToMove as string,
      bucketKey: destinationKey,
    });
    fileMeta = meta;
  }
  return {
    url: 'https://' + S3_HOST + '/' + bucketToMove + '/' + destinationKey,
    key: destinationKey,
    fileMeta: fileMeta,
  };
};

export const createPresignedUrl = async ({
  bucket = S3_BUCKETS.CAMPAIGN_UPLOAD_BUCKET,
  key,
}: {
  bucket?: string;
  key: string;
}) => {
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn: 899 });
};

export const captureFile = async ({
  appId,
  bucket,
  bucketKey,
}: {
  appId: string;
  bucket: string;
  bucketKey: string;
}) => {
  ({ appId, bucket });
  const fileMeta = await getFileMeta({ key: bucketKey });
  const obj: Partial<FileType> = {
    appId: new Types.ObjectId(appId),
    bucket,
    bucketKey,
  };
  const data = await FileModel.updateOne(
    obj,
    {
      $setOnInsert: obj,
      $set: {
        size: fileMeta?.size,
        contentType: fileMeta?.contentType,
        name: fileMeta?.name,
      },
    },
    {
      upsert: true,
    }
  );
  if (data.upsertedCount) {
    await CampaignAppModel.updateOne(
      {
        _id: appId,
      },
      {
        $inc: {
          storageUsed: fileMeta.size,
        },
      }
    );
  }
  const file = await FileModel.findOne(obj).lean();
  return { fileMeta, file };
};
