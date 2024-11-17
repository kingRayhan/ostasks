import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  shortDescription: string;

  @Field(() => Boolean)
  isActive: boolean;
}
