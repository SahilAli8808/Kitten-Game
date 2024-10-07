const express = require('express');
const { getGame, updateGame, resetGame } = require('../controllers/gameController');

const router = express.Router();

router.get('/', getGame);
router.put('/', updateGame);
router.delete('/', resetGame);

module.exports = router;
