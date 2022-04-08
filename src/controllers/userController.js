//****************************1st register post api */
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const validator = require("../validator/validator")
const jwt = require("../validator/jwt")

const registerUser = async function (req, res) {
    try {
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, msg: 'Invalid request parameters. Please provide user details' })
        }
        let { fname, lname, email, phone, password } = requestBody
        if (!validator.isValid(fname)) {
            return res.status(400).send({ status: false, msg: 'first name is required' })
        }
        if (!validator.isValid(lname)) {
            return res.status(400).send({ status: false, msg: 'last name is required' })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, msg: 'plz provide email address' })
        }
        if (!validator.validateEmail(email)) {
            return res.status(400).send({ status: false, msg: 'plz provide valid email address' })
        }


        let isEmailAlreadyPresent = await userModel.findOne({ email: requestBody.email })
        if (isEmailAlreadyPresent) {
            return res.status(400).send({ status: false, msg: 'email is already present' })
        }
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, msg: 'plz provide phone number' })
        }
        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, message: `Mobile should be a valid number` })
        }
        let isPhoneAlreadyPresent = await userModel.findOne({ phone: requestBody.phone })
        if (isPhoneAlreadyPresent) {
            return res.status(400).send({ status: false, msg: 'phone number is already present' })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, msg: 'password is required' })
        }
        if (!validator.isValidLength(password, 8, 15)) {
            return res.status(400).send({ status: false, msg: 'password length should be between 8 & 15' })
        }
        const encrypt = await bcrypt.hash(password, 10)
        const userData = { fname, lname, email, phone, password: encrypt }
        const newUser = await userModel.create(userData)
        return res.status(201).send({ staus: true, message: 'user created successfully', data: newUser })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}

//*****************************************login api ************************************/

const loginUser = async function (req, res) {
    try {
        const requestBody = req.body;

        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameters. Please provide login details" });
        }

        // Extract params
        const { email, password } = requestBody;

        // Validation starts
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: `Email is required` });
        }

        if (!validator.validateEmail(email)) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` });
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: `Password is required` });
        }

        // Validation ends
        console.log(email, password)

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(401).send({ status: false, message: `user not exist` });
        }

        //console.log(user)
        const validPassword = await bcrypt.compare(password, user.password);
        console.log(validPassword)

        if (validPassword) {
            console.log(email, validPassword)

            const token = await jwt.createToken({
                userId: user._id, iat: Math.floor(Date.now() / 1000),//issue date
                exp: Math.floor(Date.now() / 1000) + 30 * 60       //expiry  date
            });

            return res.status(200).send({
                status: true, message: `User login successfull`, data: { userId: user._id, token: token },
            });
        }
        else {
            return res.status(400).send({ status: false, message: `put correct Password` });
        }
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}
//***********************************getapi************************************ */
const userDetail = async function (req, res) {
    try {
        const userId = req.params.userId
        const userIdFromToken = req.userId

        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} is not a valid user id` });
        }

        if (!validator.isValid(userId)) {
            res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
            return
        }

        if (!validator.isValid(userIdFromToken)) {
            return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
        }
        const user = await userModel.find({ _id: userId })
        if (!user) {
            return res.status(400).send({ status: false, msg: 'Invalid user Id' })
        }

        return res.status(200).send({ status: true, message: "User profile details", data: user });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}
//*******************************update api*********************************************** */
const updateUser = async function (req, res) {
    try {
        const userId = req.params.userId
        const userIdFromToken = req.userId
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            if (!validator.isValidObjectId(userId)) {
                res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
                return
            }

            if (!validator.isValidObjectId(userIdFromToken)) {
                return res.status(400).send({ status: false, message: `${userIdFromToken} Invalid user id ` })
            }

            const user = await userModel.findOne({ _id: userId })
            if (!user) {
                return res.status(404).send({ status: false, message: `user not found` })
            }

        }
        let { fname, lname, email, phone } = requestBody
        if(fname){
            if (!validator.isValid(fname)) {
                return res.status(400).send({ status: false, msg: 'first name is required' })
            }
        }
        if(fname === ""){ 
            return res.status(400).send({ status: false, msg: 'first name is required' })
        }
        if(lname){
            if (!validator.isValid(lname)) {
                return res.status(400).send({ status: false, msg: 'last name is required' })
            }
        }
        if(lname === ""){
            return res.status(400).send({ status: false, msg: 'last name is required' })
        }
        
        if(email){
            if (!validator.isValid(email)) {
                return res.status(400).send({ status: false, msg: 'plz provide email address' })

            }
            if (!validator.validateEmail(email)) {
                return res.status(400).send({ status: false, msg: 'plz provide valid email address' })
            }
    
    
            let isEmailAlreadyPresent = await userModel.findOne({ email: requestBody.email })
            if (isEmailAlreadyPresent) {
                return res.status(400).send({ status: false, msg: 'email is already present' })
            }
        }
        if(email === ""){
            return res.status(400).send({ status: false, msg: 'email is required' })
        }
        
     if(phone){
        if (!validator.isValid(phone)) {
            return res.status(400).send({ status: false, msg: 'plz provide phone number' })
        }
        if (!validator.isValidNumber(phone)) {
            return res.status(400).send({ status: false, message: `Mobile should be a valid number` })
        }
        let isPhoneAlreadyPresent = await userModel.findOne({ phone: requestBody.phone })
        if (isPhoneAlreadyPresent) {
            return res.status(400).send({ status: false, msg: 'phone number is already present' })
        }
     }
     if(phone === ""){
        return res.status(400).send({ status: false, msg: 'phone is required' })
     }


        const updatedUserData = await userModel.findOneAndUpdate({ _id: userId }, { fname: fname, lname: lname, email: email, phone: phone }, { new: true })
        res.status(201).send({ status: true, data: updatedUserData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

module.exports = { registerUser, loginUser, userDetail, updateUser }

