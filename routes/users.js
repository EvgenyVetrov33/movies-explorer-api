const router = require('express').Router();

const { getUser, updateUser } = require('../controllers/users');
const { validateUserProfile } = require('../middlewares/validation');

// возвращает информацию о пользователе (email и имя)
router.get('/me', getUser);

// обновляет информацию о пользователе (email и имя)
router.patch('/me', validateUserProfile, updateUser);

module.exports = router;