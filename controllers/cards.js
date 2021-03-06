/* eslint-disable consistent-return */
const card = require('../models/card');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

// удаление карточки
const deleteCard = (req, res) => {
  const id = req.params.cardId;
  card.findByIdAndRemove(id)
    .then((photo) => {
      if (!photo) {
        res.status(ERROR_CODE_404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERROR_CODE_400).send({ message: 'Карточка не найдена' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// создание карточки
const createCard = (req, res) => {
  // console.log('req.body', req.body);
  // console.log('req.user._id', req.user._id);

  const { name, link, owner = req.user._id } = req.body;
  if (!name || !link || !owner) {
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  }

  card.create({ name, link, owner })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: 'Ошибка сервера' });
    });
};

// получение всех карточек
const getCards = (_, res) => {
  card.find({})
    .then((foundCards) => {
      res.status(200).send(foundCards);
    })
    .catch(() => {
      res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// поставить лайк
const putLikeTheCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((like) => {
      if (!like) {
        return res.status(ERROR_CODE_404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_400).send({ message: 'id не существует' });
      }
      return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
    });
};

// удалить лайк
const deleteLikeTheCard = (req, res) => card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((like) => {
    if (!like) {
      return res.status(ERROR_CODE_404).send({ message: 'id не существует' });
    }
    res.status(200).send({ data: like });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
    }
    return res.status(ERROR_CODE_500).send({ message: 'Серверная ошибка' });
  });

module.exports = {
  putLikeTheCard,
  deleteLikeTheCard,
  deleteCard,
  getCards,
  createCard,
};
