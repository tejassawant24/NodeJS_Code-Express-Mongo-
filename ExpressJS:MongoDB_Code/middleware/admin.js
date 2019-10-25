function Admin(req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(401).send('Access Denied');
    }
    next();
}

module.exports = Admin;