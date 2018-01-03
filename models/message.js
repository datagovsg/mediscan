'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sentTime: Date,
  repliedTime: Date,
  medications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Medication'}],
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
