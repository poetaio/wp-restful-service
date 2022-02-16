const {connection} = require("../db");
const {CrudRepo} = require('./CrudRepo');

class IngredientRepo extends CrudRepo {
    constructor() {
        super("Ingredients");
    }

    async create(ingredientName) {
        const [ingredientRes] = await connection.execute("INSERT INTO Ingredients Values(NULL, ?)", [ingredientName]);
        return {
            ingredientId: ingredientRes.insertId,
            dishName: ingredientName
        };
    }

    async getOneByName(ingredientName) {
        const [ingredient] = await connection.query(`SELECT * FROM Ingredients WHERE IngredientName = ?`, [ingredientName]);

        if (ingredient)
            return ingredient[0];
        else
            return null;
    }

    async ingredientInDishes(ingredientId) {
        const [res] = await connection.query('SELECT * FROM IngredientInDish WHERE IngredientId = ?',
            [ingredientId]);
        return !!res;
    }

    async fillDB() {
        await this.create("Water");
        await this.create("Salt");
        await this.create("Pepper");
        await this.create("Cabbage");
        await this.create("Dough");
    }
}

module.exports = new IngredientRepo();
