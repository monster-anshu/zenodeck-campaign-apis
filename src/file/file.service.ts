import { BadRequestException, Injectable } from '@nestjs/common';
import { deleteFile } from '~/lib/s3/file/delete';
import { getSignedUrl } from '~/lib/s3/file/upload';
import { DeleteFileDto, UploadFileDto } from './file.dto';

@Injectable()
export class FileService {
  async getSignedUrl(appId: string, body: UploadFileDto) {
    const res = await getSignedUrl({
      appId,
      mimeType: body.mimeType,
      fileName: body.fileName || '',
      module: body.module || '',
    });

    if (!res) {
      throw new BadRequestException('UNABLE_TO_CREATE_URL');
    }

    return res;
  }

  async delete(appId: string, body: DeleteFileDto) {
    const res = await deleteFile({
      appId,
      key: body.key,
    });

    return res;
  }
}
