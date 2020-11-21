const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const cron = require('node-cron');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');
var cookieParser = require('cookie-parser');


var compression = require('compression');


const app = express();

app.use(compression());
app.use(cookieParser());


function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }
  
    // fallback to standard filter function
    return compression.filter(req, res)
  }

var bindip = process.env.BINDIP || "127.0.0.1";
var port = process.env.PORT || 3000;

// mongoose.connect(config.database, { useNewUrlParser: true, useUnifiedTopology: true });
// let db = mongoose.connection;

// db.once('open', function() {
//     console.log('Connected to MongoDB');
// });

var db = require('./config/database').MongoURI;
mongoose.connect(db , {useNewUrlParser : true ,  useUnifiedTopology: true})
.then(() => console.log('Database Connected...!'))
.catch(err => console.log(err));
mongoose.set('useCreateIndex', true);

app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname,'public')));

// Express Session Middleware
app.use(session({
    secret: 'chiChuKiMaliyan',
    resave: true, 
    saveUninitialized: true,
    store: new MongoStore({ 
        //mongooseConnection: db , 
        mongooseConnection: mongoose.connection }),
    cookie: {
        expires: 3600000
    }
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    
    res.locals.messages = require('express-messages')(req, res);
   //res.locals.messages = req.flash();
    
    next();

});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

var passportOneSessionPerUser = require('passport-one-session-per-user');
passport.use(new passportOneSessionPerUser());
app.use(passport.authenticate('passport-one-session-per-user'));

app.get('*', function(req, res, next) {
    
    res.locals.user = req.user || null;
    next();
});


// app.get("/", (req, res) => { 
    
//         res.render('website/touchView');
// });

app.get("/news", (req, res) => {
    res.render('website/news');
});

app.get("/games", (req, res) => {
    res.render('website/games');
});


app.get("/pingpong", (req, res) => {
    res.render('website/pingpong');
});

app.get("/hockey", (req, res) => {
    res.render('website/hockey');
});


app.get("/about", (req, res) => {
    res.render('website/about', {
    });
});

app.get("/contact", (req, res) => {
    res.render('website/contact', {
        status:false
    });
});

app.get("/celebrate", (req, res) => {
    res.render('website/celebrate', {
        status:false
    });
});

app.post("/celebrate", (req, res) => {

    console.log(req.body);

    asuman_emails.celebration_mail(req.body.name, req.body.email, req.body.message, req.body.mobile, req.body.noOfPerson, req.body.celbrationDate);

    res.render('website/celebrate', {
        status:true
    });
});


app.post('/contact', function(req, res, next) {

    asuman_emails.contact_us_mail(req.body.name, req.body.email, req.body.message, req.body.mobile);

    res.render('website/contact', {
        status:true
    });

});


var user = require('./controllers/user');
app.use('/', user);

var menu = require('./controllers/menu');
app.use('/', menu);

var table = require('./controllers/tables');
app.use('/tables', table);


app.get('*', function(req, res) {
    res.status(400).render('404');
});


app.listen(port, bindip, () => {
    console.log('Server listing on IP ' + bindip + ' and port ' + port);
});

// cron.schedule('*/1 * * * *', function() {
//     if (db.readyState != 1) {
//         console.log('Checking DB Connection: ' + ((db.readyState == 1)? 'Connected' : 'Not Connected'));        
//     }
// });