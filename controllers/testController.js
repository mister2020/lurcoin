const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();


exports.test = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        return res.json({
            test:"Done."
        });

    }
    catch(err){
        next(err);
    }
}