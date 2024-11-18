import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PersistenceModule } from '@/shared/persistence/persistence.module';
import { UserRepository } from '@/api/user/user.repository';

@Module({
  imports: [PersistenceModule],
  providers: [UserResolver, UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
