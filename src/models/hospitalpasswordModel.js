
const mongoose = require('mongoose');
const {Schema}= mongoose;
const hospitalPassword= new Schema({
    
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
},{timestamps:true,versionKey:false})

const HospitalPassword = mongoose.model('Hospital Password', hospitalPassword); 



module.exports = HospitalPassword;
