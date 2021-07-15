const {drivers} = require('../drivers.json')

const setupRoutes = app => {
  app.get('/drivers', (req, res, next) => {
    res.status(200).json(drivers)
  })
  
  
  app.get('/drivers/:uuid', (req, res, next) => {
    const driver = drivers.find(d => d.uuid === req.params.uuid);
    if (!driver) {
      return res.status(404).json({
        message: 'Driver is not found'
      })
    }
    res.status(200).json(driver)
  })
}

module.exports = setupRoutes