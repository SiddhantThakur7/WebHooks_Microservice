const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
if (process.env.NODE_ENV != "production") require('dotenv').config();
const axios = require('axios');
const session = require('express-session');
const flash = require('connect-flash');


const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./Models/users.models');


//Creating a store for the ongoing sessions
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions'
});
//Intializing a session
app.use(session({
  secret: process.env.PASS,
  resave: false,
  saveUninitialized: false,
  store: store
}));

//Checking whether a session exists and populating req.user if it true
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      console.log(req.user);
      next();
    })
    .catch((err) => console.log(err));
});

//Importing Routes and Controllers
const accessRoutes = require('./routes/access.routes');
const getLoginPage = require('./controllers/access.controllers').getLoginPage;
const postLogout = require('./controllers/access.controllers').postLogout;
const adminRoutes = require('./routes/admin.routes');
const triggerRoutes = require('./routes/ip.routes');

// ********** GET http://localhost:3000/
app.get('/', getLoginPage);

// ********** POST http://localhost:3000/logout 
app.post('/logout', postLogout);

// ********** http://localhost:3000/access 
app.use('/access', accessRoutes);

// ********** http://localhost:3000/admin 
app.use('/admin', adminRoutes);

// ********** POST http://localhost:3000/ip 
app.use('/ip', triggerRoutes);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

//listen on port 3000 when no production port environment variable exisits.
app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
    const DB_URI = process.env.MONGODB_URI;
		mongoose.connect(DB_URI)
			.then(result => console.log('Database connection established.'))
			.catch(err => console.log(err));
});