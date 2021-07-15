import { Schema } from 'mongoose'

export enum OrderStatus {
  PENDING='PENDIND',
  DONE='DONE'
}

export const OrdersSchema = new Schema({
  order_id: {
    type: String
  },

  driver_name: {
    type: String,
    required: [true, 'Missing driver name']
  },

  location_id: {
    type: Number,
    required: [true, 'Missing location_id']
  },
  location_geo: [
    {
      type: Number,
      required: true
    }
  ],
  status: {
    type: String,
    enum: [OrderStatus.PENDING, OrderStatus.DONE]
  }
}, {
  timestamps: true,
  collection: 'orders',
  toObject: {
    transform: (_, ret) => {
      delete ret.__v
      return ret
    }
  },
  toJSON: {
    transform: (_, ret) => {
      delete ret.__v
      return ret
    }
  }
})