'use strict';

const _ = require('lodash');
const express = require('express');
const Prescription = require('../models/prescription');
const Medication = require('../models/medication');
const router = new express.Router();


// GET: /prescriptions
router.get('/', async (req, res) => {
  const prescriptions = await Prescription.find().select('-__v');
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

module.exports = router;
