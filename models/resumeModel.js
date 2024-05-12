const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    currentPosition: {
        type: String,
        required: true,
        trim: true
    },
    desiredPosition: {
        type: String,
        required: true,
        trim: true
    },
    resumeDoc: {
        type: String,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('resume', resumeSchema)
