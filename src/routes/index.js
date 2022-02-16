const Router = require('express');
const router = new Router();

const dishRouter = require('./dishRouter');
const ingredientsRouter = require('./ingredientsRouter');
const cuisineRouter = require('./cuisineRouter');
const systemRouter = require('./systemRouter');

router.use('/dish', dishRouter);
router.use('/ingredient', ingredientsRouter);
router.use('/cuisine', cuisineRouter);
router.use('/system', systemRouter);

module.exports = router;
