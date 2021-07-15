const express = require('express')
const setupRoutes = require('./routes')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

setupRoutes(app)

const port = 7101
app.listen(port, () => console.log("Drivers service is running on " + port))

