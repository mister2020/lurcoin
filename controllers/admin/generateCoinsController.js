const {validationResult} = require('express-validator');
const conn = require('../../dbConnection').promise();


exports.generateCoins = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        conn.execute('CREATE TABLE IF NOT EXISTS `coins` (`id` int NOT NULL AUTO_INCREMENT, `hash` longtext, `value` double NOT NULL, `is_found` boolean NOT NULL, `is_solo` boolean, `solo_seeker` longtext, `seekers_count` int NOT NULL, `seeker_reward` int, `create_date` datetime NOT NULL, `update_date` datetime NOT NULL, PRIMARY KEY (`id`))')

        let increment = 0;
        while(increment < Number(req.body.count)) {

            let now = new Date();
            let isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');

            var length = 3,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
            for (var i = 0, n = charset.length; i < length; ++i) {
                retVal += charset.charAt(Math.floor(Math.random() * n));
            }

            conn.execute('INSERT INTO `coins`(`hash`,`value`,`is_found`,`is_solo`,`solo_seeker`,`seekers_count`,`seeker_reward`,`create_date`,`update_date`) VALUES(?,?,?,?,?,?,?,?,?)',[
                retVal,
                Number(req.body.value),
                false,
                false,
                "",
                0,
                0,
                isoDate,
                isoDate
            ]);

            increment++;
        }

        return res.json({
            test:"Done."
        });

    }
    catch(err){
        next(err);
    }
}