import { Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { ProjectRepository } from '@/api/project/project.repository';
import { CommonCreateMutationResponse } from '@/shared/models/common-response.model';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async createProject(
    input: CreateProjectInput,
  ): Promise<CommonCreateMutationResponse> {
    // create project
    const project = await this.projectRepository.createOne(input);

    // project task status
    const projectId = project.id;
    await this.projectRepository.createDefaultTaskStatusesForProject(projectId);

    return project;
  }
}
