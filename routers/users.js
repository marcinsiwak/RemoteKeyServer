require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../models/user')
const bcrpyt = require('bcrypt')

const jwt = require('jsonwebtoken')

let authTokens = []

router.get('/auth', authToken, async (req, res) => {
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)
    
        res.json(user)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})


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
        return res.status(400).send("User not found")
    }
    
    try {
        if(await bcrpyt.compare(req.body.password, user.password)){
        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' })
        authTokens.push(accessToken)
        
        res.send({status: "Success", name: user.name, accessToken: accessToken})
        } else {
            res.send("Auth failed")
        }
    } catch(error) 
    {
        res.status(500).send({error: error.message})
    }
})

// router.delete('/logout', async (req, res) => {
//     authTokens = authTokens.filter(token => token != req.body.token)
//     res.sendStatus(204)
// })


function authToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })

}

module.exports = router