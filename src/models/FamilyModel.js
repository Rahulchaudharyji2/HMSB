// familyDetails.model.js

const mongoose = require('mongoose');

const familyDetailsSchema = new mongoose.Schema({
  Initial:{
    type:String,
    required:true,

  },
  firstName:{
    type:String,
    required:true,
    trim:true,

  },
  lastName:{
    type:String,
    required:true,
    trim:true,
    },
    gender:{
        type:String,
        required:true,
    },
    dobDay:{
        type:String,
        required:true,
    },
    dobMonth:{
        type:String,
        required:true,
    },
    dobYear:{
        type:String,
        required:true,
        },
        relation:{
            type:String,
            
        },
        guardianName:{
            type:String,
            
        },
        mobNo:{
            type:Number,
            required:true,
        },
        email:{
            type:String,
            required:true

        },
        address:{
            type:String,
            required:true,
        },
        country:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        district:{
            type:String,
            required:true,
        }

});

module.exports = mongoose.model('FamilyDetails', familyDetailsSchema);