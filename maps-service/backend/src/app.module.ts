import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

import { OrderModule } from './modules/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env'}),
    MongooseModule.forRoot(`mongodb+srv://teste-user:ThKjuFfVMdkr47SG@cluster0.jwdyi.mongodb.net/mapsdb?retryWrites=true&w=majority`, {
      useCreateIndex: true,
      autoIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }),
    OrderModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
