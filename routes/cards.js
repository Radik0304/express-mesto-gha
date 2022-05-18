const router = require('express').Router();
const {
  deleteCard,
  getCards,
  createCard,
  putLikeTheCard,
  deleteLikeTheCard,
} = require('../controllers/cards');

// удаление карточки
router.delete('/:cardId', deleteCard);

// получение всех карточек
router.get('/', getCards);

// создание новой карточки
router.post('/', createCard);

// поставить лайк
router.put('/:cardId/likes', putLikeTheCard);

// удалить лайк
router.delete('/:cardId/likes', deleteLikeTheCard);

module.exports.cardRouter = router;
