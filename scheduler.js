'use strict';

const CronJob = require('cron').CronJob;
const workers = require('./workers/notificationsWorker');
const moment = require('moment');

const schedulerFactory = function() {
  return {
    start: function() {
      new CronJob(
        '0 0 * * * *', // Every 60 minutes
        function() {
          console.log(
            'Running Send Notifications Worker for ' + moment().format()
          );
          workers.notificationWorkerFactory.run();
        },
        null,
        true,
        ''
      );
      new CronJob(
        '0 00,30 * * * *', // Every 30 minutes
        function() {
          console.log(
            'Running Send Retry Worker for ' + moment().format()
          );
          workers.retryWorkerFactory.run();
        },
        null,
        true,
        ''
      );
      new CronJob(
        '0 00,30 * * * *', // Every 30 minutes
        function() {
          console.log(
            'Running Send Notifications Worker for ' + moment().format()
          );
          workers.alertWorkerFactory.run();
        },
        null,
        true,
        ''
      );
    },
  };
};

module.exports = schedulerFactory();
