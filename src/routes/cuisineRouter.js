const Router = require('express');
const router = new Router();
const cuisineController = require('../controllers/CuisineController');

router.get('/', cuisineController.getAll);
router.post('/', cuisineController.create);
router.get('/:cuisineId', cuisineController.getOne);
router.put('/:cuisineId', cuisineController.update);
router.delete('/:cuisineId', cuisineController.delete);

module.exports = router;
