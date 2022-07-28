const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        jwt.verify(token, 'secret', (err, user) => {
            if (err) {
                return res.status(401).json({ msg: 'Token is not valid' });
            }
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;