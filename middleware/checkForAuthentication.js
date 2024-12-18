const { validateToken } = require("../service/jwtAuthentication");

function checkForAuthentication(token){
    return (req,res,next) => {
    const cookieToken = req.cookies[token];
    if(!cookieToken) {
        return next();
    }

    try{
        const payload = validateToken(cookieToken);
        req.user = payload;
    }catch{}

    return next();
    }
} 

module.exports = {
    checkForAuthentication,
}