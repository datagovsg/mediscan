'use strict';

const mongoose = require('mongoose');
const cfg = require('../config');
const Twilio = require('twilio');
const Prescription = require('./prescription');

const messageSchema = new mongoose.Schema({
  prescriptionId: String,
  sentTime: Date,
  repliedTime: Date,
  retriedTime: Date,
  alertTime: Date,
  medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Medication'}],
});

messageSchema.statics.sendRetries = async function() {
  const messages = await Message.find();
  await Promise.all(_.map(messages, (message) => message.sendRetry()));
};

messageSchema.methods.sendRetry = async function() {
  const prescription = await Prescription.find({_id: this.prescriptionId});

  if (!this.repliedTime && !this.retriedTime) {
    await this.update({_id: this._id}, {$set: {retriedTime: Date.now()}});

    const body = _.map(
      this.medications,
      ({name, quantity, units, frequency, remarks}) =>
        `${name}, ${quantity} ${units}, ${remarks}`
    ).join('\n');

    const url = `${cfg.rootUrl}messages/${message._id}/reply`;
    await sendMessage(
      prescription.patientPhoneNumber,
      `Reminder: ${body}\n\nClick ${url} after you have taken your medicine`
    );
  }
};

messageSchema.statics.sendAlerts = async function() {
  const messages = await Message.find();
  await Promise.all(_.map(messages, (message) => message.sendAlert()));
};

messageSchema.methods.sendAlert = async function() {
  const prescription = await Prescription.find({_id: this.prescriptionId});

  if (!this.repliedTime && this.retriedTime && !this.alertTime) {
    await this.update({_id: this._id}, {$set: {alertTime: Date.now()}});

    const body = _.map(
      this.medications,
      ({name, quantity, units, frequency, remarks}) =>
        `${name}, ${quantity} ${units}, ${remarks}`
    ).join('\n');

    await Promise.all(
      _.map(
        prescription.caregiverPhoneNumbers,
        async (caregiverPhoneNumber) => {
          await sendMessage(
            caregiverPhoneNumber,
            `Alert: ${
              prescription.patientPhoneNumber
            } has not eaten the following medication:\n${body}`
          );
        }
      )
    );
  }
};

messageSchema.statics.sendMessage = async function(phoneNumber, body) {
  const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);

  // Send the message!
  try {
    await client.messages.create({
      to: `+65 ${phoneNumber}`,
      from: cfg.twilioPhoneNumber,
      body,
    });
  } catch (e) {
    console.error(e);
  }

  // Log the last few digits of a phone number
  let masked = phoneNumber.substr(0, phoneNumber.length - 5);
  masked += '*****';
  console.log(`Message sent to ${masked}`);
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
