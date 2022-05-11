const {validationResult} = require('express-validator');
const conn = require('../../dbConnection').promise();


exports.coinSearch = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [wallet_row] = await conn.execute(
            "SELECT * FROM `wallets` WHERE `addres`=?",
            [req.body.addres]
        );

        if (wallet_row.length === 0) {
            return res.json({
                result:"Wallet not found."
            });
        }

        conn.execute(
            "UPDATE `wallets` SET `at_work`=true WHERE `addres`=?",
            [req.body.addres]
        );

        setTimeout(() => {
            conn.execute(
                "UPDATE `wallets` SET `at_work`=false WHERE `addres`=?",
                [req.body.addres]
            );
        }, 5000);

        const [row] = await conn.execute(
            "SELECT * FROM `coins` WHERE `hash`=?",
            [req.body.hash]
        );

        if (row.length > 0) {

            if (req.body.solo === false) {
                const [rows] = await conn.execute("SELECT * FROM `wallets` WHERE `at_work`=true");

                let reward = row[0].value / rows.length;

                let increment = 0;
                while (increment < rows.length){

                    let final_reward = rows[increment].value + reward;
                    conn.execute(
                        "UPDATE `wallets` SET `value`=? WHERE `addres`=?",[
                            final_reward,
                            rows[increment].addres
                        ]
                    );

                    increment++;
                }

                let now = new Date();
                let isoDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');

                conn.execute(
                    "UPDATE `coins` SET `is_found`=?, `seekers_count`=?, `seeker_reward`=?, `update_date`=? WHERE `hash`=?",[
                        true,
                        rows.length,
                        reward,
                        isoDate,
                        row[0].hash
                    ]
                );
            }

            return res.json({
                result:"Found."
            });

        } else {

            return res.json({
                result:"Not found"
            });

        }

    }
    catch(err){
        next(err);
    }
}