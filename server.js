const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const morgan = require('morgan')

//Import server configuration
const config = require('./config/config')
const port = config.port

//Import controllers
const userController = require('./controllers/userController')

//Connection to MongoDB
mongoose
  .connect(config.mongo, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch(e => {
    console.log('Error while connecting to MongoDB')
    console.log(e)
  })

//Launch express
const app = express()

//Middlewares
//Morgan for traces
app.use(morgan('dev'))

//BodyParser moddleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//CookieParser middleware
app.use(cookieParser())

//Cors header definition
// app.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, OPTIONS, PUT, PATCH, DELETE'
//   )
//   res.setHeader('Access-Control-Allow-Credentials', true)
//   next()
// })

//Passport middleware
app.use(passport.initialize())

//Passport configuration
require('./config/passport')(passport)

//User routes
app.use('/user', userController)

// app.use('/user', router)
// require(__dirname + '/routes/userRoutes')(router)

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`)
})
