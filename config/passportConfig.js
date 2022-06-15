const LocalStrategy = require('passport-local').Strategy
const User = require('../models/userModel')
const bcrypt = require('bcrypt')

const configPassport = function (passport) {
    const verifyPass = async (user, password) => {
        return await bcrypt.compare(password, user.password)
    }
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        function (email, password, done) {
            User.findOne({ email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (!verifyPass(user, password)) { return done(null, false); }
                return done(null, user);
            });
        }
    ));
    passport.serializeUser(function (user, done) {
        return done(null, { id: user.id, email: user.email, name: user.name });
    });

    passport.deserializeUser(function (user, done) {
        return done(null, user);
    });
}

module.exports = configPassport