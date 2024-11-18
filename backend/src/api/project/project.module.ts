import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { ProjectRepository } from '@/api/project/project.repository';
import { PersistenceModule } from '@/shared/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  providers: [ProjectResolver, ProjectService, ProjectRepository],
})
export class ProjectModule {}
