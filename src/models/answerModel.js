const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const answerSchema = new mongoose.Schema({
    answeredBy: {
        type: ObjectId,
        ref: 'user',
        required: true,
        trim:true
    },
    text: {
        type: String,
        required: true,
        trim:true
    },
    questionId: {
        type: ObjectId,
        ref: 'question',
        required: true,
        trim:true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }

)
module.exports = mongoose.model('answer', answerSchema)