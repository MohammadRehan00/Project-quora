const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const questionSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: [String], 
    askedBy: 
    {
        type: ObjectId,
        ref: 'user',
        required: true,
        trim: true
    },
    deletedAt: Date,
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
)
 module.exports =  mongoose.model('question',questionSchema) 




