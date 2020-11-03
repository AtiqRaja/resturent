const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const expressip = require('express-ip');
var moment = require("moment");
var nodemailer = require("nodemailer");
var xoauth2 = require("xoauth2");
var formidable = require('formidable');
var fs = require('fs');
var multer = require('multer');
var jstz = require('jstimezonedetect');
var moment_tz = require('moment-timezone');


var auth = require('./../includes/auth');
var account = require('./../includes/account');
router.use(expressip().getIpInfoMiddleware);

var User = require('../../models/user');
var pcats = require('../../models/parent_category');
var ccats = require('../../models/child_category');
var items = require('../../models/menu_items');

router.get('/test-api',function (req,res,next) {
    res.send("this is a test api");
})


router.get('/get-parent-cats',function (req,res,next) {
    pcats.find({status:'active'}).then(function (cats) {
        res.json(cats);
    })
})


module.exports = router;