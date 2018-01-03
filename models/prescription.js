'use strict';

const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Medication'}],
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
