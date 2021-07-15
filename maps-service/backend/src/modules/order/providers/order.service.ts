import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrdersModel } from '../interfaces/onders.interface'

@Injectable()
export class OrderService {
  constructor(@InjectModel('Orders') private readonly  orders: IOrdersModel) {
  }

  fetchOrderById(id: string) {
    return this.orders.findOne({ order_id: id })
  }

}
