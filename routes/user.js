const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
//const passport = require('passport')
const router = express.Router()

// Load User Model
require('../models/User')
const User = mongoose.model('users')

// User Login Router
router.get('/login', (req, res) => {
    res.render('user/login')
})

// User Login Router
router.get('/register', (req, res) => {
    res.render('user/register')
})

// Register Form Post
router.post('/register', (req, res) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash;
            newUser.save()
                .then(user => {
                    res.redirect('/user/login')
                })
                .catch(err => {
                    console.log(err)
                    return
                })
        })
    })
})

module.exports = router