const ApiError = require('../errors/ApiError');
const Controller = require('./Controller');
const {connection} = require("../db");
const ingredientRepo = require("../repositories/IngredientRepo");
const dishRepo = require("../repositories/DishRepo");
const cuisineRepo = require("../repositories/CuisineRepo");

class IngredientController extends Controller {
    async getAll(req, res, next) {

        let {name} = req.query;
        name = name ?? '';

        const filters = [];

        if (name) {
            filters.push({
                field: "IngredientName",
                compare: "LIKE",
                value: `%${name}%`
            });
        }

        return await super.getAll(req, res, next, filters, ingredientRepo.getAll);
    }

    async getOne(req, res, next) {
        const {ingredientId} = req.params;

        const ingredient = await ingredientRepo.getOne(ingredientId);

        if (ingredient)
            return res.status(200).json(ingredient);
        else
            return next(ApiError.notFound(`No ingredient with id ${ingredientId}`));
    }

    async create(req, res, next) {
        try {
            const {ingredientName} = req.body;

            if (!ingredientName)
                return next(ApiError.badRequest("Incorrect value for ingredientName"));

            if (await ingredientRepo.getOneByName(ingredientName))
                return next(ApiError.badRequest("ingredient with such name already exists"));

            const ingredient = ingredientRepo.create(ingredientName);

            return res.status(200).json(ingredient);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {ingredientId} = req.params;
            const {ingredientName} = req.body;

            let newIngredient = {};

            if (ingredientName)
                newIngredient.IngredientName = ingredientName;
            else
                return next(ApiError.badRequest("Incorrect values"));

            const ingredient = await ingredientRepo.getOne(ingredientId);

            if (!ingredient)
                return next(ApiError.notFound(`No dish with id ${ingredientId}`));

            await ingredientRepo.update(ingredientId, newIngredient);

            return res.status(200).json(await ingredientRepo.getOne(ingredientId));
        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {ingredientId} = req.params;

            if (await ingredientRepo.ingredientInDishes(ingredientId))
                return next(ApiError.badRequest(`Unable to delete: ingredient belongs to dishes`));

            await ingredientRepo.delete(ingredientId);

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new IngredientController();
