import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AiModule } from './ai/ai.module';
import { CertificatesModule } from './certificates/certificates.module';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { CoursesModule } from './courses/courses.module';
import { SeedModule } from './seed/seed.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StatsModule } from './stats/stats.module';
import { envRequired, envRequiredNumber } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbUrl = configService.get<string>('DATABASE_URL');

        // Mode Production (Aiven)
        if (dbUrl) {
          return {
            type: 'mysql',
            url: dbUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: false, // Sécurité : ne jamais synchroniser en prod
            ssl: { rejectUnauthorized: false },
          };
        }

        // Mode Développement (Local)
        return {
          type: 'mysql',
          host: envRequired(configService, 'DB_HOST'),
          port: envRequiredNumber(configService, 'DB_PORT'),
          username: envRequired(configService, 'DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD') ?? '',
          database: envRequired(configService, 'DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProgressModule,
    CertificatesModule,
    AiModule,
    BooksModule,
    CoursesModule,
    SeedModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}