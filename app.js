const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handleErrors = require('./middlewares/error-handler');
const corsOption = require('./middlewares/cors');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const app = express();

// логгер запросов
app.use(requestLogger);

app.use(helmet());

// парсим данные (собираем пакеты)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к серверу mongo
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  autoIndex: true,
});

// cors запросы
app.use(cors(corsOption));

// корневой роут
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обработчики ошибок celebrate
app.use(errors());

// обрабатываем остальные ошибки
app.use(handleErrors);

app.listen(PORT, () => PORT);