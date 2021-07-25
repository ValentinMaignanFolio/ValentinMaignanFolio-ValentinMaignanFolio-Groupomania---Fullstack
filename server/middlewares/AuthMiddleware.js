const {verify} = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if(!accessToken) return res.json({error: "L'utilisateur n'est pas identifié"});

    try{
        const validToken = verify(accessToken, process.env.SECRET_TOKEN);
        req.user = validToken;
        if(validToken){
            return next();
        }
    }catch(err){
        return res.json({error:err});
    }
};

module.exports = {validateToken};