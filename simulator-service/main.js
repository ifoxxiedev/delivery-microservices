const path = require('path')
const { Worker } = require('worker_threads')

const rabbitmqWrapper = require('./queue/rabbitmq')
const processRunning = {}

const createWorker = (order) => {
  const worker = new Worker(path.resolve(__dirname, 'workers', 'process-order.js'), {
    workerData: new TextEncoder().encode(JSON.stringify(order))
  })
  return worker;
}


const processOrderWorker = (order, worker, { ch, msg }) => {
  let error;
  worker.on('message', ({ status }) => {
    console.log('Receive message from thread children ', status)
  })

  worker.on('exit', () => {
    processRunning[order.id] = false
    if (!error) ch.ack(msg)
  })

  worker.on('error', err => {
    console.log('Thread children throw error ', err)
    error = err
  })
}

const startConsumer = () => {
  rabbitmqWrapper.consume('simulator', async (msg, ch) => {
    const order = JSON.parse(msg.content.toString('utf8'))
    if (!processRunning[order.id]) {
      processRunning[order.id] = true
      const worker = createWorker(order)
      processOrderWorker(order, worker, { ch, msg  })
    } else {
      console.log(`Cannot process order ${order.id} because this in process!`)
    }
  })
}

const main = async () => {
  try {
    await rabbitmqWrapper.connect()
    startConsumer()
  } catch(err) {
    throw err
  }
}


main()


const gracefullShutdown = arg => {
  console.log(arg)
  const exitCode = arg instanceof Error ? -1 : 0
  rabbitmqWrapper.disconnect().finally(() => {
    process.exit(exitCode)
  })
}

process.on('SIGTERM', gracefullShutdown)
process.on('uncaughtException', gracefullShutdown)
process.on('unhandledRejection', gracefullShutdown)
