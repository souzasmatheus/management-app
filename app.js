const express = require('express')
const exphbs = require('express-handlebars')
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

// Index Route
app.get('/', (req, res) => {
    const title = 'Welcome'
    res.render('index', {
        title
    })
})

app.get('/client', (req, res) => {
    res.render('client', {
        title: 'client'
    })
})

const port = 5000

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})