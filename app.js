const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const helpers = require('./lib/helpers')
const passport = require('passport')
const app = express()
const {ensureAuthenticated} = require('./lib/auth')

// teste
const {getNames} = require('./lib/bdayPeople')

// Load routes
const client = require('./routes/client')
const user = require('./routes/user')

// Passport Config
require('./config/passport')(passport)

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers
})

// Connect to mongoose
mongoose.connect('mongodb://souzasmatheus:81218525Matheus@ds117846.mlab.com:17846/housing', {
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

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash Middleware
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    //res.locals.birthday_msg = req.flash('birthday_msg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    next()
})

// Favicon Set Up
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))

// History Route
app.get('/', ensureAuthenticated, (req, res) => {
    Client.find({
        user: req.user.id
    })
        .sort({date: -1})
        .then(clients => {
            const bdayPeople = getNames(clients)

            if (bdayPeople) {
                res.locals.birthday_msg = bdayPeople
            }
            
            res.render('index', {
                clients
            })
        })
})

// Process Search
app.get('/search', ensureAuthenticated, (req, res) => {
    let queryParam = {
        user: req.user.id
    }
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

// About Route
app.get('/about', (req, res) => {
    res.render('about')
})

// Use Routes
app.use('/client', client)
app.use('/user', user)

// Catch unknown routes
app.get('*', (req, res) => {
    res.redirect('/')
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})