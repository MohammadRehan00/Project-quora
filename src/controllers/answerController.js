//*****************************************post api*********************************** */

const questionModel = require("../models/questionModel")
const validator = require("../validator/validator")
const jwt = require("../validator/jwt")
const userModel = require("../models/userModel")
const answerModel = require("../models/answerModel")
const createAnswer = async function (req, res) {
    try {
        const userId = req.userId

        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: `Invalid request body` })
        }
        if (!validator.isValid(userId)) {
            res.status(400).send({ status: false, message: `${userId} plz provide  a valid user id` })
            return
        }

        if (!validator.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
            return
        }


        let { answeredBy, text, questionId } = requestBody
        const askBy = await questionModel.findOne({ _id: questionId })

        if (!askBy) {
            return res.status(404).send({ status: false, message: `question not found` })
        }
        if (!validator.isValid(answeredBy)) {
            return res.status(400).send({ status: false, msg: 'Answer is required' })
        }
        if (!validator.isValid(text)) {
            return res.status(400).send({ status: false, msg: 'text is required' })
        }
        if (!validator.isValid(questionId)) {
            return res.status(400).send({ status: false, msg: 'plz provide a valid question' })
        }
        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, msg: 'invalid question id' })
        }


        const asked = await questionModel.findById({ _id: questionId })
        if (asked.askedBy == answeredBy) {
            return res.status(400).send({ status: false, msg: 'user cannot post the answer' })
        }
        let ans = { answeredBy, text, questionId }



        const newAnswer = await answerModel.create(ans)
        return res.status(201).send({ staus: true, message: 'answer created successfully', data: newAnswer })
    }

    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}
//*********************************get api**************************************************** */
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


        const question = await questionModel.findOne({ _id: questionId })
        if (!question) {
            return res.status(400).send({ status: false, msg: 'Invalid question Id' })
        }
        const ans1 = await answerModel.findOne({ questionId: questionId })
        console.log(ans1)
        return res.status(200).send({ status: true, message: "question profile details", data: ans1.text });
        //const question = await answerModel.findOne({ _id: questionId })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }

}
//***************************************update Api****************************************** */
const updateAnswer = async function (req, res) {
    try {
        const userId = req.userId
        console.log('line1'+userId)
        const answer = req.params.answerId
        console.log('line2'+answer)
        const requestBody = req.body
        
            console.log('line3'+requestBody)
            if (!validator.isValidObjectId(userId)) {

                return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
                
            }

            if (!validator.isValidObjectId(answer)) {
                console.log('line4')
                return res.status(400).send({ status: false, message: `${answer} Invalid  answer id ` })
            }

            const user = await userModel.findOne({ _id: userId })
            if (!user) {
                return res.status(404).send({ status: false, message: `user not found` })
            }
            if (!validator.isValidRequestBody(requestBody)) {
                return res.status(404).send({ status: false, message: `not valid request Body` }) 
            }


            let { text } = requestBody
            console.log(text)


            if (text) {
                if (!validator.isValid(text)) {
                    return res.status(400).send({ status: false, msg: 'plz provide answer' })

                }
            }
            if (text === "") {
                return res.status(400).send({ status: false, msg: 'answer is required' })
            }
          const edit = await answerModel.findById({ _id: answer})
         //console.log(edit)
            if (edit.answeredBy != userId) {
       return res.status(400).send({ status: false, msg: 'user cannot post the answer' })
         }

            const updatedAnswerData = await answerModel.findByIdAndUpdate(answer,{text:text})
            //const updatedAnswerData = await answerModel.findOneAndUpdate({text: text},{ new: true })
            res.status(201).send({ status: true, data: updatedAnswerData })
        }
    
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}
//********************************Delete Api************************************************
const deletedAnswer = async function (req, res) {
    try {
        const questionId = req.body.questionId
        const answer =req.params.answerId
        const userId = req.userId
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: ` is not a valid request body` })
        }
        if (!validator.isValidRequestBody(questionId)) {
            return res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
            }
        
        // if (!validator.isValidRequestBody(answer)) { 
        //     return res.status(400).send({ status: false, message: `${questionId} is not a valid question id` })
        // }
       


        if (!validator.isValidObjectId(questionId)) {
            return res.status(400).send({ status: false, message: `${questionId} Invalid question id ` })
        }
        if (!validator.isValidRequestBody(userId)){
            return res.status(400).send({ status: false, message: `${userId} Invalid userid ` })

        }
        
        
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: `${userId} plz provide user id ` })
        }
        const ans = await answerModel.findOne({_Id:answer  })
        console.log(ans.text)
        if (!ans) {
            return res.status(404).send({ status: false, message: `answer id not found` })
        }
        const qst = await answerModel.findOne({questionId:questionId  })
        console.log(qst.text)

        console.log(ans.answeredBy)
        console.log(req.userId)
        
        if (!(ans.text == qst.text)) {
            return res.status(400).send({ status: false, msg: ' answer does not belongs to question ' })
        }
        if (!(ans.answeredBy == userId)) {
            return res.status(400).send({ status: false, msg: 'only user can delete the answer' })
        }

        const deletedAnswerData = await answerModel.findByIdAndDelete({ _id: answer })
        return res.status(201).send({ status: true, data: deletedAnswerData })
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }

}
module.exports = { createAnswer, questionDetail, updateAnswer, deletedAnswer }
