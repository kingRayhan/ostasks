import { Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import {
  Project,
  ProjectsWithPagination,
} from '@/api/project/entities/project.entity';
import { ProjectRepository } from '@/api/project/project.repository';
import { CommonCreateMutationResponse } from '@/shared/models/common-response.model';
import { AppPaginationResponseDto } from '@/shared/persistence/persistence.contract';
import { CommonPaginationInput } from '@/shared/models/common-gql-pagination.input';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(
    input: CreateProjectInput,
  ): Promise<CommonCreateMutationResponse> {
    // create project
    const project = await this.projectRepository.createProject(input);

    // project task status
    // await this.projectRepository.createDefaultTaskStatusesForProject(
    //   project.id,
    // );

    return project;
  }

  // async findAllWithPagination(
  //   payload: CommonPaginationInput,
  // ): Promise<AppPaginationResponseDto<Project>> {
  //   return this.projectRepository.findAllWithPagination(payload);
  // }
}
