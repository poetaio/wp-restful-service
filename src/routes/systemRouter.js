const Router = require('express');
const router = new Router();
const systemController = require('../controllers/SystemController');

router.use('/create-db', systemController.createDB);
router.use('/clear-db', systemController.clearDB);
router.use('/fill-db', systemController.fillDB);

module.exports = router;
