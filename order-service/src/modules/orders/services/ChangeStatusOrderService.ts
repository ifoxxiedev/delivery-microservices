import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import RabbitMQWrapper from '../../../events/rabbitmq-wrapper'
import { IOrdersModel } from "../interfaces/onders.interface";
import { OrderStatus } from "../schemas/orders.schema";

@Injectable()
export class ChangeStatusOrderService {
  constructor(@InjectModel('Orders') private readonly orders: IOrdersModel) {
    this.startListener()
  }

  startListener() {
    RabbitMQWrapper.consume('orders', async (msg, ch) => {
      try {
        const { order } = JSON.parse(msg.content.toString())
        console.log('Change sttus for order ', order)
        await this.orders.findByIdAndUpdate(order, { status: OrderStatus.DONE })
        ch.ack(msg)
      } catch(err) {
        console.log(err)
      }
    })
  }
}