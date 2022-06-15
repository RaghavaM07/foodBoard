const Recipe = require('../models/recipeModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

module.exports.makeComment = catchAsync(async (req, resp) => {
    const u = await User.findById(req.user.id)
    const { body } = req.body
    const com = new Comment({ body })
    com.author = req.user.id
    u.comments.push(com._id)
    const rec = await Recipe.findById(req.params.id)
    rec.comments.push(com)
    await com.save()
    await rec.save()
    await u.save()
    resp.redirect(`/recipes/${rec._id}`)
})

module.exports.delComment = catchAsync(async (req, resp) => {
    const rec = await Recipe.findByIdAndUpdate(req.params.id, { $pull: { comments: req.params.cid } })
    const com = await Comment.findByIdAndDelete(req.params.cid)
    resp.redirect(`/recipes/${rec._id}`)
})
