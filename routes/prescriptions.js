'use strict';

const _ = require('lodash');
const express = require('express');
const Prescription = require('../models/prescription');
const Medication = require('../models/medication');
const router = new express.Router();

// GET: /prescriptions
router.get('/', async (req, res) => {
  let prescriptions = await Prescription.find()
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

  res.send(JSON.stringify(prescriptions));
});

// POST: /prescriptions
router.post('/', async (req, res) => {
  const {name, phoneNumber} = req.body;

  const medications = _.map(
    req.body.medications,
    (medication) => new Medication(medication)
  );

  const prescription = new Prescription({
    name,
    phoneNumber,
    medications,
  });
  await Promise.all([
    prescription.save(),
    ..._.map(medications, (medication) => medication.save()),
  ]);

  res.send();
});

// DELETE: /prescriptions
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  await Prescription.findOne({id}).remove();

  res.send();
});

module.exports = router;
