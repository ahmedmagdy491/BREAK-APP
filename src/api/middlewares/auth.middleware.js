const jwt = require('jsonwebtoken');
const { User } = require('../controllers/users.controller');

const auth = async (req, res, next) => {
    let token;
    try {
        token = req.headers.authorization.split(' ')[1];

        jwt.verify(token, process.env.SECRET_KEY, (error, result) => {
            if (error) {
                res.status(401).json({ error: 'NOT_AUTHORIZED' });
                return;
            }
            req.user = new User(result).toJson();
            next();
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

module.exports = auth;
