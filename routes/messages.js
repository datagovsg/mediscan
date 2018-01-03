'use strict';

const _ = require('lodash');
const express = require('express');
const Message = require('express');
const router = new express.Router();


// GET: /messages
router.get('/', async (req, res) => {
  const messages = await Message.find();
  res.send(JSON.stringify(messages));
});

module.exports = router;
