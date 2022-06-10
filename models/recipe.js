const mongoose = require('mongoose')
const { Schema } = mongoose

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
    }
}, { timestamps: true })

recipeSchema.pre('validate', function(next){
    this.upvotes = 0
    this.downvotes = 0
    next()
})

// recipeSchema.pre('save', function(next){
//     //Init comments array
//     next()
// })

module.exports = mongoose.model('Recipe', recipeSchema)
