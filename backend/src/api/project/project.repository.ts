import {
  Project,
  ProjectsWithPagination,
} from '@/api/project/entities/project.entity';
import { taskStatusTable } from '@/shared/persistence/drizzle/schemas/task-status.schema';
import { Injectable } from '@nestjs/common';
import { projectsTable } from '@/shared/persistence/drizzle/schemas/project.schema';
import { BaseDatabaseService } from '@/shared/persistence/base-database.service';
import { DrizzleService } from '@/shared/persistence/drizzle/drizzle.service';
import { DatabaseTableName } from '@/shared/persistence/drizzle/schemas';
import { CommonCreateMutationResponse } from '@/shared/models/common-response.model';

@Injectable()
export class ProjectRepository extends BaseDatabaseService<Project> {
  constructor(public readonly drizzleService: DrizzleService) {
    super(drizzleService, DatabaseTableName.projects);
  }

  async createProject(
    data: Partial<Project>,
  ): Promise<CommonCreateMutationResponse> {
    return this.createOne(data);
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

  // async getAllWithPagination(
  //   page: number,
  //   limit: number,
  //   fields: string[],
  // ): Promise<ProjectsWithPagination> {
  //   const _limit = limit || 10;
  //   const _page = page || 1;
  //   const _offset = (_page - 1) * _limit;
  //
  //   const result = await this.drizzleService.drizzle
  //     .select({
  //       id: projectsTable.id,
  //       title: projectsTable.title,
  //       shortDescription: projectsTable.shortDescription,
  //       isActive: projectsTable.isActive,
  //       createdAt: projectsTable.createdAt,
  //       updatedAt: projectsTable.updatedAt,
  //     })
  //     .from(projectsTable)
  //     .limit(_limit)
  //     .offset(_offset)
  //     .orderBy(projectsTable.createdAt);
  //
  //   return {
  //     nodes: result,
  //     meta: {
  //       totalCount: result.length,
  //       currentPage: _page,
  //       hasNextPage: result.length > _limit,
  //       totalPages: Math.ceil(result.length / _limit),
  //     },
  //   };
  // }
}
