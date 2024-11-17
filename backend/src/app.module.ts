import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/database/database.module';
import { ProjectModule } from './api/project/project.module';

@Module({
  imports: [DatabaseModule, ProjectModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
