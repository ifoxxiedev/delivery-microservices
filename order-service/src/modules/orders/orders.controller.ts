import { Controller, Get, Post, Redirect, Render, Req } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IOrdersModel } from "./interfaces/onders.interface";
import { DriverHttpService } from "./providers/DriverHttpService";

import RabbitMQWrapper from '../../events/rabbitmq-wrapper'
import { OrderStatus } from "./schemas/orders.schema";

@Controller('orders')
export class OrdersController {
  constructor(
    @InjectModel('Orders') private readonly orders: IOrdersModel,
    private readonly driverService: DriverHttpService
  ) {}

  @Get()
  @Render('order/index')
  async index() {
    const orders = await this.orders.find({}).sort({ created_at: -1 }).exec()
    return { 
      data: orders.map((order) => ({
        locationGeo: order.location_geo,
        id: order._id,
        driverId: order.driver_id,
        driverName: order.driver_name,
        locationId: order.location_id,
        status: order.status
      }))
    }
  }

  @Get('/create')
  @Render('order/create')
  async createOrderForm() {
    const drivers = await this.driverService.fetchAllDrivers()
    return { 
      data:  {
        drivers
      }
    }
  }

  @Post()
  @Redirect('orders')
  async createOrder(@Req() request) {
    const { driver, location } = request.body
    const [driverUUID, driverName] = driver.split(',')
    const [location_id, coords] = location.split('/')
    const [lat, long] = coords.split(',')

    const order = await this.orders.create({
      driver_id: driverUUID,
      driver_name: driverName,
      location_id: location_id,
      location_geo: [Number(lat), Number(long)],
      status: OrderStatus.PENDING
    })

    await RabbitMQWrapper.publishToExchange(
      'amq.direct',
      'orders_pk', 
      {
        id: location_id,
        driver_name: driverName,
        dst: order.location_geo,
        location_id,
        location_geo: order.location_geo,
        order: order.id,
        destination: location_id,
        status: OrderStatus.PENDING
      }
    )
    console.log(request.body)
  }
}