import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonCreateMutationResponse {
  @Field(() => ID)
  id: string;
}
