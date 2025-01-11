import { Module } from '@nestjs/common';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { InternalModule } from '~/internal/internal.module';

@Module({
  imports: [InternalModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
