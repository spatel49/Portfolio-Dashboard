const session = require('express-session');
const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(session({
  name: 'AuthCookie',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: true
  //cookie: {maxAge: 60000}
}));

// app.use('/', (req, res, next) => {
//   if(req.session.user) {
//     return res.render('users/dashboard', {title: "Your Dashboard"});
//   }
//   else {
//     next();
//   }
// });

app.use('/users/dashboard', (req, res, next) => {
  if(!req.session.user) {
      return res.status(403).render('users/notLoggedIn', {title: "Not Logged In"});
  }
  else {
      next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});