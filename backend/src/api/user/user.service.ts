import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as jsonwebtoken from 'jsonwebtoken';
import { UserRepository } from '@/api/user/user.repository';
import { LoginInput, RegisterInput } from '@/api/user/dto/user.dto';
import { LoginResponse } from '@/api/user/entities/login-response.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // signup
  async signupUser(payload: RegisterInput) {
    const userCountsWithEmail = await this.userRepository.findRowCount({
      filters: [{ key: 'email', operator: '=', value: payload.email }],
    });

    if (userCountsWithEmail > 0) {
      throw new ForbiddenException('User already exists');
    }

    const createdUser = await this.userRepository.createOne({
      ...payload,
      password: await this.hashPassword(payload.password),
    });

    // TODO: send email verification email

    return createdUser;
  }

  // login
  async loginUser(input: LoginInput): Promise<LoginResponse> {
    const filteredUsers = await this.userRepository.findRows({
      filters: [
        {
          or: [
            { key: 'email', operator: '=', value: input.identifier },
            { key: 'username', operator: '=', value: input.identifier },
          ],
        },
      ],
      columns: ['email', 'username', 'password'],
      orderBy: [{ key: 'id', direction: 'asc' }],
      limit: 1,
      offset: 0,
    });

    if (filteredUsers.length === 0) {
      throw new ForbiddenException('Invalid credentials');
    }

    const filteredUser = filteredUsers[0];

    if (!(await this.verifyPassword(filteredUser.password, input.password))) {
      throw new ForbiddenException('Invalid credentials');
    }

    return {
      accessToken: await this.generateToken(
        filteredUser.id,
        filteredUser.email,
      ),
      refreshToken: 'not-implemented-yet',
      tokenType: 'Bearer',
    };
  }

  // forgot password
  // reset password
  // me
  // update me

  // --------------------------------------------------------------------------------
  // Utils
  // --------------------------------------------------------------------------------
  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password, { type: argon2.argon2id });
  }

  async verifyPassword(hash: string, password: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async generateToken(sub: string, email: string): Promise<string> {
    // TODO: get secret from env
    return jsonwebtoken.sign({ sub, email }, 'secret', {
      expiresIn: '1h',
      algorithm: 'HS256',
    });
  }
}
