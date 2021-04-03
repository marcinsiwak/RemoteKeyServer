const express = require('express')
const router = express.Router()
const Pin = require('../models/pin')
const User = require('../models/user')
const Fingerprint = require('../models/fingerprint')
const Pattern = require('../models/pattern')

const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/pattern', authToken, async (req, res) => {
    const hashedPattern = await bcrpyt.hash(req.body.pattern, 10)
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)
        user.update({
            hasPattern : true
        }, 
        function( err, result ) {
            if(err){
                throw err
            } else{
                console.log("result", result)
            }
        })
    

        const securityPattern = new Pattern({
            userId: user._id,
            pattern: hashedPattern
        })

        const newPin = await securityPattern.save()
        res.status(201).json(newPin)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/pattern/open', authToken, async (req, res) => {
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)

        const patterns = await Pattern.find()

        const pattern = patterns.find(pattern => pattern.userId === String(user._id))

        if(await bcrpyt.compare(req.body.pattern, pattern.pattern)){
            res.status(200).json({message: "Correct pattern"})
        } else {
            console.log("pattern", "WRONG")

            res.status(400).json({message: "Wrong pattern"})
        }

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/pin', authToken, async (req, res) => {
    const hashedPin = await bcrpyt.hash(req.body.pin, 10)
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)
        user.update({
            hasPin : true
        }, 
        function( err, result ) {
            if(err){
                throw err
            } else{
                console.log("result", result)
            }
        })
    

        const securityPin = new Pin({
            userId: user._id,
            pin: hashedPin
        })

        const newPin = await securityPin.save()
        res.status(201).json(newPin)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.post('/pin/open', authToken, async (req, res) => {
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)

        const pins = await Pin.find()

        const pin = pins.find(pin => pin.userId === String(user._id))
        console.log("pin", pin)

        if(await bcrpyt.compare(req.body.pin, pin.pin)){
            console.log("pin", "Correct")
            res.status(200).json({message: "Correct pin"})
        } else {
            console.log("pin", "WRONG")

            res.status(400).json({message: "Wrong pin"})
        }

    } catch (err) {
        res.status(400).json({message: err.message})
    }
})


router.post('/fingerprint/open', authToken, async (req, res) => {
    try {
        if(req.body.isFingerprintCorrect){
            res.status(200).json({message: "Authorized!"})
        }else{
            res.status(400).json({message: "Auth failed, fingerprint option is locked"})
        }
      
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

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