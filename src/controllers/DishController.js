const ApiError = require('../errors/ApiError');
const {connection, getConnection} = require("../db");
const Controller = require('./Controller');
const dishRepo = require('../repositories/DishRepo');
const ingredientRepo = require('../repositories/IngredientRepo');
const cuisineRepo = require('../repositories/IngredientRepo');
const ValidationException = require("../errors/ValidationException");

class DishController extends Controller {
    async getAll(req, res, next) {
        let {name, ingredientId, cuisineId} = req.query;
        name = name ?? '';

        const filters = [];
        filters.relationsFilters = {};

        if (name) {
            filters.push({
                field: "DishName",
                compare: "LIKE",
                value: `%${name.toLowerCase()}%`
            });
        }
        if (ingredientId) {
            filters.relationsFilters.ingredientsId = ingredientId;
        }
        if (cuisineId) {
            filters.relationsFilters.cuisineid = cuisineId;
        }
        return await super.getAll(req, res, next,  filters, dishRepo.getAll);
    }

    async getOne(req, res, next) {
        try {
            const {dishId} = req.params;

            const dish = await dishRepo.getOne(dishId);
            dish.cuisines = await dishRepo.getCuisines(dishId);
            dish.ingredients = await dishRepo.getIngredients(dishId);

            if (dish)
                return res.status(200).json(dish);
            else
                return next(ApiError.notFound(`No dish with id ${dishId}`));
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async create(req, res, next) {
        try {
            const {dishName, price} = req.body;

            if (!dishName)
                return next(ApiError.badRequest("Incorrect value for dishName"));
            if (!price || price < 0)
                return next(ApiError.badRequest("Incorrect value for price"));

            const dish = await dishRepo.create(dishName, price)

            return res.status(200).json(dish);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {dishId} = req.params;
            const {dishName, price} = req.body;

            let newDish = {};

            if (dishName) {
                newDish.DishName = dishName;
            }
            if (price) {
                if (price < 0)
                    return next(ApiError.badRequest("Price is less than zero"));

                newDish.DishPrice = price;
            }

            if (!newDish.DishName && !newDish.DishPrice)
                return next(ApiError.badRequest("Incorrect values"));

            const dish = await dishRepo.getOne(dishId);

            if (!dish)
                return next(ApiError.notFound(`No dish with id ${dishId}`));

            await dishRepo.update(dishId, newDish);

            return res.status(200).json(await dishRepo.getOne(dishId));
        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {dishId} = req.params;

            await dishRepo.delete(dishId);

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async addIngredient(req, res, next) {
        try {
            const {dishId, ingredientId} = req.params;
            const {amount, units} = req.body;

            if (!amount || !units) {
                return next(ApiError.badRequest(`Amount or units are not provided`));
            }

            if (amount <= 0)
                return next(ApiError.badRequest(`Bad amount value`));

            const dish = await dishRepo.getOne(dishId);
            if (!dish)
                return next(ApiError.badRequest(`No dish with id ${dishId}`));

            const ingredient = await ingredientRepo.getOne(ingredientId);
            if (!ingredient)
                return next(ApiError.badRequest(`No ingredient with id ${ingredientId}`));

            if (await dishRepo.ingredientInDish(dishId, ingredientId))
                return next(ApiError.badRequest(`Ingredient already in dish`));

            await dishRepo.addIngredient(dishId, ingredientId, amount, units);
            return res.status(200).end();
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getIngredients(req, res, next) {
        try {
            const {dishId} = req.params;

            if (!await dishRepo.getOne(dishId))
                return next(ApiError.badRequest(`No dish with id ${dishId}`));

            const [ingredients] = await dishRepo.getIngredients(dishId);
            return res.status(200).json(ingredients);
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async updateIngredient(req, res, next) {
        try {
            const {dishId, ingredientId} = req.params;
            const {amount, units} = req.body;

            if (amount && amount <= 0)
                return next(ApiError.badRequest(`Invalid amount value`));

            if (units === '')
                return next(ApiError.badRequest(`Invalid units value`));

            await dishRepo.updateIngredient(dishId, ingredientId, amount, units);

            return res.status(200).end();
        } catch (e) {
            if (e instanceof ValidationException)
                return next(ApiError.badRequest(e.message));

            return next(ApiError.internal(e.message));
        }
    }

    async deleteIngredient(req, res, next) {
        try {
            const {dishId, ingredientId} = req.params;

            await dishRepo.deleteIngredient(dishId, ingredientId);

            return res.status(200).end();
        } catch (e) {
            next(ApiError.internal(e));
        }
    }

    async getCuisines(req, res, next) {
        try {
            const {dishId} = req.params;

            if (!await dishRepo.getOne(dishId))
                return next(ApiError.badRequest(`No dish with id ${dishId}`));

            const [cuisines] = await dishRepo.getCuisines(dishId);
            return res.status(200).json(cuisines);
        } catch (e) {
            return next(ApiError.internal(e));
        }
    }

    async addCuisine(req, res, next) {
        try {
            const {dishId, cuisineId} = req.params;

            if (!await dishRepo.getOne(dishId))
                return next(ApiError.badRequest(`No dish with id ${dishId}`));

            if (!await cuisineRepo.getOne(cuisineId))
                return next(ApiError.badRequest(`No cuisine with id ${cuisineId}`));

            if (await dishRepo.dishBelongsToCuisine(dishId, cuisineId))
                return next(ApiError.badRequest(`Dish already belongs to cuisine`));

            await dishRepo.addCuisine(dishId, cuisineId);
            return res.status(200).end();
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async deleteCuisine(req, res, next) {
        try {
            const {dishId, cuisineId} = req.params;

            await dishRepo.deleteCuisine(dishId, cuisineId);

            return res.status(200).end();
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = new DishController();
