const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

// User Login Router
router.get('/login', (req, res) => {
    res.send('login')
})

// User Login Router
router.get('/register', (req, res) => {
    res.send('register')
})

module.exports = router