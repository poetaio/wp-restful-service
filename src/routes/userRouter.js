const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');

router.get('/', userController.getAll);
router.post('/', userController.create);
router.get('/:userId', userController.getOne);
router.put('/:userId', userController.update);
router.delete('/:userId', userController.delete);

module.exports = router;
