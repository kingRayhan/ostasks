import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BuildPaginatedModel } from '@/shared/models/build-pagination-model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  avatar: string;

  @Field(() => String, { nullable: true })
  username: string;

  password: string;
}

@ObjectType()
export class UsersWithPagination extends BuildPaginatedModel(User) {}
