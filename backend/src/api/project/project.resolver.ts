import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { Project, ProjectsWithPagination } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { ForbiddenException } from '@nestjs/common';
import { CommonCreateMutationResponse } from '@/shared/models/common-response.model';
import { CommonPaginationInput } from '@/shared/models/common-gql-pagination.input';
import { ProjectRepository } from '@/api/project/project.repository';
import getGqlFields from '@/shared/utils/get-fields';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectRepository: ProjectRepository,
  ) {}

  @Mutation(() => CommonCreateMutationResponse)
  createProject(
    @Args('input') input: CreateProjectInput,
  ): Promise<CommonCreateMutationResponse> {
    try {
      return this.projectService.createProject(input);
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Query(() => ProjectsWithPagination, { name: 'projects' })
  findAll(
    @Args('input', { nullable: true }) input: CommonPaginationInput,
    @Info() info: any,
  ): Promise<ProjectsWithPagination> {
    try {
      return this.projectRepository.findAllWithPagination({
        ...input,
        columns: getGqlFields(info, 'nodes'),
      });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  // @Query(() => Project, { name: 'project' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.projectService.findOne(id);
  // }
  //
  // @Mutation(() => Project)
  // updateProject(@Args('updateProjectInput') updateProjectInput: UpdateProjectInput) {
  //   return this.projectService.update(updateProjectInput.id, updateProjectInput);
  // }
  //
  // @Mutation(() => Project)
  // removeProject(@Args('id', { type: () => Int }) id: number) {
  //   return this.projectService.remove(id);
  // }
}
