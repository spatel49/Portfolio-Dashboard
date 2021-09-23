const express = require('express');
const router = express.Router();
const data = require('../data');
const traders = data.traders;
const bcrypt = require('bcryptjs');
const xss = require('xss');

router.get('/', async (req, res) => {
    if(req.session.user) {
        return res.redirect("/users/dashboard");
    }
    res.render('users/login', { title: "Login", loggedIn: false, hasError: false, errors: []});
});

router.post('/', async (req, res) => {
    let {email, password} = req.body;
    email = xss(email);
    password = xss(password);
    let errors = [];
    const emailForCheck = email.toLowerCase();

    const allTraders = await traders.getAllTraders();
    for(let trader of allTraders) {
        if(trader.email === emailForCheck) {
            let passwordMatch = await bcrypt.compare(password, trader.hashPassword);
            if(passwordMatch) {
                let actionItem = "" + new Date() + ": Successfully logged in.";
                const updateHistory = await traders.addTraderHistory(trader._id, actionItem);
                req.session.user = {_id: trader._id, firstName: trader.firstName, lastName: trader.lastName, email: emailForCheck, gender: trader.gender, age: trader.age, stockArray: trader.stockArray, reviewArray: trader.reviewArray, historyArray: trader.historyArray};
                return res.redirect('/users/dashboard');
            } else {
                errors.push('You did not provide a valid username and/or password');
                return res.status(401).render('users/login', {title: "Login", loggedIn: false, hasError: true, errors: errors});
            }
        }
    }
    errors.push('You did not provide a valid username and/or password');
    res.status(401).render('users/login', {title: "Login", loggedIn: false, hasError: true, errors: errors});
});

module.exports = router;
