/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

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

// получение информации о текущем пользователе
const getCurrentUser = (req, res, next) => {
  user.findById(req.user._id)
    .then((userMe) => {
      res.send({ data: userMe });
    })
    .catch((err) => {
      next(err);
    });
};

// создание нового пользователя
const createUser = (req, res) => {
  // console.log('req.body', req.body);
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      user.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
    .then(() => {
      res.status(201).send({ message: 'fuck' });
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
  user.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь отсутствует' });
      }
      res.send(updatedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((userAvatar) => {
      if (!userAvatar) {
        return res.status(ERROR_CODE_404).send({ message: 'Пользователь отсутствует' });
      }
      res.send(userAvatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      }
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// логин пользователя
const login = (req, res) => {
  const { email, password } = req.body;
  return user.findUserByCredentials(email, password)
    .then((userAuth) => {
      const token = jwt.sign({ id: userAuth._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 604800000,
        httpOnly: true,
      }).send({ data: token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  updateUserAvatar,
  updateUserInfo,
  getUser,
  getUsers,
  createUser,
  login,
  getCurrentUser,
};
