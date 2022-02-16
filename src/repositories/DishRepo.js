const ApiError = require("../errors/ApiError");
const {CrudRepo} = require("./CrudRepo");
const {connection} = require("../db");
const ValidationException = require("../errors/ValidationException");

class DishRepo extends CrudRepo {
    constructor() {
        super("Dishes");
    }

    async create(dishName, price) {
        const [dishRes] = await connection.execute("INSERT INTO Dishes Values(NULL, ?, ?)", [dishName, price]);

        return {
            dishId: dishRes.insertId,
            dishName: dishName,
            price: price
        };
    }

    async getIngredients(dishId) {
        const [res] = await connection.query(`SELECT IngredientInDish.IngredientId, IngredientName, Amount, Units 
            FROM IngredientInDish INNER JOIN Ingredients USING(IngredientId) WHERE DishId = ?`, [dishId]);
        return res;
    }

    async addIngredient(dishId, ingredientId, amount, units) {
        await connection.query("INSERT INTO IngredientInDish VALUES(?, ?, ?, ?)",
            [dishId, ingredientId, amount, units]);
    }

    async updateIngredient(dishId, ingredientId, amount, units) {
        const fields = [];
        const values = [];

        if (amount) {
            fields.push(`Amount`);
            values.push(amount);
        }

        if (units) {
            fields.push(`Units`);
            values.push(units);
        }

        if (!fields.length)
            throw ValidationException(`No update values provided`);

        const setSt = `SET ${fields.map((field) => `${field} = ?`).join(', ')}`;

        await connection.query(`UPDATE IngredientInDish ${setSt} WHERE DishId = ? AND IngredientId = ?`,
            [...values, dishId, ingredientId]);
    }

    async deleteIngredient(dishId, ingredientId) {
        await connection.query(`DELETE FROM IngredientInDish WHERE DishId = ? AND IngredientId = ?`,
            [dishId, ingredientId]);
    }

    async ingredientInDish(dishId, ingredientId) {
        const [ingredient] = await connection.query(`SELECT * FROM IngredientInDish WHERE DishId = ? AND IngredientId = ?`,
            [dishId, ingredientId]);

        return !!ingredient.length;
    }

    async getCuisines(dishId) {
        const [res] = await connection.query(`SELECT DishCuisine.CuisineId, CuisineName 
            FROM DishCuisine INNER JOIN Cuisines USING(CuisineId) WHERE DishId = ?`, [dishId]);
        return res;
    }
    
    async addCuisine(dishId, cuisineId) {
        await connection.query("INSERT INTO DishCuisine VALUES(?, ?)",
            [dishId, cuisineId]);
    }

    async deleteCuisine(dishId, cuisineId) {
        await connection.query(`DELETE FROM DishCuisine WHERE DishId = ? AND CuisineId = ?`,
            [dishId, cuisineId]);
    }
    
    async dishBelongsToCuisine(dishId, cuisineId) {
        const [cuisine] = await connection.query(`SELECT * FROM DishCuisine WHERE DishId = ? AND CuisineId = ?`,
            [dishId, cuisineId]);

        return !!cuisine.length;
    }

    async fillDB() {
        const borsch = await this.create("Borsch", 5.99);
        const varenyky = await this.create("Varenyky", 7.40);
        const noodles = await this.create("Noodles", 4.50);
        const spaghetti = await this.create("Spaghetti", 2.99);

        await this.addCuisine(borsch.dishId, 5);
        await this.addCuisine(varenyky.dishId, 5);
        await this.addCuisine(noodles.dishId, 1);
        await this.addCuisine(noodles.dishId, 2);
        await this.addCuisine(noodles.dishId, 3);
        await this.addCuisine(spaghetti.dishId, 7);

        await this.addIngredient(borsch.dishId, 1, 1, 'liter');
        await this.addIngredient(borsch.dishId, 2, 2, 'tablespoons');
        await this.addIngredient(borsch.dishId, 3, 1, 'spoons');
        await this.addIngredient(borsch.dishId, 4, 1, 'piece');

        await this.addIngredient(varenyky.dishId, 1, 1, 'liter');
        await this.addIngredient(varenyky.dishId, 2, 1, 'spoons');
        await this.addIngredient(varenyky.dishId, 4, 1, 'piece');

        await this.addIngredient(noodles.dishId, 5, 1.5, 'kg');
        await this.addIngredient(spaghetti.dishId, 5, 1, 'kg');
    }
}

module.exports = new DishRepo();
