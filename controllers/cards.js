const card = require('../models/card');

// удаление карточки
const deleteCard = (req, res) => {
  const id = req.params.cardId;
  card.findByIdAndRemove(id)
    .then((photo) => {
      if (!photo) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// создание карточки
const createCard = (req, res) => {
  // console.log('req.body', req.body);
  // console.log('req.user._id', req.user._id);

  const { name, link, owner = req.user._id } = req.body;
  if (!name || !link || !owner) {
    return res.status(400).send({ message: 'Переданы некорректные данные' });
  }

  card.create({ name, link, owner })
    .then(card => {
      res.status(201).send(card);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// получение всех карточек
const getCards = (_, res) => {
  card.find({})
    .then(cards => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: 'Серверная ошибка' });
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
      if (req.user._id) {
        return res.status(404).send({ message: 'Переданы некорректные данные' });
      }
      res.status(200).send(like);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({ message: 'id не существует' });
      }
      return res.status(500).send({ message: 'Серверная ошибка' });
    });
};

// удалить лайк
const deleteLikeTheCard = (req, res) => card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((like) => {
    if (req.user._id) {
      return res.status(404).send({ message: 'Переданы некорректные данные' });
    }
    res.status(200).send(like);
  })
  .catch((err) => {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({ message: 'id не существует' });
    }
    return res.status(500).send({ message: 'Серверная ошибка' });
  });

module.exports = {
  putLikeTheCard,
  deleteLikeTheCard,
  deleteCard,
  getCards,
  createCard,
};
