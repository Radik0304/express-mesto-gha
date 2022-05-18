const res = require('express/lib/response');
const user = require('../models/user');

// получение одного пользователя
const getUser = (req, res) => {
  const id= req.params.id;
  user.findById(id)
    .then(user => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(400).send({ message: 'Введенный id некоректен' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// создание нового пользователя
const createUser = (req, res) => {
  // console.log('req.body', req.body);
  const { name, about, avatar } = req.body;
  if (!name || !about || !avatar) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  user.create({ name, about, avatar })
    .then(user => {
      res.status(201).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// получение всех пользователей
const getUsers = (_, res) => {
  user.find({})
    .then(users => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// обновление профиля
const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  user.findByIdAndUpdate(req.user._id, { name, about })
    .then(() => {
      if (!name || !about) {
        return res.status(400).send('Переданы некорректные данные');
      }
      res.send({ message: 'Информация успешно обновлена' });
    })
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

// обновление аватара
const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  user.findByIdAndUpdate(req.user._id, { avatar })
    .then(() => {
      if (!avatar) {
        return res.status(400).send('Переданы некорректные данные');
      }
      res.send({ message: 'Аватар успешно обновлен' });
    })
    .catch(() => res.status(500).send({ message: 'Серверная ошибка' }));
};

module.exports = {
  updateUserAvatar,
  updateUserInfo,
  getUser,
  getUsers,
  createUser,
};
