const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { check, validationResult } = require('express-validator');

//Getting the model
let User = require('../models/users');

//Register
router.get('/register', function(req,res){
    res.render('register_user', {
        title:'Register'
    });
});

router.post('/register', function(req,res){
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const gender = req.body.gender;
    const age = req.body.age;
    const password = req.body.password;
    const confirm = req.body.confirm;

    check('name','Name is required').notEmpty();
    check('username','UserName is required').notEmpty();
    check('email','Email is not valid').isEmail();
    check('gender','Gender is required').notEmpty();
    check('age','Age is required').notEmpty();
    check('password','Password is required').notEmpty();
    check('confirm','Password do not match').equals(req.body.password);

    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('register_user', {
            title:'Register',
            errors:errors
        });
    }else{
        let newUser = new User({
            name:name,
            username:username,
            email:email,
            gender:gender,
            age:age,
            password:password,
        });

        //Encryption and Hash
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err,hash){
                if (err){
                    console.log(err);
                }
                newUser.password = hash;
    
                newUser.save(function(err){
                    if (err){
                        console.log(err);
                    }else{
                        req.flash('success','User Added, You can now login')
                        res.redirect('/user/login');
                    }
                });
            });
        });
    }
});

//Login
router.get('/login', function(req,res){
    res.render('login', {
        title: 'Login'
    });
});

router.post('/login', function(req,res,next){
    passport.authenticate('local',{
        successRedirect:'/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req,res,next);
});

//Logout
router.get('/logout', function(req,res){
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/user/login');
});

module.exports = router;