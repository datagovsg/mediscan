'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const Medication = require('./medication');
const Message = require('./message');
const cfg = require('../config');
const Twilio = require('twilio');

const prescriptionSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Medication'}],
});

prescriptionSchema.methods.sendReminder = async function() {
  const medications = await Promise.all(
    _.map(this.medications, (_id) => Medication.findOne({_id}).lean())
  );

  const body = _.map(
    medications,
    ({name, quantity, units, frequency, remarks}) =>
      `${name}, ${quantity} ${units}, ${frequency} times a day, ${remarks}`
  ).join('\n');

  await this.sendNotification(`Hi ${this.name},\n${body}`);

  const message = new Message({
    sentTime: Date.now(),
    repliedTime: null,
    medications: _.map(this.medications, (id) => mongoose.Types.ObjectId(id)),
  });
  await message.save();
};

prescriptionSchema.methods.sendNotification = async function(body) {
  const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);

  // Send the message!
  await client.messages.create({
    to: `+ ${this.phoneNumber}`,
    from: cfg.twilioPhoneNumber,
    body,
  });

  // Log the last few digits of a phone number
  let masked = this.phoneNumber.substr(0, this.phoneNumber.length - 5);
  masked += '*****';
  console.log(`Message sent to ${masked}`);
};

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
