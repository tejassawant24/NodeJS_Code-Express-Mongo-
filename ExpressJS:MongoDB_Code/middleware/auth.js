let jwt = require('jsonwebtoken');
let config = require('config');

//Custom Middleware
function UserAuthMiddleware(req, res, next) {

    let token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).send('cannot get user token! please try again')
    }

    try {
        let decoded = jwt.verify(token, config.get('usertoken'));
        req.users = decoded;
        next();
    } catch (ex) {
        res.send("invalid token");
    }
}

module.exports = UserAuthMiddleware;