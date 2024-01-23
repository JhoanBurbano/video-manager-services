const { verifyToken } = require("./jwt.service");

function getId(headers) {
    const token = headers['x-token']
    const {id} = verifyToken(token);
    return id
}

module.exports = {
    getId
}