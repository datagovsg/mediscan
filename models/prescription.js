'use strict';

const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  phoneNumber: String,
  medications: [{type: Schema.Types.ObjectId, ref: 'Medication'}],
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
