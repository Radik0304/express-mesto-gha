const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

// получение пользователя по id
router.get('/:id', getUser);

// получение всех пользователей
router.get('/', getUsers);

// создание нового пользователя
router.post('/', createUser);

// обновление профиля
router.patch('/me', updateUserInfo);

// обновление аватара
router.patch('/me/avatar', updateUserAvatar);

module.exports.userRouter = router;
