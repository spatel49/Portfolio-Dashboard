const usersRoutes = require('./users');
const stocksRoutes = require('./stocks');
const companiesRoutes = require('./companies');
const loginRoutes = require('./login');
const registerRoutes = require('./register');
const profileRoutes = require('./profile');
const historyRoutes = require('./history');
const followingRoutes = require('./following');
const newsRoutes = require('./news');
const logoutRoutes = require('./logout');

const constructorMethod = (app) => {
    app.get('/', (req, res) => {
        if(req.session.user) {
            return res.redirect("/users/dashboard");
        }
        res.render('landing/landingpage', { title: 'Home', loggedIn: false});
    });

    app.use('/login', loginRoutes);
    app.use('/register', registerRoutes);
    app.use('/users', usersRoutes);
    app.use('/stocks', stocksRoutes);
    app.use('/companies', companiesRoutes);
    app.use('/profile', profileRoutes);
    app.use('/history', historyRoutes);
    app.use('/following', followingRoutes);
    app.use('/news', newsRoutes);
    app.use('/logout', logoutRoutes);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Provided route is not found' });
    });
};

module.exports = constructorMethod;
