const {CrudRepo} = require('./CrudRepo');
const {connection} = require("../db");

class CuisineRepo extends CrudRepo {
    constructor() {
        super("Cuisines");
    }

    async create(cuisineName) {
        const [cuisineRes] = await connection.execute("INSERT INTO Cuisines Values(NULL, ?)", [cuisineName]);
        return {
            cuisineId: cuisineRes.insertId,
            cuisineName: cuisineName
        };
    }

    async getOneByName(cuisineName) {
        const [cuisine] = await connection.query(`SELECT * FROM Cuisines WHERE CuisineName = ?`, [cuisineName]);

        if (cuisine)
            return cuisine[0];
        else
            return null;
    }

    async cuisineHasDishes(cuisineId) {
        const [res] = await connection.query('SELECT * FROM DishCuisine WHERE CuisineId = ?',
            [cuisineId]);
        return !!res;
    }

    async fillDB() {
        await this.create("Chinese");
        await this.create("Korean");
        await this.create("Japanese");
        await this.create("French");
        await this.create("Ukrainian");
        await this.create("Indian");
        await this.create("Italian");
    }
}

module.exports = new CuisineRepo();
