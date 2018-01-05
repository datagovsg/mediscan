'use strict';

const _ = require('lodash');
const express = require('express');
const Message = require('../../models/message');
const router = new express.Router();

// GET: /messages
router.get('/', async (req, res) => {
  const messages = await Message.find().select('-__v');
  res.send(JSON.stringify(messages));
});

// GET: /messages/:id/reply
router.get('/:id/reply', async (req, res) => {
  const id = req.params.id;

  const message = await Message.findOne({_id: id});
  if (message == null) {
    res.status(404).send('No such message!');
  }

  message.repliedTime = Date.now();
  await message.save();
  res.send();
});

module.exports = router;
