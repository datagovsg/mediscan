'use strict';

const Prescription = require('../models/prescription');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Prescription.sendReminders();
    },
  };
};

module.exports = notificationWorkerFactory();
