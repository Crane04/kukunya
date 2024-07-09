// controllers/userController.js
const User = require('../../models/UserModel'); // Adjust the path as needed
const asyncHandler = require('express-async-handler');

const currentUser = asyncHandler(async (req, res) => {
    const { email } = req.user;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(200).json({
        user: userObj,
        message: "User found"
    });
});

module.exports = currentUser 
