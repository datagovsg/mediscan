'use strict';

const Prescription = require('../models/prescription');
const Message = require('../models/message');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Prescription.sendReminders();
    },
  };
};

const retryWorkerFactory = function() {
  return {
    run: function() {
      Message.sendRetries();
    },
  };
};

const alertWorkerFactory = function() {
  return {
    run: function() {
      Message.sendAlerts();
    },
  };
};

module.exports = {
	notificationWorkerFactory: notificationWorkerFactory(),
	retryWorkerFactory: retryWorkerFactory(),
	alertWorkerFactory: alertWorkerFactory(),
};
