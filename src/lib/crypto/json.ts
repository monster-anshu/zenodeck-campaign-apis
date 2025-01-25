import { decryptUsingKeyIv, encryptUsingKeyIv } from '.';
import { Encryption } from '../campaign-app';

type Data = { [key: string]: Data | string };

export const encryptDescryptJsonUsingKeyIv = <T extends Data>(
  obj: T,
  encryption: Encryption,
  isEncrypt = true
) => {
  const result = {} as T;
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = encryptDescryptJsonUsingKeyIv(
        obj[key],
        encryption,
        isEncrypt
      );
    } else if (typeof obj[key] === 'string') {
      result[key] = (
        isEncrypt
          ? encryptUsingKeyIv(obj[key], encryption)
          : decryptUsingKeyIv(obj[key], encryption)
      ) as T[typeof key];
    } else {
      result[key] = obj[key];
    }
  }
  return result;
};
