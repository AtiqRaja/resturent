const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const config = require('../config/database');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        // Match Username
        let query = { $or:[ {username:username}, {email:username} ] };
        User.findOne(query, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { type: 'danger', message: 'No user found' });
            }

            // Match Password
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { type: 'danger', message: 'Wrong password' });
                }
            });
        });
    }));

    passport.use('admin-user-login', new CustomStrategy(
        function(req, done) {

            if (req.user.user_type == "admin") {
                // Match Username
                let query = { username: req.body.username };
                User.findOne(query, function(err, user) {
                    if (err) throw err;
                    if (!user) {
                        return done(null, false, { type: 'danger', message: 'No user found' });
                    }

                    return done(null, user);
                });

            }

        }
    ));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}