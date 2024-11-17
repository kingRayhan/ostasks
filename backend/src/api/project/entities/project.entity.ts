import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BuildPaginatedModel } from '@/shared/models/build-pagination-model';

@ObjectType()
export class Project {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  shortDescription: string;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => String, { nullable: true })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: Date;
}

@ObjectType()
export class ProjectsWithPagination extends BuildPaginatedModel(Project) {}
