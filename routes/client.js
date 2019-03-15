const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const uuidv1 = require('uuid/v1')

// Load Client Model
require('../models/Client')
const Client = mongoose.model('clients')

// Client Details
router.get('/details/:id', (req, res) => {
    const id = req.params.id

    Client.findOne({
        _id: id
    })
        .then(client => {
            res.render('client/details', {
                client,
                checkIns: client.checkIns.reverse()
            })
        })
})

// Clients Register
router.get('/add', (req, res) => {
    res.render('client/add')
})

// Process Register Form
router.post('/add', (req, res) => {
    const{name, document, birthday,
    sex, address, city, state, number, email} = req.body
    const newClient = {
        name,
        document,
        birthday,
        sex,
        address,
        city,
        state,
        number,
        email
    }

    new Client(newClient)
        .save()
        .then(client => {
            res.redirect('/')
        })
})

// Clients Info Edit
router.get('/edit/:id', (req, res) => {
    Client.findOne({
        _id: req.params.id
    })
        .then(client => {
            res.render('client/edit', {
                client
            })
        })
})

// Process Edit Form
router.put('/:id', (req, res) => {

    Client.findOne({
        _id: req.params.id
    })
        .then(client => {
            client.address = req.body.address
            client.city = req.body.city
            client.state = req.body.state
            client.number = req.body.number
            client.email = req.body.email

            client.save()
                .then(client => {
                    res.redirect('/')
                })
        })
})

// Delete Confirmation Page
router.get('/delete/:id', (req, res) => {
    const id = req.params.id
    
    Client.findOne({
        _id: id
    })
        .then(client => {
            res.render('client/delete', {
                client
            })
        })
})

// Process Delete
router.delete('/:id', (req, res) => {
    const id = req.params.id

    Client.deleteOne({
        _id: id
    })
        .then((client) => {
            req.flash('success_msg', 'Cliente deletado com sucesso!')
            res.redirect('/')
        })
})

// Check In Form Page
router.get('/check-in/:id', (req, res) => {
    const id = req.params.id

    // Case user is editing check in
    if (req.headers.referer.match(/details/g)) {
        // get previous URL's info of client's id
        const previousUrlArray = req.headers.referer.split('/')
        const arrayLength = previousUrlArray.length
        const clientId = previousUrlArray[arrayLength - 1]

        // get checkin informations to pass into view
        Client.findOne({
            _id: clientId
        })
            .then(client => {
                const checkInObj = client.checkIns.filter((checkin) => (checkin.id === id))

                res.render('client/check-in', {
                    id,
                    clientId,
                    edit: true,
                    checkin: checkInObj[0].checkin,
                    checkout: checkInObj[0].checkout,
                    payment: checkInObj[0].payment,
                    mean: checkInObj[0].mean,
                    guests: checkInObj[0].guests
                })
            })
    // Case user is creating a new check in
    } else {
        res.render('client/check-in', {
            id
        })
    }
})

// Handle New Check In
router.put('/check-in/:id', (req, res) => {
    const id = req.params.id

    Client.updateOne({
        _id: id
    }, {
        $push: {
            checkIns: {
                "checkin": req.body.checkin,
                "checkout": req.body.checkout,
                "payment": req.body.payment,
                "mean": req.body.mean,
                "guests": req.body.guests,
                "id": uuidv1()
            }
        }
    })
        .then(() => {
            req.flash('success_msg', 'Novo check-in realizado!')
            res.redirect(`/client/details/${id}`)
        })
})

// Handle Check In Editing
router.put('/check-in-edit/:id', (req, res) => {
    const clientId = req.params.id,
        checkInId = req.query.checkInId

    Client.findOne({
        _id: clientId
    })
        .updateOne({'checkIns.id': checkInId}, {'$set': {
            'checkIns.$.checkin': req.body.checkin,
            "checkIns.$.checkout": req.body.checkout,
            "checkIns.$.payment": req.body.payment,
            "checkIns.$.mean": req.body.mean,
            "checkIns.$.guests": req.body.guests
        }})
        .then(() => res.redirect(`/client/details/${clientId}`))
})

// Handle Check In Deleting
router.delete('/check-in-delete/:id', (req, res) => {
    const previousUrlArray = req.headers.referer.split('/')
    const arrayLength = previousUrlArray.length
    const clientId = previousUrlArray[arrayLength - 1]

    const checkInId = req.params.id

    Client.findOne({
        _id: clientId
    })
        .updateOne({'$pull': {
            checkIns: {id: checkInId}
        }})
        .then(() => res.redirect(`/client/details/${clientId}`))
})

module.exports = router