import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const UploadFileDtoZod = z.object({
  mimeType: z.string().trim().min(1),
  module: z.string().trim().optional(),
  fileName: z.string().trim().optional(),
});

const DeleteFileDtoZod = z.object({
  key: z.string().trim().min(1),
});

const PreviewFileDtoZod = z.object({
  key: z.string().trim().min(1),
  redirect: z.enum(['0', '1']).optional(),
});

export class PreviewFileDto extends createZodDto(PreviewFileDtoZod) {}
export class DeleteFileDto extends createZodDto(DeleteFileDtoZod) {}
export class UploadFileDto extends createZodDto(UploadFileDtoZod) {}
