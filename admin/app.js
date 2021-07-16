const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
if (process.env.NODE_ENV != "production") require('dotenv').config();
const axios = require('axios');

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const accessRoutes = require('./routes/access.routes');
const getLoginPage = require('./controllers/access.controllers').getLoginPage;
const adminRoutes = require('./routes/admin.routes');
const triggerRoutes = require('./routes/ip.routes')


app.get('/', getLoginPage);

app.use('/access', accessRoutes);

app.use('/admin', adminRoutes);

app.use('/ip', triggerRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    const DB_URI = process.env.MONGODB_URI;
		mongoose.connect(DB_URI)
			.then(result => console.log('Database connection established.'))
			.catch(err => console.log(err));
});