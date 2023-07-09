const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ValidationError = require('../errors/validationError');
const ItExistError = require('../errors/itExistError');
const NotFoundError = require('../errors/notFoundError');

const { NODE_ENV, JWT_SECRET = 'some-secret-key' } = process.env;

// возвращает информацию о пользователе (email и имя)
const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ItExistError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// создаёт пользователя с переданными в теле email, password и name
const createUser = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!password || password.length < 4) {
    next(new ValidationError('Пароль отсутствует или короче четырех символов'));
  }

  // хешируем пароль
  bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ItExistError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

// проверяет переданные в теле почту и пароль и возвращает JWT
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.localStorage.removeItem('jwt').send({ message: 'Выход выполнен' });
};

module.exports = {
  getUser,
  updateUser,
  createUser,
  login,
  logout
};