import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OrdersController } from "./orders.controller";
import { DriverHttpService } from "./providers/DriverHttpService";
import { OrdersSchema } from "./schemas/orders.schema";
import { ChangeStatusOrderService } from "./services/ChangeStatusOrderService";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Orders',
        schema: OrdersSchema
      }
    ]),
  ],
  providers: [
    DriverHttpService,
    ChangeStatusOrderService
  ],
  exports: [],
  controllers: [
    OrdersController
  ]
})
export class OrdersModule {}