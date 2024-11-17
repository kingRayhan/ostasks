import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

export const DRIZZLE_PROVIDER_TOKEN = Symbol('DRIZZLE_PROVIDER_TOKEN');

@Module({
  providers: [
    {
      provide: DRIZZLE_PROVIDER_TOKEN,
      useFactory: () => {
        return drizzle('postgresql://rayhan:rayhan123@localhost:5432/ostasks', {
          schema,
        });
      },
    },
  ],
})
export class DrizzleModule {}
