const router = require('express').Router()
const userController = require("../apis/user/api/user")
const { successResponse, errorResponse } = require('../helpers/apiResponse')
const { isAuthorized } = require('../helpers/auth')
const upload = require('../helpers/multer')
router.post('/register',registration)
router.post('/login',login)
router.post('/generateAccessToken',generateAccessToken)
router.post('/profilePhoto',isAuthorized,upload,updateProfilePhoto)

async function registration(req, res) {
    try {
        const result = await userController.registration(req, res);

        successResponse("Registered successfully", result, res);
    } catch (error) {

        errorResponse(error, res);
    }
}

async function login(req, res) {
    try {
        const result = await userController.login(req, res);

        successResponse("Login successfully", result, res);
    } catch (error) {

        errorResponse(error, res);
    }
}

async function generateAccessToken(req, res) {
    try {
        const result = await userController.generateAccessToken(req, res);

        successResponse("Access token generated successfully", result, res);
    } catch (error) {

        errorResponse(error, res);
    }
}

async function updateProfilePhoto(req, res) {
    try {
        const result = await userController.updateProfilePhoto(req, res);

        successResponse("Profile photo updated successfully", {}, res);
    } catch (error) {

        errorResponse(error, res);
    }
}
module.exports = router