const mongoose = require('mongoose')

module.exports.connectDB = function (uri) {
    mongoose.connect(uri)
        .then(() => console.log('Connected to DB'))
        .catch(err => console.error(err))
}
