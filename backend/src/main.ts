/**
 * Point d'entrée du serveur NestJS.
 * Configure CORS (autorise le frontend), la validation des DTO,
 * Swagger (documentation) et le port d'écoute.
 */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Autorise le frontend React (Vite) à appeler l'API depuis le navigateur
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Valide automatiquement les données reçues (DTO + class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // supprime les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // rejette la requête si champ inconnu
      transform: true,           // convertit les types (ex: string → number)
    }),
  );

  // Documentation interactive : http://localhost:3001/api
  const config = new DocumentBuilder()
    .setTitle('Kaay Niou Diang API')
    .setDescription('API E-learning')
    .setVersion('1.0')
    .addBearerAuth() // bouton "Authorize" pour tester avec un token JWT
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  try {
    await app.listen(port);
  } catch (err: unknown) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === 'EADDRINUSE') {
      console.error(
        `\n❌ Le port ${port} est déjà utilisé (backend déjà lancé ?).\n` +
          `   → Fermez l'autre terminal, ou exécutez : npm run port:free\n` +
          `   → Puis relancez : npm run start:dev\n`,
      );
    }
    throw err;
  }
}
bootstrap();
