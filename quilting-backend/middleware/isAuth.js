const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).json({err: "Not Authorized"});
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        console.log(error);
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'pLOw!r2VGVszbWX{606e,FeBA]Q<+_');
    } catch (err) {
        return res.status(401).json({err: "Not Authorized"});
        err.statusCode = 500;
        console.log(err);
        throw err;
    }
    if (!decodedToken) {
        return res.status(401).json({err: "Not Authorized"});
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        console.log(error);
        throw error;
    }
    req.userId = decodedToken.userId;
    next();
};

/*

token: 'bearer ' + req.params.token

 */