const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
 res.render('index', {
  title: 'Weather App',
 })
})

app.get('/about', (req, res) => {
 res.render('about', {
  title: 'About Me',
 })
})

app.get('/weather', (req, res) => {
 if (!req.query.address) {
  return res.send({
   error: 'An address must be provided!'
  })
 }

 geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
  if (error) return res.send({ error })

  forecast(longitude, latitude, (error, forecastData) => {
   if (error) return res.send({ error })
   res.send({
    location,
    forecast: forecastData,
    address: req.query.address
   })
  })
 })
})

app.get('*', (req, res) => {
 res.render('404', {
  title: '404 Page',
  errorMessage: 'Page not found',
 })
})

app.listen(port, () => {
 console.log(`Server is up on port ${port}.`)
})