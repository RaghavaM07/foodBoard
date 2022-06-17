const Recipe = require('../models/recipeModel')
const User = require('../models/userModel')
const Comment = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')
const DbError = require('../utils/DbError')

module.exports.getRecipes = catchAsync(async (req, resp) => {
    const selectingFields = {
        "name": 1,
        "desc": 1,
        "_id": 1,
        "upvotes": 1,
        "totalScore": 1,
        "author": 1
    }
    const r = await Recipe.find({}, selectingFields).sort({ totalScore: -1 }).limit(50)
    resp.render('recipes/allRecipes', { recipes: r })
})

module.exports.makeRecipe = catchAsync(async (req, resp) => {
    const { name, desc, prepTime, cookTime, serves, ingText, instText, isVeg } = req.body
    let veg = true
    if (!isVeg) veg = false
    let ingredients = [], instructions = []
    let tempText = String(ingText).split('\r\n')
    tempText.map(ele => {
        let t = ele.split('=')
        ingredients.push(...t)
    })
    ingredients = ingredients.filter(ing => (ing !== ''))
    tempText = String(instText).split('\r\n')
    tempText.map(ele => {
        let t = ele.split('=')
        instructions.push(...t)
    })
    instructions = instructions.filter(ins => (ins !== ''))
    const r = new Recipe({ name, desc, prepTime, cookTime, serves, ingredients, instructions, veg })
    r.author = req.user.id
    await r.save()
    const u = await User.findById(req.user.id)
    u.recipes.push(r._id)
    await u.save()
    resp.redirect(`/recipes/${r._id}`)
})

module.exports.editRecipe = catchAsync(async (req, resp, next) => {
    const { name, desc, prepTime, cookTime, serves, ingText, instText, isVeg } = req.body
    let veg = true
    if (!isVeg) veg = false
    let ingredients = [], instructions = []
    let tempText = String(ingText).split('\r\n')
    tempText.map(ele => {
        let t = ele.split('=')
        ingredients.push(...t)
    })
    ingredients = ingredients.filter(ing => (ing !== '' && ing.trim()))
    tempText = String(instText).split('\r\n')
    tempText.map(ele => {
        let t = ele.split('=')
        instructions.push(...t)
    })
    instructions = instructions.filter(ins => (ins !== '' && ins.trim()))
    await Recipe.findByIdAndUpdate(req.params.id, { name, desc, prepTime, cookTime, serves, ingredients, instructions, veg })
    resp.redirect(`/recipes/${req.params.id}`)
})

module.exports.delRecipe = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id).populate('comments')
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    if (String(req.user.id) !== String(r.author)) {
        req.flash('error', 'You don\'t have permission to do that')
        return resp.redirect(`/recipes/${req.params.id}`)
    }
    await User.findByIdAndUpdate(r.author, { $pull: { recipes: req.params.id } })
    r.comments.forEach(async (comm) => {
        await User.findByIdAndUpdate(comm.author, { $pull: { comments: comm._id } })
        await Comment.findByIdAndDelete(comm._id)
    })
    await Recipe.findByIdAndDelete(req.params.id)
    resp.redirect('/recipes')
})

module.exports.getRecipe = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    if (req.user) {
        var upped, downed
        const u = await User.findById(req.user.id)
        upped = u.upvotedRecipes.indexOf(req.params.id) >= 0
        downed = u.downvotedRecipes.indexOf(req.params.id) >= 0
    }
    resp.render('recipes/showRecipe', { recipe: r, upped, downed })
})

module.exports.upvote = catchAsync(async (req, resp, next) => {
    const u = await User.findById(req.user.id)
    const r = await Recipe.findById(req.params.id)
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    const aut = await User.findById(r.author)
    const upped = u.upvotedRecipes.indexOf(req.params.id) >= 0
    const downed = u.downvotedRecipes.indexOf(req.params.id) >= 0
    if (upped) {
        r.upvotes -= 1
        r.totalScore -= 1
        r.upvotedBy.splice(r.upvotedBy.indexOf(req.user.id), 1);
        aut.upvotesRec -= 1
        await User.findByIdAndUpdate(req.user.id, { $pull: { upvotedRecipes: r._id } })
    }
    else if (downed) {
        r.upvotes += 1
        r.upvotedBy.push(req.user.id);
        aut.upvotesRec += 1
        r.totalScore += 2
        r.downvotedBy.splice(r.downvotedBy.indexOf(req.user.id), 1);
        aut.downvotesRec -= 1
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { downvotedRecipes: r._id },
            $push: { upvotedRecipes: r._id }
        })
    }
    else {
        r.upvotes += 1
        r.totalScore += 1
        r.upvotedBy.push(req.user.id);
        aut.upvotesRec += 1
        await User.findByIdAndUpdate(req.user.id, { $push: { upvotedRecipes: r._id } })
    }
    await r.save()
    await aut.save()
    resp.redirect(`/recipes/${r._id}`)
})
module.exports.downvote = catchAsync(async (req, resp, next) => {
    const u = await User.findById(req.user.id)
    const r = await Recipe.findById(req.params.id)
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    const aut = await User.findById(r.author)
    const upped = u.upvotedRecipes.indexOf(req.params.id) >= 0
    const downed = u.downvotedRecipes.indexOf(req.params.id) >= 0
    if (downed) {
        r.totalScore += 1
        r.downvotedBy.splice(r.downvotedBy.indexOf(req.user.id), 1);
        aut.downvotesRec -= 1
        await User.findByIdAndUpdate(req.user.id, { $pull: { downvotedRecipes: r._id } })
    }
    else if (upped) {
        r.downvotedBy.push(req.user.id);
        aut.downvotesRec += 1
        r.upvotes -= 1
        r.totalScore -= 2
        r.upvotedBy.splice(r.upvotedBy.indexOf(req.user.id), 1);
        aut.upvotesRec -= 1
        await User.findByIdAndUpdate(req.user.id, {
            $push: { downvotedRecipes: r._id },
            $pull: { upvotedRecipes: r._id }
        })
    }
    else {
        r.totalScore -= 1
        r.downvotedBy.push(req.user.id);
        aut.downvotesRec += 1
        await User.findByIdAndUpdate(req.user.id, { $push: { downvotedRecipes: r._id } })
    }
    await r.save()
    await aut.save()
    resp.redirect(`/recipes/${r._id}`)
})

module.exports.updPage = catchAsync(async (req, resp, next) => {
    const r = await Recipe.findById(req.params.id)
    if (!r) {
        return next(new DbError('Recipe not found!', 404))
    }
    resp.render('recipes/editRecipe', { recipe: r })
})
