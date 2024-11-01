require('dotenv').config()

const express = require('express')
const app  = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection

db.on("error", (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.json())

const usersRouter = require('./routers/users')
const securityRouter = require('./routers/security')
const locksRouter = require('./routers/locks')

app.use('/users', usersRouter)
app.use('/security', securityRouter)
app.use('/locks', locksRouter)

app.listen(3000)