
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
    // Charge les variables du fichier .env (DB_HOST, JWT_ACCESS_SECRET, etc.)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Connexion MySQL via TypeORM — toutes les infos viennent du .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: envRequired(configService, 'DB_HOST'),
        port: envRequiredNumber(configService, 'DB_PORT'),
        username: envRequired(configService, 'DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: envRequired(configService, 'DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // crée/met à jour les tables automatiquement (dev uniquement)
      }),
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