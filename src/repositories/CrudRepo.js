const {connection} = require('../db');

class CrudRepo {
    constructor(tableName) {
        this.tableName= tableName;
        this.pk = `${tableName.substring(0, tableName.length - 1)}Id`;
        connection.query(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`)
            .then(([res]) => this.pk = res[0].Column_name);
        this.getAll = this.getAll.bind(this);
    }

    async getAll(filters, limit, offset) {
        const values = [];
        let sqlSt = `SELECT * FROM ${this.tableName}`;
        const whereStArr = [];

        if (filters.length) {
            for (const {field, compare, value} of filters) {
                whereStArr.push(`${field} ${compare} ?`);
                values.push(value);
            }
        }

        if (whereStArr.length) {
            sqlSt += ` WHERE ${whereStArr.join('AND')}`;
        }

        values.push(Number.parseInt(limit), offset);
        sqlSt += " LIMIT ? OFFSET ?";

        const [rows] = await connection.query(sqlSt, values);

        return rows;
    }

    async getOne(valueId) {
        const [value] = await connection.query(`SELECT * FROM ${this.tableName} WHERE ${this.pk} = ?`, [valueId]);

        if (value)
            return value[0];
        else
            return null;
    }

    async update(valueId, newValue) {
        const values = [...Object.values(newValue), valueId];
        const setFields = Object.keys(newValue)
            .filter((key) => key !== this.pk)
            .map((key) => `${key} = ?`)
            .join(', ');

        return await connection.query(`UPDATE ${this.tableName} SET ${setFields} WHERE ${this.pk} = ?`, values);
    }

    async delete(valueId) {
        await connection.query(`DELETE FROM ${this.tableName} WHERE ${this.pk} = ?`, [valueId]);
    }
}

module.exports = {
    CrudRepo
};
