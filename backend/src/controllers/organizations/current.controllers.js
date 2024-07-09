const Organizations = require('../../models/OrganizationsModel');
const asyncHandler = require('express-async-handler');

const currentOrganization = asyncHandler(async (req, res) => {
    const { customId } = req.organization;
    const organization = await Organizations.findOne({ customId });

    if (!organization) {
        return res.status(404).json({
            message: "Organization not found"
        });
    }

    const organizationObj = organization.toObject();
    delete organizationObj.password;

    return res.status(200).json({
        organization: organizationObj,
        message: "Organization found"
    });
});

module.exports = currentOrganization;
