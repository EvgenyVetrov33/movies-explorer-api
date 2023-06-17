const { ERROR_CODE_NO_RIGHTS } = require('../utils/constants');

class NoRightsError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = ERROR_CODE_NO_RIGHTS;
  }
}

module.exports = NoRightsError;