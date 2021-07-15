const fs = require('fs')
const path = require('path')
const readline = require('readline')

const { parentPort, workerData  } = require('worker_threads')
const rabbitmqWrapper = require('../queue/rabbitmq')

const order = JSON.parse(new TextDecoder().decode(workerData))
const sleep = time => new Promise((r, j) => setTimeout(r, time))

const publishDestinations = ([lat, long]) => {
  return sleep(1000)
  .then(rabbitmqWrapper.publish('coordinates', JSON.stringify({
    order,
    lat,
    long
  })))
}

const readDestinations = async filePath => {
  const fileStream = new fs.createReadStream(filePath)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  })

  for await (const line of rl) {
    await publishDestinations(line.split(','))
  } 

  await publishDestinations(0, 0)
}

const processDestinations = async () => {
  const filePath = path.resolve(__dirname, '..', 'destinations', `${order.id}.txt`)
  console.log(filePath)
  if (fs.existsSync(filePath)) {
    await readDestinations(filePath)
  }
}

const main = async () => {
  try {
    console.log('ORDER WORKER', order)
    if (order) {
      await rabbitmqWrapper.connect()
      parentPort.postMessage({ status: 'workerIsReady'})
      await processDestinations()
    }

  } catch(err) {
    console.log(err)
    process.exit(-1)
  }
}

main()
.finally(() => {
  parentPort.postMessage({ status: 'workerIsDone'})
  rabbitmqWrapper.disconnect()
})
