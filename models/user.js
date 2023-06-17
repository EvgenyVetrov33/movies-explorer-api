const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/authError');

// схема пользователя
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'email обязательно должен быть указан'],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неверный формат почты',
    },
  },
  password: {
    type: String,
    required: [true, 'пароль обязательно должен быть указан'],
    select: false,
    minlength: [4, 'пароль не может быть короче четырех символов'],
  },
  name: {
    type: String,
    required: [true, 'имя обязательно должно быть указанно'],
    minlength: [2, 'имя пользователя не может быть короче двух символов'],
    maxlength: [30, 'имя пользователя не может быть длиннее 30 символов'],
  },
});

// удаляем из документа пользователя поле password
userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// добавляем метод findUserByCredentials схеме пользователя
// он принимает на вход два параметра — почту и пароль
// — и возвращает объект пользователя или ошибку.
userSchema.statics.findUserByCredentials = function getUserIfAuth(email, password) {
  // ищем пользователя по почте
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // не нашёлся — отклоняем промис
        return Promise.reject(new AuthError('Вы ввели неправильный логин или пароль'));
      }
      // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new AuthError('Вы ввели неправильный логин или пароль'));
          }
          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);