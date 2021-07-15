const path = require('path')
const fs = require('fs')
const readline = require('readline')
const { promisify } = require('util')

const RabbitMQ = require('./queue/rabbitmq')
const processRunning = {}

const rabbitMQInstance = new RabbitMQ();

process.on('SIGTERM', (err) => {
  rabbitMQInstance.disconnect()
  process.exit(1)
})

process.on('uncaughtException', (err) => {
  rabbitMQInstance.disconnect()
  process.exit(-1)
})

process.on('unhandledRejection', (err) => {
  rabbitMQInstance.disconnect()
  process.exit(-1)
})

module.exports = (async () => {
  try {
    await rabbitMQInstance.connect()
    main()
  } catch(err) {
    throw err
  }
})()

const main = async () => {
  
  rabbitMQInstance.consume('simulator', async (msg, ch) => {
    const order = JSON.parse(msg.content.toString('utf8'))
    await startProcessSimulator(order, ch, msg)
  })
}


const existsFilesPrm = promisify(fs.exists)

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const publishDst = async (order, lat, long) => {

  return await rabbitMQInstance.publish('coordinates', JSON.stringify({
    order,
    lat,
    long
  }))
}

const startProcessSimulator = async (order, ch, msg) => {
  let err;
  
  try {
    if (!processRunning[order.id]) {
      processRunning[order.id] = true

      // Read file
      const dir = path.resolve(__dirname, 'destinations', `${order.id}.txt`)
      const exists = existsFilesPrm(dir)
  
      if (exists) {     
        const stream = fs.createReadStream(dir)
        const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })
        for await (const line of rl) {
          const [lat, long] = line.split(',')
          await delay(2000)
          await publishDst(order, lat, long)
        }
        await publishDst(order, 0, 0)
      }
      processRunning[order.id] = false
    }
    
  } catch(error) {
    err = error
    console.log(err)
  } finally {
    if (!err) {
      ch.ack(msg)
    }
  }
}


