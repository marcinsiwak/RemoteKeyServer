const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrpyt = require('bcrypt')

const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const hashedPassword = await bcrpyt.hash(req.body.password, 10)
    const user = new User({
        name: req.body.name,
        password: hashedPassword
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/login', async (req, res) => {
    const users = await User.find()

    const user = users.find(user => user.name === req.body.name)
    if(user == null){
        const accessToken = jwt.sign(user)
        return res.status(400).send("User not found")
    }
    
    try {
        if(await bcrpyt.compare(req.body.password, user.password)){
            res.send({status: "Success", name: user.name})
        } else {
            res.send("Auth failed")
        }
    } catch {
        res.status(500).send()
    }
})

module.exports = router