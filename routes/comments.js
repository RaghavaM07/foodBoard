const express = require('express')
const router = express.Router({ mergeParams: true })
const controller = require('../controllers/comments')
const middleware = require('../middleware')

router.post('/', middleware.isLoggedIn, controller.makeComment)

router.delete('/:cid', middleware.isLoggedIn, middleware.isCommentAuthor, controller.delComment)

module.exports = router