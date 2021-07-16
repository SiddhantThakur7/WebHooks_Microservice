const User = require('../Models/users.models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pass_text = process.env.PASS;

exports.getLoginPage = (req, res, next) => {
    res.render('access');
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({"username": username})
    .then((found) => {
        if(!found){
            res.redirect('/')
        }
        return bcrypt.compare(password, found.password)
    })
    .then((match) => {
        if(!match){
            res.redirect('/')
        }
        res.send('Logged In')
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const con_password = req.body.con_password;
    if(con_password != password){
        res.redirect('/');
    }
    User.findOne({'username': username})
    .then((found) => {
        if(found){
            res.redirect('/');
        }
        return bcrypt.hash(password, saltRounds)
    })
    .then((hash) => {
        const new_user = User({
            username: username,
            password: hash
        });
        return new_user.save()
    })
    .then(() => res.send('Signed Up!'))
    .catch((err) => console.log(err));
};