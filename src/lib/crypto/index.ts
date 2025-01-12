import * as crypto from 'node:crypto';
import { ENCRYPTION_IV, ENCRYPTION_KEY } from '~/env';

const algorithm = 'aes256';

const key = Buffer.from(ENCRYPTION_KEY);
const iv = Buffer.from(ENCRYPTION_IV);

export const encryptUsingKeyIv = (
  text: string,
  {
    key,
    iv,
  }: {
    key: Buffer;
    iv: Buffer;
  }
) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  return cipher.update(text, 'utf8', 'base64') + cipher.final('base64');
};

export const decryptUsingKeyIv = (
  encryptedText: string,
  {
    key,
    iv,
  }: {
    key: Buffer;
    iv: Buffer;
  }
) => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  return (
    decipher.update(encryptedText, 'base64', 'utf8') + decipher.final('utf8')
  );
};

export const encrypt = (text: string) => {
  return encryptUsingKeyIv(text, { key, iv });
};

export const decrypt = (encryptedText: string) => {
  return decryptUsingKeyIv(encryptedText, { key, iv });
};
