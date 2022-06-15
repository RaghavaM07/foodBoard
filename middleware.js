const Recipe = require('./models/recipeModel')
const Comment = require('./models/commentModel')

module.exports.isLoggedIn = (req, resp, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Plz sign in to access that page')
        if (req.method === 'POST') {
            const tempArr = req.originalUrl.split('/')
            tempArr.pop()
            req.session.returnTo = tempArr.join('/')
        }
        return resp.redirect('/users/login')
    }
    next()
}

module.exports.isRecipeAuthor = async (req, resp, next) => {
    const rec = await Recipe.findById(req.params.id)
    if (!rec.author.equals(req.user.id)) {
        req.flash('error', 'You don\'t have permission to do that')
        return resp.redirect(`/recipes/${req.params.id}`)
    }
    next()
}

module.exports.isCommentAuthor = async (req, resp, next) => {
    const { id, cid } = req.params
    const com = await Comment.findById(cid);
    if (!com.author.equals(req.user.id)) {
        req.flash('error', 'You don\'t have permission to do that')
        return resp.redirect(`/recipes/${id}`)
    }
    next();
}
