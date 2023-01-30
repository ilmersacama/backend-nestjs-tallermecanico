import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //añade validaciones automaticamente de decoradores en dto

  // app.enableCors({
  //   allowedHeaders: '*',
  //   origin: '*',
  //   credentials: true,
  // });

  app.enableCors({
    credentials: false,
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'Origin,X-Requested-With,Content-Type,Accept,Authorization,authorization,X-Forwarded-for',
    preflightContinue: false,
    optionsSuccessStatus: 200,
  });

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });

  // app.use((req, res, next) => {
  //   res.setHeader("Access-Control-Allow-Origin", "http://localhost:9000");
  //   res.setHeader('Access-Control-Allow-Credentials',true);
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });
  //app.useStaticAssets(join(__dirname, '..', 'uploads'));
  await app.listen(process.env.SERVER_PORT || 4000);
}
bootstrap();
