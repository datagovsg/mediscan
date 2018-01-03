'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sentTime: Date,
  repliedTime: Date,
  medication: {type: mongoose.Schema.Types.ObjectId, ref: 'Medication'},
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
