import { Controller, Get, Param } from '@nestjs/common';
import { OrderService } from './providers/order.service';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('/orders/:id')
  async fetchOrderById(@Param('id') id: string): Promise<any> {
    return this.orderService.fetchOrderById(id);
  }
}
