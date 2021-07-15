import * as path from 'path'

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import RabbitMQWrapper from './events/rabbitmq-wrapper'

import * as expressHbs from 'express-handlebars'
import * as handlebarsHelpers from 'handlebars-helpers'

async function bootstrap() {
  const port = 7102
  await RabbitMQWrapper.connect()
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configure handlebars to Nest.js
  const hbs = expressHbs.create({
    helpers: {
      ...handlebarsHelpers(),
      MICRO_MAPPING_URL: () => process.env.MICRO_MAPPING_URL
    },
    extname: '.hbs',
    defaultLayout: 'layout',
    partialsDir: [
      path.join(__dirname, '..', 'views')
    ]
  })
  
  app.engine('hbs', hbs.engine)
  app.setViewEngine('hbs')
  
  await app.listen(port, () => console.log(`Orders is running on ${port}`));
}
bootstrap().catch(console.log);
