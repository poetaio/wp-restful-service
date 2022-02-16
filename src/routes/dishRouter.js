const Router = require('express');
const router = new Router();
const dishController = require('../controllers/DishController');

router.get("/", dishController.getAll);
router.post("/", dishController.create);
router.get("/:dishId", dishController.getOne);
router.put("/:dishId", dishController.update);
router.delete("/:dishId", dishController.delete);

router.post("/:dishId/add-ingredient/:ingredientId", dishController.addIngredient);
router.get("/:dishId/get-ingredients", dishController.getIngredients);
router.put("/:dishId/update-ingredient/:ingredientId", dishController.updateIngredient);
router.delete("/:dishId/delete-ingredient/:ingredientId", dishController.deleteIngredient);

router.get("/:dishId/get-cuisines", dishController.getCuisines);
router.post("/:dishId/add-cuisine/:cuisineId", dishController.addCuisine);
router.delete("/:dishId/delete-cuisine/:cuisineId", dishController.deleteCuisine);

module.exports = router;
