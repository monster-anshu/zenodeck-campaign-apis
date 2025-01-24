import { Types } from 'mongoose';
import { z } from 'zod';

const MONGO_ID_REGEX = /^[0-9a-fA-F]{24}$/;
export const MongoIdZod = z
  .string()
  .regex(MONGO_ID_REGEX)
  .transform((id) => {
    return new Types.ObjectId(id).toString();
  });
