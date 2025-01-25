import { decryptUsingKeyIv, encryptUsingKeyIv } from '.';
import { Encryption } from '../campaign-app';

type Data = { [key: string]: Data | string };

export const encryptDescryptJsonUsingKeyIv = (
  obj: Data,
  encryption: Encryption,
  isEncrypt = true
) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      obj[key] = encryptDescryptJsonUsingKeyIv(obj[key], encryption, isEncrypt);
    } else if (typeof obj[key] === 'string') {
      obj[key] = isEncrypt
        ? encryptUsingKeyIv(obj[key], encryption)
        : decryptUsingKeyIv(obj[key], encryption);
    }
  }
  return obj;
};
