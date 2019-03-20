const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const router = express.Router()
const { ensureMasterAuthentication, ensureAuthenticated } = require('../lib/auth')

// Load User Model
require('../models/User')
const User = mongoose.model('users')

// User Login Router
router.get('/login', (req, res) => {
    res.render('user/login')
})

// User Resgister Router
router.get('/register', ensureMasterAuthentication, (req, res) => {
    res.render('user/register')
})

// Login Form Post
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next)
})

// Register Form Post
router.post('/register', ensureMasterAuthentication, (req, res) => {
    let errors = []

    if (req.body.password !== req.body.password2) {
        errors.push({
            text: 'As senhas devem ser iguais'
        })
    }

    if (errors.length > 0) {
        res.render('user/register', {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        User.findOne({
            email: req.body.email
        })
            .then(user => {
                if (user) {
                    req.flash('error_msg', 'Este e-mail já está cadastrado')
                    res.redirect('/user/login')
                } else {
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
                                    req.flash('success_msg', 'Usuário cadastrado')
                                    res.redirect('/')
                                })
                                .catch(err => {
                                    console.log(err)
                                    return
                                })
                        })
                    })
                }
            })
    }
})

// Change Password Router
router.get('/password', ensureAuthenticated, (req, res) => {
    res.render('user/password')
})

// Handle New Password Form
router.put('/password', ensureAuthenticated, (req, res) => {
    let errors = []
    if (req.body.password1 != req.body.password2) {
        errors.push({
            text: 'A nova senha e a confirmação devem ser iguais'
        })
    }

    if (errors.length > 0) {
        res.render('user/password', {
            errors: errors
        })
    } else {
        User.findOne({
            _id: req.user.id
        })
            .then((user) => {
                if (bcrypt.compare(req.body.old_password, user.password)) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password1, salt, (err, hash) => {
                            if (err) throw err
                            user.password = hash;
                            user.save()
                                .then(user => {
                                    req.logout()
                                    req.flash('success_msg', 'Nova senha atualizada')
                                    res.redirect('/user/login')
                                })
                                .catch(err => {
                                    console.log(err)
                                    return
                                })
                        })
                    })
                } else {
                    req.flash('error_msg', 'A senha antiga está incorreta')
                    res.redirect('/user/password')
                }
            })
    }
})

// Logout User
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'Até mais! :)')
    res.redirect('/user/login')
})

module.exports = router