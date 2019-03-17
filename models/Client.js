const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ClientSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    document: {
        type: String
    },
    birthday: {
        type: String
    },
    sex: {
        type: String
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    number: {
        type: Number
    },
    email: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    checkIns: {
        type: Array,
        default: []
    }
})

mongoose.model('clients', ClientSchema)