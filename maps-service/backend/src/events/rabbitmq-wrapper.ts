import * as amqp from 'amqplib/callback_api'

class RabbitMQWrapper {
  _connection;

  async consume(queue, cb) {
    const ch = await this.connection.createChannel()
    ch.assertQueue(queue, { durable: true })
    ch.prefetch(1)
  
    ch.consume(queue, async (msg) => {
      console.log("[x] Received: %s", msg.content.toString())
      await cb(msg, ch)
    }, { noAck: false })
  }


  publishToExchange(exchange: string, rountingKey: string, data: any): Promise<void> {
    return new Promise(async (r, j) => {
      console.log(Date.now() + ' Publicando dados na exchange: ' + exchange)
      const ch = await this.connection.createChannel()
      await ch.assertExchange(exchange, 'direct', { durable: true });
      ch.publish(exchange, rountingKey, Buffer.from(JSON.stringify(data)))
      r()
    })
  }

  publish(queue, data): Promise<void> {
    return new Promise(async (r, j) => {
      const ch = await this.connection.createChannel()
      console.log(Date.now() + ' Publicando dados na queue: ' + queue, ' :: ', data)
      ch.assertQueue(queue, { durable: true })
      ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
      r()
    })
  }

  connect() {
    return new Promise((r, j) => {
      if (this._connection) return j(this._connection)
      amqp.connect('amqps://ppwrpdvn:IBVSyR5f0E1-Mu4Ye5GmZkp7nSPLX3zd@barnacle.rmq.cloudamqp.com/ppwrpdvn',(err, conn) => {
        if (err) return j(err)
        this._connection = conn
        r(this._connection)
      })
    })
  }

  disconnect() {
    if (this._connection) {
      this._connection.close()
    }
  }

  get connection() {
    if (!this._connection) {
      throw new Error('Connect into rabbitMQ first')
    }

    return this._connection
  }


  createChannel() {
    return new Promise((r, j) => {
      this._connection.createChannel((err, ch) => {
        if (err) return j(err)
        r(ch)
      })
    })
  }
}


export default new RabbitMQWrapper() 