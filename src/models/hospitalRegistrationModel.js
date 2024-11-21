const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalSchema = new Schema(
  {
    hospitalname: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    hospitalType: {
      type: String,
      trim: true,
      required: true,
    },
    government: {
      type: String,
      trim: true,
      required: true,
    },
    hospitalAddress: {
      type: String,
      trim: true,
      required: true,
    },
    hospitalState: {
      type: String,
      trim: true,
      required: true,
    },
    hospitalDistrict: {
      type: String,
      trim: true,
      required: true,
    },
    hospitalWebsite: {
      type: String,
      trim: true,
    },
    hospitalAvgOPD: {
      type: Number,
    },
    hospitalDoctors: {
      type: Number,
    },
    nodalOfficerName: {
      type: String,
      trim: true,
      required: true,
    },
    nodalDesignation: {
      type: String,
      trim: true,
      required: true,
    },
    nodalMobileNumber: {
      type: String, // Changed from Number to String
      required: true,
    },
    nodalLandLineNumber: {
      type: String, // Changed from Number to String
    },
    nodalEmail: {
      type: String,
      trim: true,
      required: true,
    },
    nameofHospitalAdd: {
      type: String,
      trim: true,
    },
    freeBeds: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

const Hospital = mongoose.model('Hospital', hospitalSchema);

module.exports = Hospital;
