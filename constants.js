const HOURS = {
  MORNING: 8,
  AFTERNOON: 12,
  EVENING: 18,
  NIGHT: 22,
};

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'http://mediscan.herokuapp.com/api'
    : 'http://localhost:3000/api';

const CLIENT_URL = 'http://mediscan.surge.sh/#/';

module.exports = {
  HOURS,
  API_URL,
  CLIENT_URL,
};
