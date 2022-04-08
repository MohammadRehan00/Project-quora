const mongoose = require('mongoose')
//const moment = require('moment')


const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const reNumber = /^[0-9]{10}$/

const validateEmail = function(email) {
    return re.test(email.trim())
};

const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    if(typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

/*const isValidTitle = function(title) {
    return systemConfig.titleEnumArray.indexOf(title) !== -1
}*/

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}
const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}






const isValidNumber = function(value) {
    return !isNaN(Number(value)) && reNumber.test(value.trim())
}



const isValidLength = function(value, min, max) {
    const len = String(value).length
    return len >= min && len <= max
}

const isInValidRange = function(value, min, max) {
    if(!isValidNumber(value)) return false
    return value >= min && value <= max
}




module.exports = {
    validateEmail,
    emailRegex: re,
    isValid,
    isValidRequestBody,
    isValidLength,
    isInValidRange,
    isValidNumber,
    isValidObjectId
    
};