import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { DrizzleModule } from '@/shared/persistence/drizzle/drizzle.module';
import { ProjectRepository } from '@/api/project/project.repository';

@Module({
  imports: [DrizzleModule],
  providers: [ProjectResolver, ProjectService, ProjectRepository],
})
export class ProjectModule {}
