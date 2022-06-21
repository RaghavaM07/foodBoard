const mongoose = require('mongoose')
const { Schema } = mongoose
const Comment = require('./commentModel')
const User = require('./userModel')

const recipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
        type: Boolean,
        required: [true, 'Please specify veg/non-veg']
    },
    upvotes: {
        type: Number,
        default: 0
    },
    totalScore: {
        type: Number,
        default: 0
    },
    upvotedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    downvotedBy: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: []
    }],
    imgUrl: {
        type: String,
        default: undefined
    },
    imgPubId: {
        type: String,
        default: undefined
    }
}, { timestamps: true })

recipeSchema.virtual('downvotes').get(function () {
    return (this.upvotes - this.totalScore)
})

recipeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.remove({ _id: { $in: doc.comments } })
    }
})

module.exports = mongoose.model('Recipe', recipeSchema)
