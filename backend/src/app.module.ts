import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: '',
  database: 'elearning',
  autoLoadEntities: true,
  synchronize: true,
}),

    AuthModule,

    UsersModule,

    ProgressModule,

    CertificatesModule,

    AiModule,
  ],
})
export class AppModule {}