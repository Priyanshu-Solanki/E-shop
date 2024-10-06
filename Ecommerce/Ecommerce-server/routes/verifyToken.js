const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) return res.status(403).json("Invalid Token")
            req.user = user
            next()
        })
    } else {
        return res.status(401).json("You are not authenticated")
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next()
        }
        else
            res.status(403).json("Not Authorized")
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    // Log headers to see if Authorization is present
    verifyToken(req, res, () => {

        if (req.user && req.user.isAdmin) {
            next();
        } else {
            console.log("Not Authorized"); // Log when authorization fails
            res.status(403).json("Not Authorized");
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }