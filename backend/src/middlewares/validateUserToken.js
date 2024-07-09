const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Adjust the path as needed
require('dotenv').config();
const app_sk = process.env.APP_SK;

const ValidateUser = async (req, res, next) => {
    let token;
    let authHeader = req?.headers?.Authorization || req?.headers?.authorization || req?.cookies?.jwt;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, app_sk, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    "detail": "User is unauthenticated!"
                });
            }

            // Find the User by the id in the token
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    "detail": "User not found!"
                });
            }

            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({
            "message": "Missing token"
        });
    }
};

module.exports = ValidateUser;
