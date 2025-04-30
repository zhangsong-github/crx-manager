import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  // app.setGlobalPrefix('api');
  await app.listen(port);
  console.log(`Server is running at http://localhost:${port}`);
}
bootstrap();
