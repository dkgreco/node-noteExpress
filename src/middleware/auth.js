const
    jwt = require('jsonwebtoken'),
    User = require('../models/users'),
    _auth = async (req, res, next) => {
        try {
            const
                token = req.header('Authorization').replace('Bearer ', ''),
                decodedPayload = jwt.verify(token, 'Crystals123'),
                user = await User.findOne({ _id: decodedPayload._id, 'tokens.token': token });

            if (!user) {
                throw new Error();
            }

            req.token = token;
            req.user = user;

            next();
        } catch (e) {
            return res.status(401).send({ error: "Please Authenticate "});
        }
    };

module.exports = {
    auth: _auth
};