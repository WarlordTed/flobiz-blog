require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

//Database connected
mongoose.connect(config.database);
let db = mongoose.connection;

//Checking for errors 
db.once('open', function(){
    console.log('Connected to the BlogDB');
});
db.on('error', function(err){
    console.log(err);
});

//App Start
const app = express();

//Getting the model
let Blog = require('./models/blog');

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Session Necessary
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

//Message Necessary
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Passport Necessary
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//Initialize login global
app.get('*', function(req,res,next){
    res.locals.user = req.user || null;
    next();
})

//Views join
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

//Public join
app.use(express.static(path.join(__dirname,'public')));

//Home 
app.get('/',function(req,res){
    Blog.find({}, function(err,blogs){
        if (err){
            console.log(err);
        }else{
            res.render('index', {
                title:'FloBiz Blog',
                blogs: blogs
            });
        }
    });
});

//Routes addition
let blogRoutes = require('./routes/routes');
let userRoutes = require('./routes/user_routes');
app.use('/blog', blogRoutes);
app.use('/user', userRoutes);

//Server
app.listen(process.env.PORT,function(){
    console.log(`Server has started at port ${process.env.PORT}.`);
});
