'use strict';

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  sentTime: Date,
  repliedTime: Date,
  medication: {type: Schema.Types.ObjectId, ref: 'Medication'},
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
