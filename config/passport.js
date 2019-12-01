const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username,password,done){
        let query = {username:username};

        User.findOne(query, function(err,user){
            if(err){
                console.log(err);
            }
            if (!user){
                return done(null,false,{message:'User Not Found'});
            }

            bcrypt.compare(password,user.password, function(err, isMatch){
                if(err){
                    console.log(err);
                }
                if (isMatch){
                    return done(null,user);
                }else{
                    return done(null,false, {message: 'Wrong Password'});
                }
            })
        });
    }));
    
    //Passport Initialize
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}
