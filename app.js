const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const helpers = require('./lib/helpers')
const uuidv1 = require('uuid/v1')

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers
})

const dataBase = 'mongodb://localhost/management'

// Connect to mongoose
mongoose.connect(dataBase, {
    useNewUrlParser: true
})
    .then(() => console.log('MongoDB connected...'))
    .catch((err) => console.log(err))

// Load Client Model
require('./models/Client')
const Client = mongoose.model('clients')

// Handlebars Middleware
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Method Override Middleware
app.use(methodOverride('_method'))

// History Route
app.get('/', (req, res) => {
    Client.find({})
        .sort({date: -1})
        .then(clients => {
            res.render('index', {
                clients
            })
        })
})

// Client Details
app.get('/client/details/:id', (req, res) => {
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
app.get('/client/add', (req, res) => {
    res.render('client/add')
})

// Process Register Form
app.post('/client/add', (req, res) => {
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
app.get('/client/edit/:id', (req, res) => {
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
app.put('/client/:id', (req, res) => {

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

// Process Search
app.get('/search', (req, res) => {
    let queryParam = {}
    const regEx = new RegExp(req.query.search)
    queryParam[req.query.type] = {
        $regex: regEx,
        $options: 'i'
    }

    Client.find(queryParam)
        .lean()
        .then(clients => {
            res.render('index', {
                clients
            })
        })
        .catch(err => console.log(err))
})

// Delete Confirmation Page
app.get('/client/delete/:id', (req, res) => {
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
app.delete('/client/:id', (req, res) => {
    const id = req.params.id

    Client.deleteOne({
        _id: id
    })
        .then(() => {
            res.redirect('/')
        })
})

// Check In Form Page
app.get('/client/check-in/:id', (req, res) => {
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
app.put('/client/check-in/:id', (req, res) => {
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
            res.redirect('/')
        })
})

// Handle Check In Editing
app.put('/client/check-in-edit/:id', (req, res) => {
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
app.delete('/client/check-in-delete/:id', (req, res) => {
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

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})