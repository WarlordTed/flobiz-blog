const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//Getting the models
let Blog = require('../models/blog');
let User = require('../models/users');

//Add Blog
router.get('/add', function(req,res){
    res.render('add_blog', {
        title:'Add Blog'
    });
});

//Edit form
router.get('/edit/:id', ensureAuthenticated, function(req,res){
    Blog.findById(req.params.id, function(err, blog){
        if(blog.author != req.user._id){
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_blog', {
            title:'Edit Blog',
            blog:blog
        });
    });
});

//Saving to Database
router.post('/add', ensureAuthenticated,function(req,res){
    check('title','Title is required').notEmpty();
    check('description','Description is required').notEmpty();
    check('body','Body is required').notEmpty();

    let errors = validationResult(req);

    if(!errors.isEmpty()){
        res.render('add_blog', {
            title:'Add Blog',
            errors:errors
        });
    }else{
        let data = new Blog();
        data.title = req.body.title;
        data.author = req.user._id;
        data.description = req.body.description;
        data.body = req.body.body;
    
        data.save(function(err){
            if (err){
                console.log(err);
            }else{
                req.flash('success','Blog Added')
                res.redirect('/');
            }
        });
    }
});

//Saving updated blog to the Database
router.post('/edit/:id', function(req,res){
    let update_blog = {};
    update_blog.title = req.body.title;
    update_blog.description = req.body.description;
    update_blog.body = req.body.body;

    let query = {_id:req.params.id}

    Blog.update(query, update_blog, function(err){
        if (err){
            console.log(err);
        }else{
            req.flash('success','Blog Updated')
            res.redirect('/');
        }
    });
});

//Deleting data
router.delete('/:id', function(req,res){
    let query = {_id:req.params.id}

    Blog.remove(query, function(err){
        if (err){
            console.log(err);
        }
        res.send('Success');
    }); 
});

router.get('/:id', function(req,res){
    Blog.findById(req.params.id, function(err, blog){
        User.findById(blog.author, function(err,user){
            if (err){
                console.log(err);
            }else{
                res.render('blog', {
                    title:'Blog',
                    blog:blog,
                    author: user.name
                });
            }
        });
    });
});

//For authentication
function ensureAuthenticated(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }else{
        req.flash('danger','Please Login');
        res.redirect('user/login');
    }
}

module.exports = router;