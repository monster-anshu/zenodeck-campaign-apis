import { extension } from '~/mime';

const generateRandomPath = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let path = '';
  for (let i = 0; i < 20; i++) {
    path += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return path;
};

export const getUploadPath = () => {
  const path = generateRandomPath();
  const pathStr = path.match(/.{1,4}/g)?.join('/') || '';
  return pathStr + '/';
};

export const correctFileName = (fileNameWoExt: string) => {
  return fileNameWoExt.replace(/\W/g, '_').replace(/_{2,}/g, '_');
};

export type FILE_TYPE = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'FILE' | 'ANIMATION';

export const getMimeToFileType = (mime: string): FILE_TYPE => {
  if (['image/gif'].includes(mime)) {
    return 'ANIMATION';
  }
  if (mime.match(/^image\//)) {
    return 'IMAGE';
  }
  if (mime.match(/^video\//)) {
    return 'VIDEO';
  }
  if (mime.match(/^audio\//)) {
    return 'AUDIO';
  }
  return 'FILE';
};

export const getRandomFilePath = ({
  fileName,
  appId,
  mimeType,
  ext,
  prependKey,
}: {
  fileName: string;
  appId: string;
  mimeType?: string;
  ext?: string;
  prependKey?: string;
}) => {
  const finalExtenstion = ext ? ext : extension(mimeType);
  let finalFileName = Date.now() + '';
  if (fileName) {
    const fileNameWoExt = fileName.substring(0, fileName.lastIndexOf('.'));
    finalFileName += '/' + correctFileName(fileNameWoExt);
  }
  let Key = appId + '/';
  const processedPrependKey = prependKey
    ? prependKey.replace(/^\/+|\/+$/g, '')
    : '';
  if (processedPrependKey) {
    Key += processedPrependKey + '/';
  }
  Key += getUploadPath() + finalFileName + '.' + finalExtenstion;
  return {
    Key,
  };
};
