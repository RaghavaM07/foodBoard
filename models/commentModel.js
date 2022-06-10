const mongoose = require('mongoose')
const { Schema } = mongoose

const commentSchema = new Schema({
    body: {
        type: String,
        required: [true, 'Comment can\'t be empty!']
    }
}, { timestamps: true })

module.exports = mongoose.model('Comment', commentSchema)
