const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
