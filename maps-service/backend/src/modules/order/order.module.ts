import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrdersSchema } from './schemas/orders.schema'

import { OrderController } from './order.controller'
import { NewOrderService } from './services/new-order.service'
import { CoordinatesService } from './services/coordinates.service'
import { OrderService } from './providers/order.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Orders',
        schema: OrdersSchema
      }
    ])
  ],
  controllers: [
    OrderController
  ],
  providers: [
    OrderService,
    NewOrderService,
    CoordinatesService
  ],
})
export class OrderModule {}
