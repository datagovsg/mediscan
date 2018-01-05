'use strict';

const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');
const Medication = require('./medication');
const Message = require('./message');
const cfg = require('../config');
const Twilio = require('twilio');
const {HOURS} = require('../constants');

const prescriptionSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
  medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Medication'}],
});

function getFrequenciesToRemind(hour) {
  switch (hour) {
    case HOURS.MORNING:
      return [1, 2, 3, 4];
    case HOURS.AFTERNOON:
      return [3, 4];
    case HOURS.EVENING:
      return [2, 3, 4];
    case HOURS.NIGHT:
      return [4];
    default:
      return [];
  }
}

prescriptionSchema.statics.sendReminders = async function() {
  const prescriptions = await Prescription.find();
  await Promise.all(
    _.map(prescriptions, (prescription) => prescription.sendReminder())
  );
};

prescriptionSchema.methods.sendReminder = async function() {
  // Fetch all medications with reminders due
  const frequencies = getFrequenciesToRemind(parseInt(moment().format('H')));
  const medications = await Medication.find({
    _id: {$in: this.medications},
    frequency: {$in: frequencies},
  }).lean();

  if (_.isEmpty(medications)) {
    return;
  }

  const message = new Message({
    sentTime: Date.now(),
    repliedTime: null,
    medications: _.map(this.medications, (id) => mongoose.Types.ObjectId(id)),
  });
  await message.save();

  const body = _.map(
    medications,
    ({name, quantity, units, frequency, remarks}) =>
      `${name}, ${quantity} ${units}, ${remarks}`
  ).join('\n');
  const url = `${cfg.rootUrl}messages/${message._id}/reply`;
  await this.sendNotification(
    `Hi ${
      this.name
    },\n\n${body}\n\nClick ${url} after you have taken your medicine`
  );
};

prescriptionSchema.methods.sendNotification = async function(body) {
  const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);

  // Send the message!
  try {
    await client.messages.create({
      to: `+65 ${this.phoneNumber}`,
      from: cfg.twilioPhoneNumber,
      body,
    });
  } catch (e) {
    console.error(e);
  }

  // Log the last few digits of a phone number
  let masked = this.phoneNumber.substr(0, this.phoneNumber.length - 5);
  masked += '*****';
  console.log(`Message sent to ${masked}`);
};

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;
