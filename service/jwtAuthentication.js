const jwt = require("jsonwebtoken");

const secret = "bLAAbLaa";

function generateToken(user) {
    const { _id,email,role,userProfile,fullName } = user;
    const payload = { _id,email,role,userProfile,fullName };
    const token = jwt.sign(payload,secret);
    console.log(token);
    return token;
}

function validateToken(token) {
    const payload = jwt.verify(token,secret);
    return payload;
}

module.exports ={
    generateToken,
    validateToken,
}