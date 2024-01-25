const { verifyToken } = require("../services/jwt.service")

const TokenHandler = (req, res, next) => {
    const isValid = verifyToken(req.headers['x-token']);

    if (!isValid) {
        return res.status(401).json({ message: "No autorizado" });
    } else {
        next();
    }
}

module.exports = {
    TokenHandler
}
