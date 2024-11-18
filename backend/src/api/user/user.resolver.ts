import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { LoginInput, RegisterInput } from '@/api/user/dto/user.dto';
import { ForbiddenException } from '@nestjs/common';
import { CommonCreateMutationResponse } from '@/shared/models/common-response.model';
import { LoginResponse } from '@/api/user/entities/login-response.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async me() {
    return {};
  }

  @Mutation(() => CommonCreateMutationResponse)
  async register(@Args('input') input: RegisterInput) {
    try {
      return this.userService.signupUser(input);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput) {
    try {
      return this.userService.loginUser(input);
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
