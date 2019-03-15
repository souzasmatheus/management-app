const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const helpers = require('./lib/helpers')
const passport = require('passport')
const app = express()

// Load routes
const client = require('./routes/client')
const user = require('./routes/user')

// Passport Config
require('./config/passport')(passport)

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

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Method Override Middleware
app.use(methodOverride('_method'))

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Flash Middleware
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

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

// Use Routes
app.use('/client', client)
app.use('/user', user)

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})