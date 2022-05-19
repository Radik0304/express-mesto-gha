/* eslint-disable consistent-return */
const user = require('../models/user');

// коды ошибок
const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

// получение одного пользователя
const getUser = (req, res) => {
  // const { id } = req.params.id;
  user.findById(req.params.id)
    .then((oneUser) => {
      if (!oneUser) {
        res.status(ERROR_CODE_404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(oneUser);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERROR_CODE_400).send({ message: 'Введенный id некоректен' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// создание нового пользователя
const createUser = (req, res) => {
  // console.log('req.body', req.body);
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  }

  user.create({ name, about, avatar })
    .then((newUser) => {
      res.status(201).send(newUser);
    })
    .catch(((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    }));
};

// получение всех пользователей
const getUsers = (_, res) => {
  user.find({})
    .then((allUsers) => {
      res.status(200).send(allUsers);
    })
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// обновление профиля
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about })
    .then((updatedUser) => {
      if (!name || !about) {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      res.send(updatedUser);
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' }));
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar })
    .then((userAvatar) => {
      if (!userAvatar) {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      res.send(userAvatar);
    })
    .catch(() => res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' }));
};

module.exports = {
  updateUserAvatar,
  updateUserInfo,
  getUser,
  getUsers,
  createUser,
};
