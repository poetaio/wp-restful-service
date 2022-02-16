const Router = require('express');
const router = new Router();
const ingredientController = require('../controllers/IngredientController');

router.get('/', ingredientController.getAll);
router.post("/", ingredientController.create);
router.get("/:ingredientId", ingredientController.getOne);
router.put("/:ingredientId", ingredientController.update);
router.delete("/:ingredientId", ingredientController.delete);

module.exports = router;
