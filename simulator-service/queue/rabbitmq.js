const amqp = require('amqplib/callback_api')

module.exports = class RabbitMQWrapper {
  _connection;

  async consume(queue, cb) {
    const ch = await this.connection.createChannel()
    ch.assertQueue(queue, { durable: true })
    ch.prefetch(1)
  
    ch.consume(queue, (msg) => {
      console.log("[x] Received: %s", msg.content.toString())
      cb(msg, ch)
    }, { noAck: false })
  }

  publish(queue, data) {
    return new Promise(async (r, j) => {
      const ch = await this.connection.createChannel()
      console.log(Date.now() + ' Publicando dados na queue: ' + queue, ' :: ', data)
      ch.assertQueue(queue, { durable: true })
      ch.sendToQueue(queue, Buffer.from(data))

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