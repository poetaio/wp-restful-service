const ApiError = require('../errors/ApiError')
const Controller = require("./Controller");
const cuisineRepo = require("../repositories/CuisineRepo");

class CuisineController extends Controller {
    async getAll(req, res, next) {
        try {
            let {name} = req.query;
            name = name ?? '';

            const filters = [];

            if (name) {
                filters.push({
                    field: "CuisineName",
                    compare: "LIKE",
                    value: `%${name.toLowerCase()}%`
                });
            }

            return await super.getAll(req, res, next,  filters, cuisineRepo.getAll);
        } catch (e) {
            return ApiError.internal(e.message);
        }
    }

    async getOne(req, res, next) {
        try {
            const {cuisineId} = req.params;

            const cuisine = await cuisineRepo.getOne(cuisineId);

            if (cuisine)
                return res.status(200).json(cuisine);
            else
                return next(ApiError.notFound(`No cuisine with id ${cuisineId}`));
        } catch (e) {
            return ApiError.internal(e.message);
        }
    }

    async create(req, res, next) {
        try {
            const {cuisineName} = req.body;

            if (!cuisineName)
                return next(ApiError.badRequest("Incorrect value for cuisineName"));

            if (await cuisineRepo.getOneByName(cuisineName))
                return next(ApiError.badRequest("Cuisine with such name already exists"));

            const cuisine = await cuisineRepo.create(cuisineName);

            return res.status(200).json(cuisine);
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const {cuisineId} = req.params;
            const {cuisineName} = req.body;

            let newCuisine = {};

            if (cuisineName)
                newCuisine.CuisineName = cuisineName;
            else
                return next(ApiError.badRequest("Incorrect values"));

            if (!await cuisineRepo.getOne(cuisineId))
                return next(ApiError.notFound(`No cuisine with id ${cuisineId}`));

            await cuisineRepo.update(cuisineId, newCuisine);

            return res.status(200).json(await cuisineRepo.getOne(cuisineId));
        } catch (e) {
            return next(ApiError.internal(e.message))
        }

    }

    async delete(req, res, next) {
        try {
            const {cuisineId} = req.params;

            if (await cuisineRepo.cuisineHasDishes(cuisineId))
                return next(ApiError.badRequest(`Unable to delete: cuisine has dishes`));

            await cuisineRepo.delete(cuisineId);

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new CuisineController();
