import { Project } from '@/api/project/entities/project.entity';
import { PersistentRepository } from '@/shared/persistence/persistentRepository';
import { DatabaseTableName } from '@/shared/persistence/drizzle/schemas';
import { Injectable } from '@nestjs/common';
import { PersistentDriverService } from '@/shared/persistence/persistent-driver.service';

@Injectable()
export class ProjectRepository extends PersistentRepository<Project> {
  constructor(
    public readonly persistentDriver: PersistentDriverService<Project>,
  ) {
    super(DatabaseTableName.projects, persistentDriver);
  }

  async createDefaultTaskStatusesForProject(projectId: string) {
    // await this.persistentDriver.drizzle.insert(taskStatusTable).values([
    //   {
    //     name: 'Backlog',
    //     projectId,
    //     index: 0,
    //   },
    //   {
    //     name: 'Todo',
    //     projectId,
    //     index: 1,
    //   },
    //
    //   {
    //     name: 'In Progress',
    //     projectId,
    //     index: 2,
    //   },
    //
    //   {
    //     name: 'In Review',
    //     projectId,
    //     index: 3,
    //   },
    //   {
    //     name: 'In review',
    //     projectId,
    //     index: 4,
    //   },
    //   {
    //     name: 'Done',
    //     projectId,
    //     index: 5,
    //   },
    // ]);
  }
}
