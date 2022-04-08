 const express = require('express');

 const router = express.Router();

// router.get('/test-me', function (req, res) {
//     res.send('My first ever api!')
// });
const UserController = require('../controllers/userController')
const QuestionController = require('../controllers/questionController')
const authMiddleware = require('../middlewares/auth.middleware')
const AnswerController = require('../controllers/answerController')

//featue1 API
router.post("/registerUser", UserController.registerUser)
router.post("/loginUser", UserController.loginUser)
router.get('/user/:userId/profile', authMiddleware, UserController.userDetail )
 router.put('/user/:userId/profile', authMiddleware, UserController.updateUser )
//feature2 APi
router.post("/question",authMiddleware,QuestionController.createQuestion)
router.get("/questions/:questionId",QuestionController.questionDetail)
router.put('/questions/:questionId',authMiddleware,QuestionController.updatedQuestion )
router.delete('/questions/:questionId',authMiddleware,QuestionController.deletedQuestion )
//feature3 Api
router.post('/answer',authMiddleware,AnswerController.createAnswer )
router.get('/questions/:questionId/answer',AnswerController.questionDetail)
router.put('/answer/:answerId',authMiddleware,AnswerController.updateAnswer )
router.delete('/answer/:answerId',authMiddleware,AnswerController.deletedAnswer )
module.exports = router;