const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 30,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String
    },
    bio: {
        type: String,
        default: '',
        trim: true
    },
    upvotesRec: {
        type: Number,
        default: 0
    },
    downvotesRec: {
        type: Number,
        default: 0
    },
    recipes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        default: []
    },
    upvotedRecipes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        default: []
    },
    downvotedRecipes: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        default: []
    },
    comments: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    }
})

userSchema.virtual('totalScore').get(function () {
    return (this.upvotesRec - this.downvotesRec)
})

module.exports = mongoose.model('User', userSchema);
