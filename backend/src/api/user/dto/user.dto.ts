import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  passwordConfirmation: string;
}

@InputType()
export class LoginInput {
  @Field(() => String, { description: 'Username or email' })
  identifier: string;

  @Field(() => String)
  password: string;
}

@InputType()
export class ForgotPasswordInput {
  @Field(() => String, { description: 'Username or email' })
  email: string;
}

@InputType()
export class ResetPasswordInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  resetToken: string;

  @Field(() => String)
  newPassword: string;

  @Field(() => String)
  confirmPassword: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  oldPassword: string;

  @Field(() => String)
  newPassword: string;

  @Field(() => String)
  confirmPassword: string;
}
