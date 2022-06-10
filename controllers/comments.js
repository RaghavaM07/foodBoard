const Recipe = require('../models/recipeModel')
const Comment = require('../models/commentModel')
const catchAsync = require('../utils/catchAsync')
const DbError = require('../utils/DbError')

module.exports.makeComment = catchAsync(async (req, resp) => {
    const { body } = req.body.comment
    const com = new Comment({ body })
    const rec = await Recipe.findById(req.params.id)
    rec.comments.push(com)
    await com.save()
    await rec.save()
    resp.redirect(`/recipes/${rec._id}`)
})

module.exports.delComment = catchAsync(async (req, resp) => {
    const rec = await Recipe.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.cid } })
    const com = await Comment.findByIdAndDelete(req.params.cid)
    resp.redirect(`/recipes/${rec._id}`)
})
