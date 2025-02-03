import { deleteTempFile } from '..';

export const deleteFile = async ({
  appId,
  key,
}: {
  appId: string;
  key: string;
}) => {
  if (!key.startsWith(appId)) {
    return false;
  }

  await deleteTempFile({
    key,
  });

  return true;
};
