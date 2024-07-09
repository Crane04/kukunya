const jwt = require("jsonwebtoken");
const Organizations = require("../models/OrganizationsModel"); // Adjust the path as needed
require('dotenv').config();
const app_sk = process.env.APP_SK;

const ValidateOrganization = async (req, res, next) => {
    let token;
    let authHeader = req?.headers?.Authorization || req?.headers?.authorization || req?.cookies?.jwt;

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];

        jwt.verify(token, app_sk, async (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    "detail": "Organization is unauthenticated!"
                });
            }

            // Find the organization by the id in the token
            const organization = await Organizations.findById(decoded.id);

            if (!organization) {
                return res.status(401).json({
                    "detail": "Organization not found!"
                });
            }

            // Attach the organization to the request object
            req.organization = organization;
            next();
        });
    } else {
        return res.status(401).json({
            "message": "Missing token"
        });
    }
};

module.exports = ValidateOrganization;
