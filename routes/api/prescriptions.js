'use strict';

const _ = require('lodash');
const express = require('express');
const Prescription = require('../../models/prescription');
const Medication = require('../../models/medication');
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
router.post('/', async (req, res) => {
  try {
    const {name, phoneNumber} = req.body;
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
      name,
      phoneNumber,
      medications,
    });
    await Promise.all([
      prescription.save(),
      ..._.map(medications, (medication) => medication.save()),
    ]);

    // Send the first message
    prescription.sendNotification(`Hi ${name},\n\nWelcome to Mediscan!`);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.send();
});

// POST: /prescriptions/:id/subscribe
router.post('/:id/subscribe', async (req, res) => {
  try {
    await Prescription.update(
      {_id: req.params.id},
      {patientPhoneNumber: req.body.phoneNumber}
    );
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
  res.send();
});

// DELETE: /prescriptions
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

module.exports = router;
