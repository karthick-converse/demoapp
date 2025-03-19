import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Set EJS as view engine
  app.setViewEngine('ejs');
  
  // Set views folder
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  await app.listen(3000);
}
bootstrap();
