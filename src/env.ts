import 'dotenv/config';

export const PORT = +(process.env.PORT || 3000);
export const MONGO_DEFAULT_URI = process.env.MONGO_DEFAULT_URI as string;
export const MONGO_COMMON_URI = process.env.MONGO_COMMON_URI as string;
