
const express = require('express')
const app  = express()
const bcrpyt = require('bcrypt')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://user:hwADuMZX1BK279uD@cluster0.xpuvh.mongodb.net/magisterska?retryWrites=true&w=majority', {useNewUrlParser: true})
const db = mongoose.connection

db.on("error", (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))

app.use(express.json())

const usersRouter = require('./routers/users')

app.use('/users', usersRouter)



app.listen(3000)