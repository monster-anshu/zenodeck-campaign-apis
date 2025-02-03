import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AgentGuard } from '~/agent/agent.guard';
import { GetSession } from '~/session/session.decorator';
import { DeleteFileDto, UploadFileDto } from './file.dto';
import { FileService } from './file.service';

@UseGuards(AgentGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  async uploadFile(
    @GetSession('appId') appId: string,
    @Body() body: UploadFileDto
  ) {
    const res = await this.fileService.getSignedUrl(appId, body);
    return {
      isSuccess: true,
      ...res,
    };
  }

  @Delete()
  async deleteFile(
    @GetSession('appId') appId: string,
    @Body() body: DeleteFileDto
  ) {
    const res = await this.fileService.delete(appId, body);
    return {
      isSuccess: res,
    };
  }
}
