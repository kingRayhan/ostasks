import { PersistentRepository } from '@/shared/persistence/persistentRepository';
import { User } from '@/api/user/entities/user.entity';
import { DatabaseTableName } from '@/shared/persistence/drizzle/schemas';
import { DrizzleService } from '@/shared/persistence/drizzle/drizzle.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends PersistentRepository<User> {
  constructor(drizzleService: DrizzleService) {
    super(drizzleService, DatabaseTableName.users);
  }

  test() {
    // this.executeSQL('SELECT * FROM users WHERE email = $1', ['test@test.com']);

    this.createOne({
      email: 'xx',
    });
  }
}
