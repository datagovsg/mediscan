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

  res.render('prescriptions/index', {prescriptions: prescriptions});
});

// GET: /prescriptions
router.get('/prescriptions', async (req, res) => {
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

  res.render('prescriptions/index', {prescriptions: prescriptions});
});

// GET: /prescriptions/view/:id
router.get('/prescriptions/view/:id', async function(req, res) {
  // Prescription id
  let id = req.params.id;
  const prescription = await Prescription.findOne({_id: id});
  // Generate QR code that redirects to patient view (client)
  const qrCode = await prescription.generateQR();
  // Map medication IDs to medication objects in prescription object
  prescription.medications = await Medication.find({
    _id: {$in: prescription.medications},
  });
  res.render('prescriptions/view',
    {
      prescription: prescription, qrCode: qrCode,
    });
});

// GET: /prescriptions/create
router.get('/prescriptions/create', function(req, res, next) {
  res.render('prescriptions/create', {
    prescription: {
      name: '',
      phoneNumber: '',
      medications: [
        {
          name: '',
          quantity: '',
          units: '',
          remarks: '',
          frequency: '',
        },
      ],
    },
  });
});

// POST: /prescriptionis/remind
router.post('/:id/remind', async (req, res) => {
  const id = req.params.id;
  const prescription = await Prescription.findOne({_id: id});
  await prescription.sendReminder();

  res.send();
});

// POST: /prescriptions
router.post('/', async (req, res) => {
  function convertArrayToMedication(input) {
    return new Medication({
      name: input[0],
      quantity: input[1],
      units: input[2],
      frequency: input[3],
      remarks: input[4] || '',
    });
  }
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
      name,
      medications,
    });
    await Promise.all([
      prescription.save(),
      ..._.map(medications, (medication) => medication.save()),
    ]);

    // Send the first message
    prescription.sendNotification(`Hi ${name},\n\nWelcome to Mediscan!`);
    res.redirect('/');
  } catch (error) {
    console.log(error);
  }
});

// POST: /prescriptions/:id/delete
router.post('/prescriptions/:id/delete', async (req, res) => {
  const id = req.params.id;
  await Prescription.remove({_id: id});

  // res.send();
  res.redirect('/');
});

// DELETE: /prescriptions
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  await Prescription.remove({_id: id});

  res.redirect('/');
});

module.exports = router;
