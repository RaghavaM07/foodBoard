const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    body: {
        type: String,
        required: [true, 'Comment can\'t be empty!']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentedOn: {
        type: Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)
