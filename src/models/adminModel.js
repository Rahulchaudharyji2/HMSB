
const mongoose = require('mongoose');
const {Schema}= mongoose;
const admin= new Schema({
    adminname: {
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true
    }
},{timestamps:true,versionKey:false})

const Admin = mongoose.model('User', admin); 



module.exports = Admin;
