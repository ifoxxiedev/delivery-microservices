import mongoose from "mongoose";
import { OrderStatus } from "../schemas/orders.schema";

export interface IOrdersDocument extends mongoose.Document {
  driver_name: string
  order_id: string
  location_id: number
  location_geo: number[],
  status: OrderStatus
}
export interface IOrdersModel extends mongoose.Model<IOrdersDocument> {}