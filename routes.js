const router = require('express').Router();
const {body} = require('express-validator');

const {test} = require('./controllers/testController');
const {generateCoins} = require('./controllers/admin/generateCoinsController');
const {coinSearch} = require('./controllers/miner/coinSearchController');
const {createWallet} = require('./controllers/createWalletController');

router.get('/test',test);
router.get('/create-wallet',createWallet);

router.post('/generate-coins',[
    body('count',"Wrong count")
    .notEmpty()
    .trim(),
    body('value',"Wrong value")
    .notEmpty()
    .trim()
],generateCoins);

router.post('/coin-search',[
    body('addres',"Wrong addres")
    .notEmpty()
    .trim(),
    body('hash',"Wrong hash")
    .notEmpty()
    .trim()
],coinSearch);

module.exports = router;