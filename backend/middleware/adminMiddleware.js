const jwt = require("jsonwebtoken");

const verifyAdmin = (req, res, next) => {
    // Assume verifyToken has already run and req.user exists
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access denied." });
    }
    next();
};

module.exports = verifyAdmin;