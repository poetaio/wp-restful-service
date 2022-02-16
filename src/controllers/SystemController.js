const ApiError = require('../errors/ApiError');
const {connection, connectionCallback} = require('../db');
const dishRepo = require('../repositories/DishRepo');
const ingredientRepo = require('../repositories/IngredientRepo');
const cuisineRepo = require('../repositories/CuisineRepo');
const orderRepo = require('../repositories/OrderRepo');

const createTableDishes = `CREATE TABLE IF NOT EXISTS Dishes(
  DishId int primary key auto_increment,
  DishName varchar(255) not null,
  DishPrice float not null
);`;

const createTableIngredients = `CREATE TABLE IF NOT EXISTS Ingredients(
  IngredientId int primary key auto_increment,
  IngredientName varchar(255) not null unique
);`;

const createTableCuisines = `CREATE TABLE IF NOT EXISTS Cuisines(
  CuisineId int primary key auto_increment,
  CuisineName varchar(255) not null unique 
);`;

const createTableOrders = `CREATE TABLE IF NOT EXISTS Orders(
  OrderId int primary key auto_increment,
  OrderDate date not null,
  ClientComment varchar(255) not null
);`;

const createTableDishCuisine = `CREATE TABLE IF NOT EXISTS DishCuisine(
  DishId int not null,
  CuisineId int not null,
  FOREIGN KEY (DishId) REFERENCES Dishes(DishId) ON DELETE CASCADE,
  FOREIGN KEY (CuisineId) REFERENCES Cuisines(CuisineId) ON DELETE NO ACTION,
  PRIMARY KEY (DishId, CuisineId)
);`;

const createTableIngredientInDish = `CREATE TABLE IF NOT EXISTS IngredientInDish(
  DishId int not null,
  IngredientId int not null,
  FOREIGN KEY (DishId) REFERENCES Dishes(DishId) ON DELETE CASCADE,
  FOREIGN KEY (IngredientId) REFERENCES Ingredients(IngredientId) ON DELETE NO ACTION,
  PRIMARY KEY (DishId, IngredientId),
  Amount int not null,
  Units varchar(20) not null
);`

const createTableDishInOrder = `CREATE TABLE IF NOT EXISTS DishInOrder(
  DishId int not null,
  OrderId int not null,
  FOREIGN KEY (DishId) REFERENCES Dishes(DishId),
  FOREIGN KEY (OrderId) REFERENCES Cuisines(CuisineId),
  NumberOfDishes int not null,
  PRIMARY KEY (DishId, OrderId)
);`

const dropTableSt = (tableName) => `DROP TABLE IF EXISTS ${tableName}`;

class SystemController {
    async clearDB(req, res, next) {
        try {
            await connection.query(dropTableSt("DishCuisine"));
            await connection.query(dropTableSt("IngredientInDish"));
            await connection.query(dropTableSt("DishInOrder"));

            await connection.query(dropTableSt("Dishes"));
            await connection.query(dropTableSt("Ingredients"));
            await connection.query(dropTableSt("Cuisines"));
            await connection.query(dropTableSt("Orders"));
            await connection.query(dropTableSt("Users"));

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async createDB(req, res, next) {
        try {
            await connection.query(createTableDishes);
            await connection.query(createTableIngredients);
            await connection.query(createTableCuisines);
            await connection.query(createTableUsers);
            await connection.query(createTableOrders);

            await connection.query(createTableDishCuisine);
            await connection.query(createTableIngredientInDish);
            await connection.query(createTableDishInOrder);

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }

    async fillDB(req, res, next) {
        try {
            await ingredientRepo.fillDB();
            await cuisineRepo.fillDB();
            await dishRepo.fillDB();
            await orderRepo.fillDB();

            return res.status(200).end();
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    }
}

module.exports = new SystemController();

