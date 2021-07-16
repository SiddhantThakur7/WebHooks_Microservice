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

};

exports.postRegisterWebHooks = (req, res, next) => {

};

exports.updateWebHooks = (req, res, next) => {

};

exports.deleteWebHooks = (req, res, next) => {

};