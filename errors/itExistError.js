const { ERROR_CODE_IT_EXIST } = require('../utils/constants');

class ItExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_IT_EXIST;
  }
}

module.exports = ItExistError;