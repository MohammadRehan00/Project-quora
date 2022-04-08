//****************************post api******************************************** */
const questionModel = require("../models/questionModel")
const validator = require("../validator/validator")
const jwt = require("../validator/jwt")
const userModel = require("../models/userModel")
const createQuestion = async function (req, res) {
    try {
        const userId = req.userId
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: `Invalid request body` })
        }
        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
            return
        }
        let { description, tags, askedBy } = requestBody
        const user = await userModel.findOne({ _id: askedBy })
        if (!user) {
            return res.status(404).send({ status: false, message: `user not found` })
        }
        if (!validator.isValid(description)) {
            return res.status(400).send({ status: false, msg: 'description is required' })
        }


        if (tags) {
            if (!validator.isValid(tags)) {
                return res.status(400).send({ status: false, msg: 'tags is required' })
            }

        }

        if (!validator.isValidObjectId(askedBy)) {
            return res.status(400).send({ status: false, msg: 'plz provide user' })
        }

        const questionData = { description, askedBy }
        if (tags) {
           if (tags.length > 0) {
                const newQuestion = await questionModel.create(requestBody)
                return res.status(201).send({ staus: true, message: 'question created successfully', data: newQuestion })
            }
        }
        const nQuestion = await questionModel.create(questionData)
        return res.status(201).send({ staus: true, message: 'question created successfully', data: nQuestion })



    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}
//***************************************get api to find questions************************************ */
const questionDetail = async function (req, res) {
    try {
        const questionId = req.params.questionId


        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `${questionId} is not a valid question id` });
        }

        if (!validator.isValid(questionId)) {
            res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
            return
        }


        const question = await questionModel.find({ _id: questionId })
        if (!question) {
            return res.status(400).send({ status: false, msg: 'Invalid question Id' })
        }

        return res.status(200).send({ status: true, message: "question details", data: question });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}
//**************************************update api***************************************
const updatedQuestion = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const questionIdFromToken = req.userId
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            if (!validator.isValidObjectId(userId)) {
                res.status(400).send({ status: false, message: `${questionId} is not a valid user id` })
                return
            }
        }


        if (!validator.isValidObjectId(questionIdFromToken)) {
            return res.status(400).send({ status: false, message: `${questionIdFromToken} Invalid question id ` })
        }

        const question = await questionModel.findOne({ _id: questionId })
        console.log(question)
        if (!question) {
            return res.status(404).send({ status: false, message: `question not found` })
        }

        let userIdFromQuestion = question.askedBy
        console.log(userIdFromQuestion)

        let { description, tags } = requestBody
        if (description) {
            if (!validator.isValid(description)) {
                return res.status(400).send({ status: false, msg: 'description is required' })
            }
        }
        if (description === "") {
            return res.status(400).send({ status: false, msg: 'description is required' })
        }
        if (tags) {
            if (!validator.isValid(tags)) {
                return res.status(400).send({ status: false, msg: 'tags is required' })
            }
        }
        if (tags === "") {
            return res.status(400).send({ status: false, msg: 'tags is required' })
        }
        if (!(questionIdFromToken == userIdFromQuestion)) {
            return res.status(400).send({ status: false, msg: 'id doesnt match' })
        }

        const updatedQuestionData = await questionModel.findOneAndUpdate({ _id: questionId }, { description: description, tags: tags }, { new: true })
        res.status(201).send({ status: true, data: updatedQuestionData })
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }

}
//**********************************************delete api*************************************** */
const deletedQuestion = async function (req, res) {
    try {
        const questionId = req.params.questionId
        const questionIdFromToken = req.userId
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            if (!validator.isValidObjectId(questionId)) {
                res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
                return
            }
        }


        if (!validator.isValidObjectId(questionIdFromToken)) {
            return res.status(400).send({ status: false, message: `${questionIdFromToken} Invalid question id ` })
        }

        const question = await questionModel.findOne({ _id: questionId })
        console.log(question)
        if (!question) {
            return res.status(404).send({ status: false, message: `question not found` })
        }

        let userIdFromQuestion = question.askedBy
        console.log(userIdFromQuestion)


        if (!(questionIdFromToken == userIdFromQuestion)) {
            return res.status(400).send({ status: false, msg: 'id doesnt match' })
        }

        const deletedQuestionData = await questionModel.findByIdAndDelete({ _id: questionId })
        return res.status(201).send({ status: true, data: deletedQuestionData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

}
module.exports = { createQuestion, questionDetail, updatedQuestion, deletedQuestion }