import { InferSchemaType, Schema } from 'mongoose';
import { MONGO_CONNECTION } from '../connections';

const FileSchema = new Schema({
  appId: { type: Schema.Types.ObjectId, required: true },
  bucket: { type: String },
  bucketKey: { type: String },
  size: { type: Number },
  contentType: { type: String },
  name: { type: String },
});

export type FileType = InferSchemaType<typeof FileSchema>;
export const FileModel = MONGO_CONNECTION.DEFAULT.model('File', FileSchema);
