import { Project } from '@/api/project/entities/project.entity';
import { PersistentRepository } from '@/shared/persistence/persistentRepository';
import { DrizzleService } from '@/shared/persistence/drizzle/drizzle.service';
import { DatabaseTableName } from '@/shared/persistence/drizzle/schemas';
import { taskStatusTable } from '@/shared/persistence/drizzle/schemas/task-status.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectRepository extends PersistentRepository<Project> {
  constructor(public readonly drizzleService: DrizzleService) {
    super(drizzleService, DatabaseTableName.projects);
  }

  async createDefaultTaskStatusesForProject(projectId: string) {
    await this.drizzleService.drizzle.insert(taskStatusTable).values([
      {
        name: 'Backlog',
        projectId,
        index: 0,
      },
      {
        name: 'Todo',
        projectId,
        index: 1,
      },

      {
        name: 'In Progress',
        projectId,
        index: 2,
      },

      {
        name: 'In Review',
        projectId,
        index: 3,
      },
      {
        name: 'In review',
        projectId,
        index: 4,
      },
      {
        name: 'Done',
        projectId,
        index: 5,
      },
    ]);
  }
}
