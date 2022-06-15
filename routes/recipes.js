const express = require('express')
const router = express.Router()
const rcpController = require('../controllers/recipes')
const middleware = require('../middleware')

router.get('/', rcpController.getRecipes)

router.get('/new', middleware.isLoggedIn, (req, resp) => {
    resp.render('recipes/addRecipe')
})

router.get('/:id', rcpController.getRecipe)
router.get('/:id/edit', middleware.isLoggedIn, middleware.isRecipeAuthor, rcpController.updPage)

router.post('/', middleware.isLoggedIn, rcpController.makeRecipe)

router.post('/:id/upvote', middleware.isLoggedIn, rcpController.upvote)
router.post('/:id/downvote', middleware.isLoggedIn, rcpController.downvote)

router.put('/:id', middleware.isLoggedIn, middleware.isRecipeAuthor, rcpController.editRecipe)

router.delete('/:id', middleware.isLoggedIn, middleware.isRecipeAuthor, rcpController.delRecipe)

module.exports = router;