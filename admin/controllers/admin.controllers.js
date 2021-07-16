const axios = require("axios");

exports.getWebHooks = (req, res, next) => {
    axios({
        method: 'GET',
        url: 'http://localhost:8080/webhook/list',
        // responseType: 'text'
      })
        .then(function (response) {
            console.log(response.data);
            res.render('admin', {webhooks: response.data});
        })
        .catch(err => console.log(err));
};

exports.getRegisterWebHooks = (req, res, next) => {
    res.render('admin-register', {bname: 'Register', hook_url: "", hook_id: ""});
};

exports.postRegisterWebHooks = (req, res, next) => {

};

exports.getUpdateHook = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    res.render('admin-register', {bname: 'Update', hook_url: req.query.hook_url, hook_id: req.query.hook_id});
};

exports.updateWebHooks = (req, res, next) => {

};

exports.deleteWebHooks = (req, res, next) => {

};