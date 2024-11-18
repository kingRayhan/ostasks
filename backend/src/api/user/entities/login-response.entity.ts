import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String, { nullable: true })
  refreshToken: string;

  @Field(() => String)
  tokenType: string;
}
