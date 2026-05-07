import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { startApplicationInsights } from './core/telemetry/application-insights';


async function bootstrap() {
  startApplicationInsights();
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(envs.PORT);
}
bootstrap();
