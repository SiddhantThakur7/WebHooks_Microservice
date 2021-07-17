const axios = require("axios");


exports.triggerWebHooks = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    axios({
        method: 'POST',
        url: 'http://localhost:8080/webhook/trigger',
        data: {
            ip: ip
          },
        timeout: 0
      })
        .then((response) => {
            const hooks = response.data.errs.map(item => item.item);
            const codes = response.data.errs.map(item => item.message.split(" ").slice(-1).map(code => parseInt(code, 10))[0]);
            console.log(hooks);
            // res.send(codes);
            res.render('ip', {codes: codes, hooks: hooks});
        })
        .catch(err => console.log(err));
};