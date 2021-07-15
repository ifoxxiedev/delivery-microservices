import mongoose from "mongoose";
import { OrderStatus } from "../schemas/orders.schema";

export interface IOrdersDocument extends mongoose.Document {
  driver_id: number
  driver_name: string
  location_id: number
  location_geo: number[],
  status: OrderStatus
}
export interface IOrdersModel extends mongoose.Model<IOrdersDocument> {}