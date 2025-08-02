// i am locked in
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // this is used to validate incoming requests(DTOs)
import * as cookieParser from 'cookie-parser'; // what this basically does that it attaches cookies to the request object(req.cookies?)
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://nitapp.vercel.app',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // this will remove any properties that are not in the DTO
      transform: true, // this will transform the incoming request to the DTO type (e.g. string to number , pretty cool)
    }),
  );
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
