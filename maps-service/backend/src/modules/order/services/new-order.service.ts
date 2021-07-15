import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import rabbitmqWrapper from 'src/events/rabbitmq-wrapper';
import { IOrdersModel } from '../interfaces/onders.interface';
import { OrderStatus } from '../schemas/orders.schema';

@Injectable()
export class NewOrderService {
  constructor( @InjectModel('Orders') private readonly orders: IOrdersModel) {
    this.startListener()
  }

  startListener() {
    rabbitmqWrapper.consume('mappings',  async (msg, ch) => {
      try {
        const payload = JSON.parse(msg.content.toString())
        await this.orders.create({
          order_id: payload.order,
          driver_name: payload.driver_name,
          location_id: payload.location_id * 1,
          location_geo: payload.dst,
          status: payload.status
        })
        ch.ack(msg)
      } catch(err) {
        console.log('Error', err)
      }
    })
  }
}
