import { ValidationPipe, Logger } from '@nestjs/common'; // Ajout de Logger
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap'); // Initialisation du logger

  // Autorise le frontend Vercel et le localhost
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://e-learning-dtux.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Kaay Niou Diang API')
    .setDescription('API E-learning')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Correction : Utilisez 3000 comme défaut pour le local
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  logger.log(`Application is running on: ${await app.getUrl()}`);
}

// Ajout d'un catch pour voir les erreurs de démarrage dans les logs de Render
bootstrap().catch((err) => {
  console.error('Erreur fatale au démarrage :', err);
  process.exit(1);
});