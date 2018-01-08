'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');

const phoneNumberSchema = new mongoose.Schema({
  prescription: {type: mongoose.Schema.Types.ObjectId, ref: 'Prescription'},
  phoneNumber: String,
  verificationCode: String,
});

phoneNumberSchema.methods.sendVerificationCode = async function(body) {
  const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);

  try {
    await client.messages.create({
      to: `+65 ${this.phoneNumber}`,
      from: cfg.twilioPhoneNumber,
      body: `Mediscan: ${this.verificationCode}`,
    });
  } catch (e) {
    console.error(e);
  }

  // Log the last few digits of a phone number
  let masked = this.phoneNumber.substr(0, this.phoneNumber.length - 5);
  masked += '*****';
  console.log(`Verification code sent to ${masked}`);
};

const PhoneNumber = mongoose.model('PhoneNumber', phoneNumberSchema);
module.exports = PhoneNumber;
