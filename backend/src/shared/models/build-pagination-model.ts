import { Type } from '@nestjs/common';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BuildPaginationModel {
  @Field(() => Number)
  totalCount: number;

  @Field(() => Number)
  currentPage: number;

  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => Number)
  totalPages: number;
}

export function BuildPaginatedModel<T>(classRef: Type<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    nodes: T[];

    @Field(() => BuildPaginationModel, { nullable: true })
    meta: BuildPaginationModel;
  }

  return PaginatedType;
}
