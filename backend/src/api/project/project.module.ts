import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { DrizzleModule } from '../../shared/drizzle/drizzle.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [DrizzleModule],
})
export class ProjectModule {}
