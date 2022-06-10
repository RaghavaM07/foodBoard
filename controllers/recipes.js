const Recipe = require('../models/recipeModel')
const catchAsync = require('../utils/catchAsync')
const DbError = require('../utils/DbError')

module.exports.getRecipes = catchAsync(async (req, resp) => {
    const r = await Recipe.find({}).sort({ upvotes: -1 }).limit(50);
    resp.send(r)
})

module.exports.makeRecipe = catchAsync(async (req, resp) => {
    const { name, desc, prepTime, cookTime, serves, ingredients, instructions, veg } = req.body.recipe
    const r = new Recipe({ name, desc, prepTime, cookTime, serves, ingredients, instructions, veg })
    await r.save()
    resp.send(await Recipe.findById(r._id))
})

module.exports.editRecipe = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id)
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    const { name, desc, prepTime, cookTime, serves, ingredients, instructions, veg } = req.body.recipe
    await Recipe.findByIdAndUpdate(req.params.id, { name, desc, prepTime, cookTime, serves, ingredients, instructions, veg })
    resp.redirect(`/recipes/${r._id}`)
})

module.exports.delRecipe = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id)
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    await Recipe.findByIdAndDelete(req.params.id)
    resp.redirect('/recipes')
})

module.exports.getRecipe = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id).populate('comments')
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    resp.send(r)
})
