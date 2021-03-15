const express = require('express')
const router = express.Router()
const User = require('../models/user')

// const users = []

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// router.post('/users', async (req, res) => {
//     try {
//         const hashedPassword = await bcrpyt.hash(req.body.password, 10)
//         const user = { name: req.body.name, password: hashedPassword}
//         users.push(user)
//         res.status(201).send({status: "Complete"})
//     } catch {
//         res.status(500).send()
//     }
// })

// router.post('/users/login', async (req, res) => {
//     const user = users.find(user => user.name === req.body.name)
//     if(user == null){
//         return res.status(400).send("User not found")
//     }
    
//     try {
//         if(await bcrpyt.compare(req.body.password, user.password)){
//             res.send({status: "Success", name: user.name})
//         } else {
//             res.send("Auth failed")
//         }
//     } catch {
//         res.status(500).send()
//     }
// })

module.exports = router