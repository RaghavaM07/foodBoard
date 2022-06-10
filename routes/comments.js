const express = require('express')
const controller = require('../controllers/comments')
const router = express.Router({ mergeParams: true })

router.post('/', controller.makeComment)

router.delete('/:cid', controller.delComment)

module.exports = router