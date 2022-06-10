const mongoose = require('mongoose')
const { Schema } = mongoose
const Comment = require('./commentModel')

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    prepTime: {
        type: Number,
        required: true
    },
    cookTime: {
        type: Number,
        required: true
    },
    serves: {
        type: Number,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: [String],
        required: true
    },
    veg: {
        type: Boolean
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }]
}, { timestamps: true })

recipeSchema.virtual('totalScore').get(function () {
    return (this.upvotes - this.downvotes)
})

recipeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.remove({ _id: { $in: doc.comments } })
    }
})

module.exports = mongoose.model('Recipe', recipeSchema)
