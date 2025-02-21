import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const FileSchema = new Schema({
  appId: {
    required: true,
    type: Schema.Types.ObjectId,
  },
  bucket: {
    type: String,
  },
  bucketKey: {
    type: String,
  },
  contentType: {
    type: String,
  },
  name: {
    type: String,
  },
  size: {
    type: Number,
  },
});

const FileSchemaName = 'file';
export const FileModel = MONGO_CONNECTION.DEFAULT.model(
  FileSchemaName,
  FileSchema
);

export type FileType = InferSchemaType<typeof FileSchema>;
