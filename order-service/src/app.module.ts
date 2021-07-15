import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommandsModule } from './modules/commands/commands.module';

import { OrdersModule } from './modules/orders/orders.module';
import { OrdersSchema } from './modules/orders/schemas/orders.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(`mongodb+srv://teste-user:ThKjuFfVMdkr47SG@cluster0.jwdyi.mongodb.net/ordersdb?retryWrites=true&w=majority`, {
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    OrdersModule,
    CommandsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
