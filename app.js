const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

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
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// History Route
app.get('/', (req, res) => {
    Client.find({})
        .then(clients => {
            res.render('index', {
                clients
            })
        })
})

// Clients Register
app.get('/client', (req, res) => {
    res.render('client')
})

// Process Form
app.post('/client', (req, res) => {
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

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})