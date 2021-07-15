import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import rabbitmqWrapper from 'src/events/rabbitmq-wrapper';
import { IOrdersModel } from '../interfaces/onders.interface';
import { OrderStatus } from '../schemas/orders.schema';

@Injectable()
@WebSocketGateway()
export class CoordinatesService {
  @WebSocketServer() 
  private readonly server: Server

  constructor(
    @InjectModel('Orders') private readonly  orders: IOrdersModel) {
    this.startListener()
  }

  startListener() {
    rabbitmqWrapper.consume('coordinates',  async (msg, ch) => {
      try {
        const { lat, long, order } = JSON.parse(msg.content.toString())
        this.server.emit(`order.${order.order}.new-position`, { 
          lat: parseFloat(lat),
          lng: parseFloat(long)
        })

        if (lat === 0 && long === 0) {
          await this.orders.updateOne(
            { order_id: order.order },
            { status: OrderStatus.DONE }
          )
          await rabbitmqWrapper.publish('orders', { order: order.order })
        }
      } catch(err) {
        console.log(err)
      } finally {
        ch.ack(msg)
      }
    })
  }
}


// 27:14 https://portal.code.education/lms/#/181/164/106/conteudos?capitulo=696&conteudo=6106