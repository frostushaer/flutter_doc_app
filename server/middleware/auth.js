const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    try {
        const token = req.header("x-auth-token");

        if(!token) {
            return res.status(401).json({ msg: "no auth token, access denied."});
        }
        const verified = jwt.verify(token, "passwordKey");

        if(!verified) {
            return res.status(401).json({ msg: "token verifiaction failed, authorization denied"});
        }

        req.user = verified.id;
        req.token = token;

        // callback function to 
        next();

    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
}

module.exports = auth;