const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();


exports.createWallet = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        conn.execute('CREATE TABLE IF NOT EXISTS `wallets` (`id` int NOT NULL AUTO_INCREMENT, `addres` longtext NOT NULL, `value` double NOT NULL, `coins_found` int NOT NULL, `at_work` boolean NOT NULL, `work_type` int NOT NULL, `key` longtext NOT NULL, `create_date` datetime NOT NULL, `update_date` datetime NOT NULL, PRIMARY KEY (`id`))')


        let now = new Date();
        let isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');

        var length = 34,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "LURx0";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }

        var key_length = 15,
        key_charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        key = "";
        for (var i = 0, n = key_charset.length; i < key_length; ++i) {
            key += key_charset.charAt(Math.floor(Math.random() * n));
        }

        conn.execute('INSERT INTO `wallets`(`addres`,`value`,`coins_found`,`at_work`,`work_type`,`key`,`create_date`,`update_date`) VALUES(?,?,?,?,?,?,?,?)',[
            retVal,
            0,
            0,
            false,
            0,
            key,
            isoDate,
            isoDate
        ]);

        return res.json({
            addres:retVal,
            key:key
        });

    }
    catch(err){
        next(err);
    }
}