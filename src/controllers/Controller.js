const ApiError = require("../errors/ApiError");
const {repo} = require("../repositories/CrudRepo");

const {connection} = require("../db");

class Controller {
    async getAll(req, res, next, filters, getAll) {
        try {
            let {limit, page} = req.query;

            if (page < 1)
                return next(ApiError.badRequest("Incorrect page value (1+)"));
            if (limit < 1 || limit > 100)
                return next(ApiError.badRequest("Incorrect limit value (1-100)"));

            page = page || 1;
            limit = limit ?? 10;

            const offset = (page - 1) * limit;

            const rows = await getAll(filters, Number.parseInt(limit), offset);

            return res.status(200).json(rows);
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }
}

module.exports = Controller;
