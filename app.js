const express = require('express');
const mongoose = require('mongoose');
const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());
const { PORT = 3000 } = process.env;
const ERROR_CODE_404 = 404;

// подключаем роуты пользователей
app.use((req, _, next) => {
  req.user = {
    _id: '62853390cf2006abc99f8e79',
  };
  next();
});
app.use('/users', userRouter);

// подключаем роуты карточек
app.use('/cards', cardRouter);

// переход на несуществующий роут
app.use((_, res) => {
  res.status(ERROR_CODE_404).send({ message: 'Страница отсутствует' });
});
app.listen(PORT, () => {
  console.log('Server has been started!');
});
