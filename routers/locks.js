const express = require('express')
const router = express.Router()
const LockList = require('../models/lockList')
const Lock = require('../models/lock')
const User = require('../models/user')

const bcrpyt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/userLocks', authToken, async (req, res) => {
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)
        
        const lockLists = await LockList.find()

        const userLockList = lockLists.find(list => list.userId === String(user._id))

        const newLock = new Lock({
            lockTitle: req.body.lockTitle,
            lockId: req.body.lockId
        })
        
        if(userLockList == null){
            const newList = new LockList({
                userId: user._id,
                lockList: []
            })
            newList.update({
                $push: {
                    'lockList': newLock
                }
            }, 
            function( err, result ) {
                if(err){
                    throw err
                } else{
                    console.log("result", result)
                }
            })

            await newList.save()
            res.status(201).json("new lockList")

        } else {            
            userLockList.update({
                $push: {
                    'lockList': newLock
                }
            }, 
            function( err, result ) {
                if(err){
                    throw err
                } else{
                    console.log("result", result)
                }
            })

            res.status(201).json("new lock")
        }
    
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})


router.get('/userLocks', authToken, async (req, res) => {
    try {
        const users = await User.find()

        const user = users.find(user => user.name === req.user.name)

        const lockLists = await LockList.find()

        const userLockList = lockLists.find(list => list.userId === String(user._id))

        const newList = userLockList.lockList.map(list => ({
            id: list._id,
            lockTitle: list.lockTitle
        }))

        const userLocksResponse = {
            lockList: newList
        }
        res.send(userLocksResponse)
        res.status(201)
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