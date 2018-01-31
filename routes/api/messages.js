'use strict';

const _ = require('lodash');
const express = require('express');
const Message = require('../../models/message');
const router = new express.Router();
/**
 * @swagger
 * /api/messages:
 *   get:
 *     tags:
 *       - Messages
 *     description: Returns all messages
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of messages
 *     schema:
 *       type: object
 *       $ref: '#/definitions/Message'
 *
 */

router.get('/', async (req, res) => {
  const messages = await Message.find().select('-__v');
  res.send(JSON.stringify(messages));
});

/**
 * @swagger
 * /api/messages/{id}/reply:
 *   get:
 *     tags:
 *       - Messages
 *     description: Returns all messages
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of messages
 */
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

/**
 * @swagger
 * definitions:
 *   Message:
 *     type: object
 *     properties:
 *       prescriptionId:
 *         type: string
 *       sentTime:
 *         type: date
 *       repliedTime:
 *         type: date
 *       retriedTime:
 *         type: date
 *       alertTime:
 *         type: date
 *       medications:
 *         type: array
 */

module.exports = router;
