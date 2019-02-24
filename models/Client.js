const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ClientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    document: {
        type: Number,
        required: true
    },
    birthday: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

mongoose.model('clients', ClientSchema)