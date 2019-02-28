const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ClientSchema = new Schema({
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
    }
})

mongoose.model('clients', ClientSchema)