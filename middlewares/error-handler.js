const { ERROR_CODE_SERVER } = require('../utils/constants');

// обработчик ошибок
const handleErrors = (err, req, res, next) => {
  const { statusCode = ERROR_CODE_SERVER, message } = err;
  res.status(statusCode)
    .send({
      message: statusCode === ERROR_CODE_SERVER
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
};

module.exports = handleErrors;