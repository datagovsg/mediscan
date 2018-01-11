'use strict';

const _ = require('lodash');
const express = require('express');
const Prescription = require('../../models/prescription');
const Medication = require('../../models/medication');
const PhoneNumber = require('../../models/phoneNumber');
const Message = require('../../models/message');
const router = new express.Router();

// GET: /prescriptions
router.get('/', async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .select('-__v')
      .lean();

    // Map medication IDs to medication objects
    await Promise.all(
      _.map(prescriptions, async (prescription) => {
        prescription.medications = await Medication.find({
          _id: {$in: prescription.medications},
        })
          .select('-__v')
          .lean();
      })
    );
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }

  res.send(JSON.stringify(prescriptions));
});

function convertArrayToMedication(input) {
  return new Medication({
    name: input[0],
    quantity: input[1],
    units: input[2],
    frequency: input[3],
    remarks: input[4] || '',
  });
}

// POST: /prescriptions
router.post('/create', async (req, res) => {
  try {
    let medications = [];
    if (Array.isArray(req.body.medicine)) {
      medications = _.zip(
        req.body.medicine,
        req.body.quantity,
        req.body.unit,
        req.body.frequency,
        req.body.remark
      );
      medications = medications.map(function(x) {
        return convertArrayToMedication(x);
      });
    } else {
      medications = [
        new Medication({
          name: req.body.medicine,
          quantity: req.body.quantity,
          units: req.body.unit,
          frequency: req.body.frequency,
          remarks: req.body.remark,
        }),
      ];
    }

    const prescription = new Prescription({
      name: req.body.patientName,
      patientPhoneNumber: req.body.patientPhoneNumber,
      caregiverPhoneNumbers: [req.body.caregiverPhoneNumber],
      medications: medications,
    });
    await Promise.all([
      prescription.save(),
      ..._.map(medications, (medication) => medication.save()),
    ]);

    if (req.body.patientPhoneNumber) {
      // Send the first message
      Message.sendMessage(
        req.body.patientPhoneNumber,
        `Hi ${req.body.name},\n\nWelcome to Mediscan!`
      );
    }
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.redirect('/');
});

// DELETE: /prescriptions/:id
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await Prescription.remove({_id: id});
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.send();
});

// POST: /prescriptions/:id/subscribe
// Generates and sends a random verification code to the specified phone number
router.post('/:id/subscribe', async (req, res) => {
  const verificationCode = Math.floor(Math.random() * 10000).toString();
  try {
    const prescription = await Prescription.findOne({_id: req.params.id});
    const phoneNumber = new PhoneNumber({
      phoneNumber: req.body.phoneNumber,
      prescription: prescription,
      verificationCode,
    });
    phoneNumber.sendVerificationCode();
    await phoneNumber.save();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.send();
});

// POST: /prescriptions/:id/verify
// Checks the verification code and add to prescription if valid
router.post('/:id/verify', async (req, res) => {
  try {
    const phoneNumber = await PhoneNumber.findOne({
      phoneNumber: req.body.phoneNumber,
      verificationCode: req.body.verificationCode,
    });
    if (phoneNumber !== undefined) {
      const prescription = await Prescription.findOne({
        _id: phoneNumber.prescription,
      });
      prescription.patientPhoneNumber = phoneNumber.phoneNumber;
      await prescription.save();
      await phoneNumber.remove();
      await Message.sendMessage(
        phoneNumber.phoneNumber,
        'Welcome to Mediscan! You will receive notifications when your medicine is due.'
      );
      res.send();
    }
    res.status(404).send();
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.send();
});

module.exports = router;
