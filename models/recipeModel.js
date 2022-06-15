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
    downvotes: {
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

recipeSchema.methods.upvote = async function (user) {
    this.upvotes += 1
    const aut = await User.findById(this.author)
    aut.upvotesRec += 1;
    await aut.save()
    const recId = this._id
    this.upvotedBy.push(user.id)
    const ind = this.downvotedBy.indexOf(user.id)
    if (ind >= 0) this.downvotedBy.splice(ind, 1)
    await User.findByIdAndUpdate(user.id, { $push: { upvotedRecipes: recId } })
    await this.save()
}

module.exports = mongoose.model('Recipe', recipeSchema)
